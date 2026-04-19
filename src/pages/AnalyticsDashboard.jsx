import { useCallback, useEffect, useState } from "react";
import { getTriviaStatistics, db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import "../assets/css/trivia.css";

export default function AnalyticsDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStatistics = useCallback(async () => {
    try {
      setError(null);
      const results = await getTriviaStatistics();
      setStatistics(calculateStats(results));
    } catch (error) {
      console.error('Error loading statistics:', error);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDenuncias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'denuncias'));
      const denunciasData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.timestamp?.seconds || b.fecha?.seconds || 0) - (a.timestamp?.seconds || a.fecha?.seconds || 0));
      setDenuncias(denunciasData);
    } catch (error) {
      console.error('Error fetching denuncias:', error);
      setError('Error al cargar las denuncias');
    }
  };

  const calculateStats = (results) => {
    if (!results || results.length === 0) {
      return {
        totalParticipants: 0,
        averageScore: 0,
        averagePercentage: 0,
        scoreDistribution: {},
        passRate: 0,
        failRate: 0,
        excellentRate: 0,
        needsImprovementRate: 0
      };
    }

    const totalParticipants = results.length;
    const totalScore = results.reduce((sum, result) => sum + result.puntaje, 0);
    const averageScore = totalScore / totalParticipants;
    const averagePercentage = results.reduce((sum, result) => sum + result.porcentaje, 0) / totalParticipants;

    // Distribución de puntajes
    const scoreDistribution = {};
    results.forEach(result => {
      const score = result.puntaje;
      scoreDistribution[score] = (scoreDistribution[score] || 0) + 1;
    });

    // Tasas de aprobación
    const passRate = (results.filter(r => r.puntaje >= 5).length / totalParticipants) * 100;
    const failRate = (results.filter(r => r.puntaje < 5).length / totalParticipants) * 100;
    const excellentRate = (results.filter(r => r.puntaje >= 8).length / totalParticipants) * 100;
    const needsImprovementRate = (results.filter(r => r.puntaje <= 4).length / totalParticipants) * 100;

    return {
      totalParticipants,
      averageScore: averageScore.toFixed(1),
      averagePercentage: averagePercentage.toFixed(1),
      scoreDistribution,
      passRate: passRate.toFixed(1),
      failRate: failRate.toFixed(1),
      excellentRate: excellentRate.toFixed(1),
      needsImprovementRate: needsImprovementRate.toFixed(1)
    };
  };

  useEffect(() => {
    loadStatistics();
    fetchDenuncias();
  }, [loadStatistics]);

  if (loading) {
    return (
      <div className="trivia-container">
        <div className="trivia-header">
          <h1>Dashboard Analítico RH</h1>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trivia-container">
        <div className="trivia-header">
          <h1>Dashboard Analítico RH</h1>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => { setLoading(true); setError(null); loadStatistics(); fetchDenuncias(); }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="trivia-container">
        <div className="trivia-header">
          <h1>Dashboard Analítico RH</h1>
          <p>No hay datos disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trivia-container">
      <div className="trivia-header">
        <h1>📊 Dashboard Analítico RH</h1>
        <p>Análisis de resultados de la trivia sobre hostigamiento sexual laboral</p>
      </div>

      <div className="analytics-grid">
        {/* Estadísticas principales */}
        <div className="analytics-card">
          <h3>📈 Participación General</h3>
          <div className="stat-large">{statistics.totalParticipants}</div>
          <p>Usuarios que completaron la trivia</p>
        </div>

        <div className="analytics-card">
          <h3>🎯 Puntaje Promedio</h3>
          <div className="stat-large">{statistics.averageScore}/10</div>
          <p>Respuestas correctas promedio</p>
        </div>

        <div className="analytics-card">
          <h3>📊 Porcentaje Promedio</h3>
          <div className="stat-large">{statistics.averagePercentage}%</div>
          <p>Precisión promedio</p>
        </div>

        {/* Tasas de aprobación */}
        <div className="analytics-card">
          <h3>✅ Tasa de Aprobación</h3>
          <div className="stat-large success">{statistics.passRate}%</div>
          <p>Puntaje ≥ 5 (50%)</p>
        </div>

          <div className="analytics-card">
          <h3>❌ Tasa de Desaprobación</h3>
          <div className="stat-large error">{statistics.failRate}%</div>
          <p>Puntaje &lt; 5 (50%)</p>
        </div>

        <div className="analytics-card">
          <h3>🏆 Excelente</h3>
          <div className="stat-large excellent">{statistics.excellentRate}%</div>
          <p>Puntaje ≥ 8 (80%)</p>
        </div>

        <div className="analytics-card">
          <h3>📚 Necesita Mejora</h3>
          <div className="stat-large warning">{statistics.needsImprovementRate}%</div>
          <p>Puntaje ≤ 4 (40%)</p>
        </div>

        {/* Distribución de puntajes */}
        <div className="analytics-card full-width">
          <h3>📊 Distribución de Puntajes</h3>
          <div className="score-distribution">
            {Object.entries(statistics.scoreDistribution)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([score, count]) => (
                <div key={score} className="score-bar">
                  <div className="score-label">{score}/10</div>
                  <div className="score-bar-fill" style={{
                    width: `${(count / statistics.totalParticipants) * 100}%`
                  }}>
                    <span className="score-count">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Insights */}
        <div className="analytics-card full-width">
          <h3>💡 Insights y Recomendaciones</h3>
          <div className="insights">
            {statistics.averageScore < 6 && (
              <div className="insight warning">
                <strong>⚠️ Área de Atención:</strong> El puntaje promedio es bajo ({statistics.averageScore}/10).
                Se recomienda reforzar la capacitación en conceptos básicos de hostigamiento sexual.
              </div>
            )}

            {statistics.failRate > 30 && (
              <div className="insight error">
                <strong>🚨 Alerta:</strong> {statistics.failRate}% de los participantes no aprueban la trivia.
                Es necesario revisar los materiales educativos y la comprensión de las políticas.
              </div>
            )}

            {statistics.excellentRate > 20 && (
              <div className="insight success">
                <strong>✅ Punto Positivo:</strong> {statistics.excellentRate}% de los participantes muestran
                un excelente conocimiento del tema. Estos usuarios pueden ser referentes.
              </div>
            )}

            <div className="insight info">
              <strong>📈 Tendencia:</strong> {statistics.totalParticipants} empleados han participado.
              Continúa promoviendo la educación preventiva en hostigamiento sexual laboral.
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Denuncias */}
      <div className="denuncias-section">
        <h2>Lista de Denuncias</h2>
        <div className="denuncias-list">
          {denuncias.length > 0 ? (
            denuncias.map((denuncia) => (
              <div key={denuncia.id} className="denuncia-item">
                <div className="denuncia-header">
                  <h3>Denuncia #{denuncia.id.slice(-6)}</h3>
                  <span className="denuncia-tipo">{denuncia.tipo || 'Tipo no especificado'}</span>
                </div>
                <div className="denuncia-content">
                  <p><strong>Descripción:</strong> {denuncia.descripcion || 'Sin descripción'}</p>
                  {denuncia.anonima !== undefined && (
                    <p><strong>Anónima:</strong> {denuncia.anonima ? 'Sí' : 'No'}</p>
                  )}
                  {denuncia.nombre && <p><strong>Nombre:</strong> {denuncia.nombre}</p>}
                  {denuncia.email && <p><strong>Email:</strong> {denuncia.email}</p>}
                  {denuncia.telefono && <p><strong>Teléfono:</strong> {denuncia.telefono}</p>}
                  <p><strong>Fecha:</strong> {denuncia.timestamp?.toDate?.()?.toLocaleString() || 'Fecha no disponible'}</p>
                  {denuncia.archivos && denuncia.archivos.length > 0 && (
                    <div className="archivos">
                      <strong>Archivos adjuntos:</strong>
                      <ul>
                        {denuncia.archivos.map((archivo, index) => (
                          <li key={index}>
                            <a href={archivo.url} target="_blank" rel="noopener noreferrer">
                              {archivo.nombre || `Archivo ${index + 1}`}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No hay denuncias registradas.</p>
          )}
        </div>
      </div>

      <div className="trivia-actions">
        <button
          className="trivia-button secondary"
          onClick={loadStatistics}
        >
          🔄 Actualizar Estadísticas
        </button>
      </div>
    </div>
  );
};