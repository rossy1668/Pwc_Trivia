import React from 'react';

const Hostigamiento = () => {
  return (
    <div className="hostigamiento-page">
      {/* Hero Section */}
      <section id="leyes-hero" className="position-relative">
        <img
          src="/assets/img/hostigamiento.jpg"
          alt="Personas en una reunión profesional revisando documentos legales"
          className="w-100"
          style={{
            height: '420px',
            objectFit: 'cover',
            objectPosition: 'center top'
          }}
        />
        <div className="hero-overlay d-flex align-items-end justify-content-end p-4">
          <h1 className="hero-title text-white mb-0 fw-bold fst-italic"
              style={{
                fontSize: '2.4rem',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
              }}>
            ¿Qué es el hostigamiento sexual?
          </h1>
        </div>
      </section>

      {/* Contenido Principal */}
      <section id="leyes-content" className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="content-section">
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <p className="lead text-justify mb-4">
                      El hostigamiento sexual es una forma de violencia que ocurre cuando una persona realiza conductas de naturaleza sexual no deseadas hacia otra, afectando su dignidad, integridad y bienestar en el entorno laboral.
                    </p>

                    <p className="mb-4">
                      Estas conductas pueden provenir de un superior, compañero de trabajo o cualquier persona dentro del entorno laboral, y no dependen del consentimiento de la persona afectada.
                    </p>

                    <div className="alert alert-warning border-0 shadow-sm mb-4">
                      <h5 className="alert-heading fw-bold mb-3">
                        <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
                        Ejemplos de hostigamiento sexual
                      </h5>
                      <ul className="mb-0 ms-3">
                        <li><i className="bi bi-dash me-2"></i>Comentarios o insinuaciones de carácter sexual</li>
                        <li><i className="bi bi-dash me-2"></i>Miradas o gestos incómodos</li>
                        <li><i className="bi bi-dash me-2"></i>Mensajes, llamadas o contenido inapropiado</li>
                        <li><i className="bi bi-dash me-2"></i>Contacto físico no consentido</li>
                        <li><i className="bi bi-dash me-2"></i>Promesas de beneficios laborales a cambio de favores sexuales</li>
                      </ul>
                    </div>

                    <p className="mb-3">
                      El hostigamiento sexual no requiere que exista contacto físico. Cualquier conducta no deseada de naturaleza sexual que genere incomodidad o afecte a la persona puede ser considerada como tal.
                    </p>

                    <p className="mb-0 fw-semibold text-success">
                      <i className="bi bi-lightbulb-fill me-2 text-success"></i>
                      Reconocer estas situaciones es fundamental para poder actuar, buscar apoyo y ejercer el derecho a un entorno laboral seguro y respetuoso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hostigamiento;