import { useState } from "react";
import { submitDenuncia } from "../firebase";

export default function DenunciaFinal() {
  const [modalidad, setModalidad] = useState("Anónimo (Protección contra represalias)");
  const [lineaServicio, setLineaServicio] = useState("");
  const [cargo, setCargo] = useState("");
  const [areaIncidente, setAreaIncidente] = useState("");
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
        descripcion
      });

      setMessage("Denuncia enviada correctamente. Recibirás confirmación por correo cuando sea procesada.");
      setModalidad("Anónimo (Protección contra represalias)");
      setLineaServicio("");
      setCargo("");
      setAreaIncidente("");
      setDescripcion("");
    } catch (error) {
      setError(error.message || "Error al enviar la denuncia. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#fcfcfc",
      minHeight: "100vh",
      padding: "60px 5%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
      maxWidth: "600px"
    },
    title: {
      fontSize: "32px",
      fontFamily: "Georgia, serif",
      fontWeight: "bold",
      color: "#2d2d2d",
      marginBottom: "10px"
    },
    formCard: {
      backgroundColor: "white",
      width: "100%",
      maxWidth: "600px",
      padding: "45px",
      borderRadius: "12px",
      boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
      borderTop: "6px solid #D04A02"
    },
    infoBox: {
      backgroundColor: "#FFF9E6",
      padding: "15px 20px",
      borderRadius: "8px",
      fontSize: "13.5px",
      color: "#856404",
      border: "1px solid #ffeeba",
      marginBottom: "30px"
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px"
    },
    field: {
      marginBottom: "20px",
      display: "flex",
      flexDirection: "column"
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "8px",
      color: "#333"
    },
    input: {
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "15px",
      outline: "none"
    },
    textarea: {
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "15px",
      height: "100px",
      resize: "none"
    },
    submitBtn: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#D04A02",
      color: "white",
      border: "none",
      borderRadius: "30px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px"
    },
    alert: {
      marginBottom: "18px",
      padding: "14px 18px",
      borderRadius: "10px",
      fontSize: "14px"
    },
    success: {
      backgroundColor: "#E6FFED",
      color: "#1F5138",
      border: "1px solid #B7F2C4"
    },
    error: {
      backgroundColor: "#FFD6D6",
      color: "#7A1D1D",
      border: "1px solid #FFB2B2"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Nueva Denuncia</h1>
        <p style={{ color: "#666", fontSize: "15px" }}>
          Su reporte será procesado con total confidencialidad.
        </p>
      </div>

      <div style={styles.formCard}>
        <div style={styles.infoBox}>
          <strong>Aviso de sistema:</strong> Al enviar este formulario, recibirá por correo un <strong>usuario automático</strong> para dar seguimiento al caso.
        </div>

        {message && <div style={{ ...styles.alert, ...styles.success }}>{message}</div>}
        {error && <div style={{ ...styles.alert, ...styles.error }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Modalidad</label>
            <select style={styles.input} value={modalidad} onChange={(event) => setModalidad(event.target.value)}>
              <option>Anónimo (Protección contra represalias)</option>
              <option>Identificado</option>
            </select>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Línea de Servicio</label>
              <input style={styles.input} value={lineaServicio} onChange={(event) => setLineaServicio(event.target.value)} placeholder="Ej: Auditoría" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Cargo</label>
              <input style={styles.input} value={cargo} onChange={(event) => setCargo(event.target.value)} placeholder="Tu posición" />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Área del Incidente</label>
            <input style={styles.input} value={areaIncidente} onChange={(event) => setAreaIncidente(event.target.value)} placeholder="¿Dónde ocurrió?" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Descripción de los hechos</label>
            <textarea
              style={styles.textarea}
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              placeholder="Describe lo sucedido con el mayor detalle posible..."
            />
          </div>

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Reporte y Crear Usuario'}
          </button>
        </form>
      </div>
    </div>
  );
}
