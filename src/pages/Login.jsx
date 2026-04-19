import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../firebase';
import videoFondo from '../assets/Diseño sin título (1).mp4';

const basePath = import.meta.env.BASE_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [registerMode, setRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleRegisterMode = () => {
    setRegisterMode((prev) => !prev);
    setError('');
    setMessage('');
    setConfirmPassword('');
    setName('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Ingresa correo y contraseña para continuar.');
      return;
    }

    if (registerMode) {
      if (!name.trim()) {
        setError('Ingresa un nombre para el nuevo usuario.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    setLoading(true);
    try {
      if (registerMode) {
        await signUpWithEmail(email, password, name.trim());
        setMessage('Cuenta creada correctamente. Redirigiendo...');
      } else {
        await signInWithEmail(email, password);
        setMessage('Inicio de sesión correcto. Redirigiendo...');
      }

      setTimeout(() => {
        navigate('/home');
      }, 600);
    } catch (error) {
      setError(error.message || (registerMode ? 'Error al registrar la cuenta.' : 'Error al iniciar sesión.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithGoogle();
      setMessage('Inicio de sesión con Google correcto. Redirigiendo...');
      setTimeout(() => {
        navigate('/home');
      }, 600);
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* 🔥 VIDEO EN VEZ DE IMAGEN */}
      <div className="login-left">
        <video autoPlay loop muted playsInline className="login-video">
          <source src={videoFondo} type="video/mp4" />
          Tu navegador no soporta videos.
        </video>
      </div>

      <div className="login-right">
        <div className="login-header">
          <img src={`${basePath}assets/img/logo-pwc.png`} alt="PwC Perú" />
          <div className="slogan">"El silencio no protege, el conocimiento sí"</div>
        </div>

        <h1>{registerMode ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
        <p className="subtitle">Accede al portal de empleados y continúa con tus recursos de prevención.</p>

        {error && <div className="login-alert error">{error}</div>}
        {message && <div className="login-alert success">{message}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {registerMode && (
            <div className="field">
              <label htmlFor="name">Nombre de usuario</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nombre completo"
                autoComplete="name"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ejemplo@empresa.com"
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresa tu contraseña"
              autoComplete={registerMode ? 'new-password' : 'current-password'}
            />
          </div>

          {registerMode && (
            <div className="field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
            </div>
          )}

          <div className="field-row">
            <label>
              <input type="checkbox" /> Recordarme
            </label>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button id="btn-signin" type="submit" disabled={loading}>
            {loading ? (registerMode ? 'Registrando...' : 'Conectando...') : (registerMode ? 'Crear cuenta' : 'Ingresar')}
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <button id="btn-google" type="button" onClick={handleGoogle} disabled={loading}>
          <svg viewBox="0 0 533.5 544.3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M533.5 278.4c0-17.8-1.6-35.1-4.7-51.8H272v98.2h147.1c-6.4 34.4-25.8 63.5-55.1 83v68h89c52-48 82-118.5 82-197.4Z" fill="#4285F4"/>
            <path d="M272 544.3c74.4 0 136.8-24.5 182.4-66.5l-89-68c-24.7 16.6-56.5 26.4-93.4 26.4-71.8 0-132.7-48.4-154.4-113.5h-91.4v71.3c45.8 89.5 138.8 150.3 246.8 150.3Z" fill="#34A853"/>
            <path d="M117.6 325.2c-10.7-31.5-10.7-65.5 0-97l-91.4-71.3C7.5 209.8 0 243.8 0 278.4c0 34.6 7.5 69 26.2 98.5l91.4-71.7Z" fill="#FBBC05"/>
            <path d="M272 107.7c39.5 0 75.1 13.6 103.1 40.2l77.1-77c-46.1-42.9-105.4-69.3-180.2-69.3-107.6 0-200.5 60.8-245.8 150.3l91.4 71.3C139.3 156.1 200.2 107.7 272 107.7Z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        <p className="signup-row">
          {registerMode ? (
            <>¿Ya tienes cuenta? <button type="button" className="signup-link" onClick={toggleRegisterMode}>Ingresar</button></>
          ) : (
            <>¿Aún no tienes cuenta? <button type="button" className="signup-link" onClick={toggleRegisterMode}>Regístrate</button></>
          )}
        </p>
      </div>
    </div>
  );
}