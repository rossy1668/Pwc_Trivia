import { useEffect, useState } from "react";
import { getTriviaStatistics } from "../firebase";
import "../assets/css/trivia.css";

export default function AnalyticsDashboard({ user }) {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const results = await getTriviaStatistics();
      setStatistics(calculateStats(results));
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
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

  if (!statistics) {
    return (
      <div className="trivia-container">
        <div className="trivia-header">
          <h1>Dashboard Analítico RH</h1>
          <p>Error al cargar las estadísticas.</p>
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
}