import { useEffect, useState } from "react";
import { collection, doc } from "firebase/firestore";
import { db, submitDenuncia, uploadDenunciaFiles, fetchDenunciasByEmail } from "../firebase";
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

  const approvedHrEmails = [
    "rrhh@pwc.com",
    "rh@pwc.com",
    "rh@empresa.com"
  ];

  const isHrUser = user?.email ? approvedHrEmails.includes(user.email.toLowerCase()) : false;

  const loadDenuncias = async () => {
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
  };

  useEffect(() => {
    loadDenuncias();
  }, [user, isHrUser]);

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

    setLoading(true);

    try {
      const reference = doc(collection(db, "denuncias"));
      const caso = reference.id.slice(0, 8).toUpperCase();
      let uploadedFiles = [];

      if (attachments.length) {
        uploadedFiles = await uploadDenunciaFiles(reference.id, attachments);
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
          caseNumber: caso
        },
        reference.id
      );

      setMessage(`Denuncia enviada correctamente. Tu número de caso es ${caso}. Revisa tu panel de seguimiento más abajo.`);
      setModalidad("Anónimo (Protección contra represalias)");
      setLineaServicio("");
      setCargo("");
      setAreaIncidente("");
      setResponsable("");
      setDescripcion("");
      setAttachments([]);
      await loadDenuncias();
    } catch (error) {
      setError(error.message || "Error al enviar la denuncia. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="denuncia-page">
      <div className="denuncia-header">
        <h1 className="denuncia-title">Nueva Denuncia</h1>
        <p className="denuncia-subtitle">Su reporte será procesado con total confidencialidad.</p>
      </div>

      <div className="denuncia-form-card">
        <div className="denuncia-info-box">
          <strong>Aviso de sistema:</strong> Al enviar este formulario, recibirás un número de caso y la denuncia quedará registrada para seguimiento.
          <br />
          Si prefieres, también puedes enviar un correo a <a href="mailto:denuncias@pwc.com?subject=Denuncia%20PwC">denuncias@pwc.com</a> con los detalles.
        </div>

        {message && <div className="denuncia-alert denuncia-success">{message}</div>}
        {error && <div className="denuncia-alert denuncia-error">{error}</div>}

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
            <label className="denuncia-label">Archivos adjuntos</label>
            <input
              className="denuncia-input"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              multiple
              onChange={handleAttachmentChange}
            />
            {attachments.length > 0 && (
              <div className="denuncia-attachment-list">
                {attachments.map((file) => (
                  <span key={file.name} className="denuncia-attachment-item">{file.name}</span>
                ))}
              </div>
            )}
          </div>

          <button className="denuncia-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar reporte'}
          </button>
        </form>
      </div>

      <div className="denuncia-panel-card">
        <div className="denuncia-panel-header">
          <h2>Panel de denuncias</h2>
          <p>Consulta los reportes que has creado desde tu cuenta.</p>
        </div>

        {!user ? (
          <div className="denuncia-alert denuncia-info">Inicia sesión para acceder y enviar una denuncia.</div>
        ) : !isHrUser ? (
          <div className="denuncia-alert denuncia-info">Solo el equipo de RH puede visualizar el panel de denuncias. Envía tu reporte arriba y RH podrá revisarlo.</div>
        ) : denuncias.length === 0 ? (
          <div className="denuncia-alert denuncia-info">No hay denuncias registradas todavía.</div>
        ) : (
          <div className="denuncia-panel-list">
            {denuncias.map((denunciaItem) => (
              <article key={denunciaItem.id} className="denuncia-panel-item">
                <div className="denuncia-panel-meta">
                  <span className="denuncia-panel-case">Caso #{denunciaItem.caseNumber || denunciaItem.id.slice(0, 8).toUpperCase()}</span>
                  <span className="denuncia-panel-date">{formatTimestamp(denunciaItem.fecha)}</span>
                </div>
                <p className="denuncia-panel-field"><strong>Modalidad:</strong> {denunciaItem.modalidad}</p>
                <p className="denuncia-panel-field"><strong>Área incidente:</strong> {denunciaItem.areaIncidente || 'No indicado'}</p>
                <p className="denuncia-panel-field"><strong>Responsable:</strong> {denunciaItem.responsable || 'No indicado'}</p>
                <p className="denuncia-panel-field"><strong>Descripción:</strong> {denunciaItem.descripcion}</p>
                {denunciaItem.attachments?.length > 0 && (
                  <div className="denuncia-panel-attachments">
                    <strong>Adjuntos:</strong>
                    <ul>
                      {denunciaItem.attachments.map((file) => (
                        <li key={file.url}>
                          <a href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
