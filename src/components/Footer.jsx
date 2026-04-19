import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: '#ffffff',
      color: '#333333',
      width: '100%',
      borderTop: '1px solid #e0e0e0'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px 24px 24px'
    },
    columns: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '32px',
      marginBottom: '32px'
    },
    col: {
      flex: 1,
      minWidth: '160px'
    },
    colTitle: {
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '18px',
      letterSpacing: '0.5px',
      color: '#2D2D2D'
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    listItem: {
      marginBottom: '10px'
    },
    link: {
      color: '#666666',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s ease',
      cursor: 'pointer'
    },
    linkHover: {
      color: '#E0301E',
      textDecoration: 'underline'
    },
    divider: {
      borderTop: '1px solid #e0e0e0',
      margin: '20px 0 24px 0'
    },
    bottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      fontSize: '13px',
      color: '#666666',
      paddingTop: '5px'
    },
    copyright: {
      fontSize: '12px'
    },
    tagline: {
      fontSize: '13px',
      fontStyle: 'italic',
      letterSpacing: '0.3px'
    },
    taglineStrong: {
      color: '#E0301E',
      fontWeight: 'normal'
    }
  };

  const handleMouseEnter = (e) => {
    e.target.style.color = styles.linkHover.color;
    e.target.style.textDecoration = styles.linkHover.textDecoration;
  };

  const handleMouseLeave = (e) => {
    e.target.style.color = styles.link.color;
    e.target.style.textDecoration = styles.link.textDecoration;
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.columns}>
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Navegación</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <Link to="/" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Inicio</Link>
              </li>
              <li style={styles.listItem}>
                <Link to="/trivia" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Trivia</Link>
              </li>
              <li style={styles.listItem}>
                <Link to="/guia" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Guía de acción</Link>
              </li>
              <li style={styles.listItem}>
                <Link to="/leyes" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Leyes</Link>
              </li>
              <li style={styles.listItem}>
                <Link to="/denuncia" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Denuncia</Link>
              </li>
            </ul>
          </div>

          <div style={styles.col}>
            <h4 style={styles.colTitle}>Sobre el proyecto</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <Link to="/acercade" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Acerca de este micrositio</Link>
              </li>
              <li style={styles.listItem}>
                <Link to="/hostigamiento" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>¿Qué es el hostigamiento?</Link>
              </li>
              <li style={styles.listItem}>
                <a href="/politica-confidencialidad" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Política de confidencialidad</a>
              </li>
            </ul>
          </div>

          <div style={styles.col}>
            <h4 style={styles.colTitle}>Recursos legales</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <a href="/ley-27942" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Ley N° 27942</a>
              </li>
              <li style={styles.listItem}>
                <a href="/reglamento" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Reglamento vigente</a>
              </li>
              <li style={styles.listItem}>
                <a href="/derechos-colaborador" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Derechos del colaborador</a>
              </li>
            </ul>
          </div>

          <div style={styles.col}>
            <h4 style={styles.colTitle}>Contacto PwC</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <a href="/canal-denuncias" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Canal de denuncias oficial</a>
              </li>
              <li style={styles.listItem}>
                <a href="/rrhh" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Área de Recursos Humanos</a>
              </li>
              <li style={styles.listItem}>
                <a href="/etica" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Ética y Cumplimiento</a>
              </li>
            </ul>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.bottom}>
          <div style={styles.copyright}>
            © 2025 Micrositio desarrollado para PwC Perú — Hackathon +ChicasTec
          </div>
          <div style={styles.tagline}>
            "El silencio no protege, <strong style={styles.taglineStrong}>el conocimiento sí</strong>."
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
