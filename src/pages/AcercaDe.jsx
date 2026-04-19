import React from 'react';

const AcercaDe = () => {
  return (
    <div className="acerca-de-page">
      {/* Hero Section */}
      <section className="leyes-hero">
        <img
          src="/assets/img/acerca.jpg"
          alt="Personas en una reunión profesional revisando documentos legales"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block'
          }}
        />
        <h1 className="hero-title">Sobre este sitio</h1>
      </section>

      {/* Contenido Principal */}
      <section className="leyes-content">
        <div className="content-section">
          <p>
            Este sitio ha sido diseñado como una herramienta informativa e interactiva
            para ayudar a las personas a reconocer, comprender y actuar frente al acoso en el entorno laboral.
          </p>
          <br />
          <p>
            A través de diferentes secciones, puedes poner a prueba tus conocimientos mediante
            una trivia, acceder a una guía práctica sobre qué hacer ante una situación de acoso,
            informarse sobre la normativa vigente y conocer sus derechos.
          </p>
          <br />
          <p>
            Además, el sitio ofrece un espacio para realizar denuncias de manera anónima, promoviendo
            un entorno seguro donde las personas puedan expresarse sin temor.
          </p>
          <br />
          <p>
            Nuestro objetivo es fomentar la prevención, la información y la acción, contribuyendo
            a la construcción de espacios laborales más seguros, respetuosos y libres de violencia.
          </p>
          <br />
        </div>
      </section>
    </div>
  );
};

export default AcercaDe;