import { useState } from "react";
import { submitDenuncia } from "../firebase";
import "./Denuncia.css";

export default function DenunciaFinal() {
  const [modalidad, setModalidad] = useState("Anónimo (Protección contra represalias)");
  const [lineaServicio, setLineaServicio] = useState("");
  const [cargo, setCargo] = useState("");
  const [areaIncidente, setAreaIncidente] = useState("");
  const [responsable, setResponsable] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      await submitDenuncia({
        modalidad,
        lineaServicio,
        cargo,
        areaIncidente,
        responsable,
        descripcion
      });

      setMessage("Denuncia enviada correctamente. Recibirás confirmación por correo cuando sea procesada.");
      setModalidad("Anónimo (Protección contra represalias)");
      setLineaServicio("");
      setCargo("");
      setAreaIncidente("");
      setResponsable("");
      setDescripcion("");
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
          <strong>Aviso de sistema:</strong> Al enviar este formulario, recibirá por correo un <strong>usuario automático</strong> para dar seguimiento al caso.
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

          <button className="denuncia-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Reporte y Crear Usuario'}
          </button>
        </form>
      </div>
    </div>
  );
}
