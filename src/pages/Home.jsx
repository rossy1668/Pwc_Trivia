import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home({ userName }) {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-banner">
          <div className="home-hero-overlay">
            {userName ? (
              <p className="home-user-greeting">Hola, {userName}</p>
            ) : (
              <p className="home-hero-eyebrow">Respeto sin excepciones</p>
            )}
            <h1 className="home-hero-title">Infórmate, actúa y promueve un entorno seguro.</h1>
            <p className="home-hero-copy">Explora casos reales, guía de acción y leyes para proteger tus derechos en el trabajo.</p>
          </div>
        </div>
      </section>

      <main className="home-grid">
        <article className="home-card">
          <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80" alt="Trivia" />
          <div className="home-card-content">
            <h3 className="home-card-title">Pon a prueba tu conocimiento</h3>
            <p className="home-card-text">Analiza casos reales e identifica si son hostigamiento.</p>
            <Link to="/trivia" className="home-card-button">Jugar</Link>
          </div>
        </article>

        <article className="home-card">
          <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80" alt="Guía de acción" />
          <div className="home-card-content">
            <h3 className="home-card-title">¿Qué hago si me pasa?</h3>
            <p className="home-card-text">Guía paso a paso según tu situación.</p>
            <Link to="/guia" className="home-card-button">Acceder</Link>
          </div>
        </article>

        <article className="home-card">
          <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80" alt="Leyes" />
          <div className="home-card-content">
            <h3 className="home-card-title">Lo que dice la ley</h3>
            <p className="home-card-text">Conoce la Ley Nº 27942 y tus derechos.</p>
            <Link to="/leyes" className="home-card-button">Leer más</Link>
          </div>
        </article>
      </main>
    </div>
  );
}
