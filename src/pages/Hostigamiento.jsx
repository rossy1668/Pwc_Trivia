import React from 'react';

const Hostigamiento = () => {
  return (
    <div className="hostigamiento-page">
      {/* Hero Section */}
      <section className="leyes-hero">
        <img
          src="/assets/img/hostigamiento.jpg"
          alt="Personas en una reunión profesional revisando documentos legales"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block'
          }}
        />
        <h1 className="hero-title">¿Qué es el hostigamiento sexual?</h1>
      </section>

      {/* Contenido Principal */}
      <section className="leyes-content">
        <div className="content-section">
          <p>
            El hostigamiento sexual es una forma de violencia que ocurre cuando una persona realiza conductas de naturaleza sexual no deseadas hacia otra, afectando su dignidad, integridad y bienestar en el entorno laboral.
          </p>
          <p>
            Estas conductas pueden provenir de un superior, compañero de trabajo o cualquier persona dentro del entorno laboral, y no dependen del consentimiento de la persona afectada.
          </p>
          <br />
          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '10px' }}>
            <h3>Ejemplos de hostigamiento sexual</h3>
            <br />
            <ul style={{ paddingLeft: '3%' }}>
              <li>Comentarios o insinuaciones de carácter sexual</li>
              <li>Miradas o gestos incómodos</li>
              <li>Mensajes, llamadas o contenido inapropiado</li>
              <li>Contacto físico no consentido</li>
              <li>Promesas de beneficios laborales a cambio de favores sexuales</li>
            </ul>
          </div>

          <br />
          <p>
            El hostigamiento sexual no requiere que exista contacto físico. Cualquier conducta no deseada de naturaleza sexual que genere incomodidad o afecte a la persona puede ser considerada como tal.
          </p>
          <p>
            Reconocer estas situaciones es fundamental para poder actuar, buscar apoyo y ejercer el derecho a un entorno laboral seguro y respetuoso.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Hostigamiento;