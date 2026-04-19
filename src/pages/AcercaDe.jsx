import React from 'react';

const AcercaDe = () => {
  return (
    <div className="acerca-de-page">
      {/* Hero Section */}
      <section id="leyes-hero" className="position-relative">
        <img
          src="/assets/img/acerca.jpg"
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
            Sobre este sitio
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
                      Este sitio ha sido diseñado como una herramienta informativa e interactiva
                      para ayudar a las personas a reconocer, comprender y actuar frente al acoso en el entorno laboral.
                    </p>

                    <p className="mb-4">
                      A través de diferentes secciones, puedes poner a prueba tus conocimientos mediante
                      una trivia, acceder a una guía práctica sobre qué hacer ante una situación de acoso,
                      informarse sobre la normativa vigente y conocer sus derechos.
                    </p>

                    <p className="mb-4">
                      Además, el sitio ofrece un espacio para realizar denuncias de manera anónima, promoviendo
                      un entorno seguro donde las personas puedan expresarse sin temor.
                    </p>

                    <p className="mb-0 fw-semibold text-primary">
                      Nuestro objetivo es fomentar la prevención, la información y la acción, contribuyendo
                      a la construcción de espacios laborales más seguros, respetuosos y libres de violencia.
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

export default AcercaDe;