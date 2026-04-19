import { useCallback, useEffect, useState } from "react";
import { collection, doc } from "firebase/firestore";
import { db, submitDenuncia, uploadDenunciaFiles, fetchDenunciasByEmail, fetchAllDenuncias } from "../firebase";
import "./Denuncia.css";

export default function Denuncia({ user }) {
  const [modalidad, setModalidad] = useState("Anónimo (Protección contra represalias)");
  const [lineaServicio, setLineaServicio] = useState("");
  const [cargo, setCargo] = useState("");
  const [areaIncidente, setAreaIncidente] = useState("");
  const [responsable, setResponsable] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [denuncias, setDenuncias] = useState([]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    if (timestamp.toDate) return timestamp.toDate().toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" });
    return new Date(timestamp).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" });
  };

  // Guardar progreso automáticamente en localStorage
  useEffect(() => {
    const formData = {
      modalidad,
      lineaServicio,
      cargo,
      areaIncidente,
      responsable,
      descripcion
    };
    localStorage.setItem('denunciaDraft', JSON.stringify(formData));
  }, [modalidad, lineaServicio, cargo, areaIncidente, responsable, descripcion]);

  // Cargar progreso guardado al montar el componente
  useEffect(() => {
    const savedDraft = localStorage.getItem('denunciaDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setModalidad(draft.modalidad || "Anónimo (Protección contra represalias)");
        setLineaServicio(draft.lineaServicio || "");
        setCargo(draft.cargo || "");
        setAreaIncidente(draft.areaIncidente || "");
        setResponsable(draft.responsable || "");
        setDescripcion(draft.descripcion || "");
      } catch (error) {
        console.warn('Error loading saved draft:', error);
      }
    }
  }, []);

  // Limpiar draft después de envío exitoso
  const clearDraft = () => {
    localStorage.removeItem('denunciaDraft');
  };

  const approvedHrEmails = [
    "rrhh@pwc.com",
    "rh@pwc.com",
    "rh@empresa.com"
  ];

  const isHrUser = user?.email ? approvedHrEmails.includes(user.email.toLowerCase()) : false;

  const loadDenuncias = useCallback(async () => {
    if (!user?.email) {
      setDenuncias([]);
      return;
    }

    try {
      const items = isHrUser
        ? await fetchAllDenuncias()
        : await fetchDenunciasByEmail(user.email);

      setDenuncias(items.sort((a, b) => (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0)));
    } catch (error) {
      console.error("Error cargando denuncias:", error);
    }
  }, [user, isHrUser]);

  useEffect(() => {
    loadDenuncias();
  }, [loadDenuncias]);

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files || []);
    setAttachments(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!descripcion.trim()) {
      setError("Por favor describe los hechos para enviar la denuncia.");
      return;
    }

    // Validación básica - no validar archivos aquí, dejar que el sistema los maneje

    setLoading(true);
    setError(""); // Limpiar errores previos

    try {
      const reference = doc(collection(db, "denuncias"));
      const caso = reference.id.slice(0, 8).toUpperCase();
      let uploadedFiles = [];
      let uploadWarnings = [];

      if (attachments.length > 0) {
        console.log("Iniciando upload de archivos...");
        const { uploadedFiles: filesUploaded, failedUploads } = await uploadDenunciaFiles(reference.id, attachments);
        uploadedFiles = filesUploaded;
        console.log("Upload de archivos finalizado");

        if (failedUploads.length > 0) {
          failedUploads.forEach(({ fileName, error }) => {
            uploadWarnings.push(`No se pudo subir ${fileName}: ${error}`);
          });
        }

        if (uploadedFiles.length < attachments.length) {
          uploadWarnings.push(`Tu denuncia se enviará con los archivos que sí se subieron.`);
        }

        const compressedFiles = uploadedFiles.filter(f => f.compressed);
        if (compressedFiles.length > 0) {
          uploadWarnings.push(`Se optimizaron ${compressedFiles.length} imagen(es) para subir más rápido.`);
        }
      }

      await submitDenuncia(
        {
          modalidad,
          lineaServicio,
          cargo,
          areaIncidente,
          responsable,
          descripcion,
          attachments: uploadedFiles,
          archivos: uploadedFiles,
          caseNumber: caso,
          uploadWarnings: uploadWarnings.length > 0 ? uploadWarnings : null
        },
        reference.id
      );

      // Construir mensaje de éxito con advertencias si las hay
      let successMessage = `Denuncia enviada correctamente. Tu número de caso es ${caso}. El área de RH revisará tu reporte y te contactará si es necesario.`;

      if (uploadWarnings.length > 0) {
        successMessage += `\n\nNota: ${uploadWarnings.join(' ')}`;
      }

      setMessage(successMessage);
      setModalidad("Anónimo (Protección contra represalias)");
      setLineaServicio("");
      setCargo("");
      setAreaIncidente("");
      setResponsable("");
      setDescripcion("");
      setAttachments([]);

      // Limpiar el borrador guardado
      clearDraft();
      
      if (isHrUser) {
        await loadDenuncias();
      }
    } catch (error) {
      console.error("Error enviando denuncia:", error);
      setError(error.message || "Error al enviar la denuncia. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="denuncia-page">
      {isHrUser ? (
        <>
          <div className="denuncia-header">
            <h1 className="denuncia-title">Panel de denuncias</h1>
            <p className="denuncia-subtitle">Consulta los reportes registrados por los empleados.</p>
          </div>

          <div className="denuncia-panel-card">
            {denuncias.length === 0 ? (
              <div className="denuncia-alert denuncia-info">No hay denuncias registradas todavía.</div>
            ) : (
              <div className="denuncia-panel-list">
                {denuncias.map((denunciaItem) => (
                  <article key={denunciaItem.id} className="denuncia-panel-item">
                    <div className="denuncia-panel-meta">
                      <span className="denuncia-panel-case">Caso #{denunciaItem.caseNumber || denunciaItem.id.slice(0, 8).toUpperCase()}</span>
                      <span className="denuncia-panel-date">{formatTimestamp(denunciaItem.fecha)}</span>
                    </div>
                    <p className="denuncia-panel-field">
                      <strong>Denunciante:</strong> {
                        denunciaItem.modalidad === 'Identificado' && denunciaItem.usuario
                          ? `${denunciaItem.usuario.nombre || 'Usuario'} (${denunciaItem.usuario.email})`
                          : 'Anónimo (Protección contra represalias)'
                      }
                    </p>
                    <p className="denuncia-panel-field"><strong>Área incidente:</strong> {denunciaItem.areaIncidente || 'No indicado'}</p>
                    <p className="denuncia-panel-field"><strong>Responsable:</strong> {denunciaItem.responsable || 'No indicado'}</p>
                    <p className="denuncia-panel-field"><strong>Descripción:</strong> {denunciaItem.descripcion}</p>
                    {(
                      (denunciaItem.attachments && denunciaItem.attachments.length > 0) ||
                      (denunciaItem.archivos && denunciaItem.archivos.length > 0)
                    ) && (
                      <div className="denuncia-panel-attachments">
                        <strong>Adjuntos:</strong>
                        <div className="attachments-grid">
                          {(denunciaItem.attachments || denunciaItem.archivos).map((file, index) => {
                            console.log('Procesando archivo:', index, file);

                            // Mejor detección de imágenes - verificar múltiples formas
const fileName = file.nombre || file.originalName || file.name || '';
                            const fileUrl = file.url || '';

                            const isImage = fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i) ||
                                          fileUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|tiff)(\?|$)/i) ||
                                          file.type === 'image' ||
                                          fileUrl.includes('firebase') && (
                                            fileName.includes('.jpg') || fileName.includes('.jpeg') ||
                                            fileName.includes('.png') || fileName.includes('.gif') ||
                                            fileName.includes('.webp')
                                          );

                            console.log('Archivo detectado como imagen:', isImage, 'Nombre:', fileName, 'URL:', fileUrl);

                            return (
                              <div key={file.url || index} className="attachment-item">
                                {isImage ? (
                                  <div className="attachment-image-container">
                                    <img
                                      src={file.url}
                                      alt={file.originalName || file.name}
                                      className="attachment-image"
                                      onLoad={() => console.log('Imagen cargada correctamente:', file.url)}
                                      onError={(e) => {
                                        console.error('Error cargando imagen:', file.url, e);
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                      }}
                                    />
                                    <a href={file.url} target="_blank" rel="noreferrer" className="attachment-link">
                                      📷 {file.originalName || file.name}
                                    </a>
                                  </div>
                                ) : (
                                  <a href={file.url} target="_blank" rel="noreferrer" className="attachment-link">
                                    📎 {file.originalName || file.name}
                                  </a>
                                )}
                                {file.compressed && (
                                  <span className="attachment-compressed">⚡ Optimizado</span>
                                )}
                                <div className="debug-info" style={{fontSize: '10px', color: '#666', marginTop: '4px'}}>
                                  Debug: {fileName} | URL: {fileUrl.substring(0, 50)}...
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="denuncia-header">
            <h1 className="denuncia-title">Nueva Denuncia</h1>
            <p className="denuncia-subtitle">Su reporte será procesado con total confidencialidad.</p>
          </div>

          <div className="denuncia-form-card">
            <div className="denuncia-info-box">
              <strong>Tu seguridad es nuestra prioridad:</strong> Este formulario está diseñado para ser rápido y seguro. Si tienes dificultades técnicas, tu denuncia aún se enviará. Toma tu tiempo, estamos aquí para ayudarte.
              <br />
              También puedes enviar un correo a <a href="mailto:denuncias@pwc.com?subject=Denuncia%20PwC">denuncias@pwc.com</a> si lo prefieres.
            </div>

            {message && (
              <div className="denuncia-alert denuncia-success" style={{ whiteSpace: 'pre-line' }}>
                {message}
              </div>
            )}
            {error && <div className="denuncia-alert denuncia-error">{error}</div>}

            {/* Indicador de borrador guardado */}
            {descripcion.trim() && (
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196f3',
                borderRadius: '4px',
                fontSize: '13px',
                color: '#1976d2',
                marginBottom: '15px'
              }}>
                💾 Tu progreso se guarda automáticamente. Puedes cerrar esta página y continuar luego.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="denuncia-field">
                <label className="denuncia-label">Modalidad</label>
                <select className="denuncia-select" value={modalidad} onChange={(event) => setModalidad(event.target.value)}>
                  <option>Anónimo (Protección contra represalias)</option>
                  <option>Identificado</option>
                </select>
              </div>

              <div className="denuncia-row">
                <div className="denuncia-field">
                  <label className="denuncia-label">Línea de Servicio</label>
                  <input
                    className="denuncia-input"
                    value={lineaServicio}
                    onChange={(event) => setLineaServicio(event.target.value)}
                    placeholder="Ej: Auditoría"
                  />
                </div>
                <div className="denuncia-field">
                  <label className="denuncia-label">Cargo</label>
                  <input
                    className="denuncia-input"
                    value={cargo}
                    onChange={(event) => setCargo(event.target.value)}
                    placeholder="Tu posición"
                  />
                </div>
              </div>

              <div className="denuncia-row">
                <div className="denuncia-field">
                  <label className="denuncia-label">Área del Incidente</label>
                  <input
                    className="denuncia-input"
                    value={areaIncidente}
                    onChange={(event) => setAreaIncidente(event.target.value)}
                    placeholder="¿Dónde ocurrió?"
                  />
                </div>
                <div className="denuncia-field">
                  <label className="denuncia-label">Persona o área responsable</label>
                  <input
                    className="denuncia-input"
                    value={responsable}
                    onChange={(event) => setResponsable(event.target.value)}
                    placeholder="Responsable"
                  />
                </div>
              </div>

              <div className="denuncia-field">
                <label className="denuncia-label">Descripción de los hechos</label>
                <textarea
                  className="denuncia-textarea"
                  value={descripcion}
                  onChange={(event) => setDescripcion(event.target.value)}
                  placeholder="Describe lo sucedido con el mayor detalle posible..."
                />
              </div>

              <div className="denuncia-field">
                <label className="denuncia-label">Archivos adjuntos (opcional)</label>
                <input
                  className="denuncia-input"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.mp3,.wav,.ogg,.m4a"
                  multiple
                  onChange={handleAttachmentChange}
                  disabled={loading}
                />
                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  Formatos permitidos: Imágenes, PDF, Word, Excel, PowerPoint, Texto, Comprimidos. Máx. 50MB por archivo.
                </small>
                {attachments.length > 0 && (
                  <div className="denuncia-attachment-list">
                    {attachments.map((file) => (
                      <span key={file.name} className="denuncia-attachment-item">
                        {file.name} ({(file.size / 1024).toFixed(2)}kb)
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button className="denuncia-submit-btn" type="submit" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="loading-spinner" style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                    {attachments.length > 0 ? 'Optimizando y subiendo archivos...' : 'Enviando tu reporte de forma segura...'}
                  </span>
                ) : 'Enviar reporte'}
              </button>

              {loading && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#e8f5e8',
                  border: '1px solid #4caf50',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#2e7d32'
                }}>
                  <strong>Tu reporte está siendo procesado de forma segura.</strong><br/>
                  {attachments.length > 0
                    ? 'Estamos optimizando tus archivos para subirlos más rápido. Esto puede tomar unos segundos.'
                    : 'Estamos enviando tu denuncia de manera confidencial. Tu información está protegida.'
                  }
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
}
