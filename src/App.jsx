import { useEffect, useState } from "react";
import { HashRouter, Routes, Route, NavLink, useLocation, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Trivia from "./pages/Trivia";
import Guia from "./pages/Guia";
import Leyes from "./pages/Leyes";
import Denuncia from "./pages/Denuncia";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import { auth, signOutUser } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const basePath = import.meta.env.BASE_URL;

function Navbar({ user, onSignOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const logoutButtonStyle = {
    background: "transparent",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    padding: 0,
    fontSize: "1rem",
    fontWeight: 500,
    textDecoration: "underline"
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header id="header">
      <div className="header-inner">
        <div className="header-logo">
          <img src={`${basePath}assets/img/logo-pwc.png`} alt="PwC Perú" />
          <span className="header-slogan">"El silencio no protege, el conocimiento sí"</span>
        </div>
        <button
          className="nav-toggle"
          type="button"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={mobileMenuOpen ? "open" : ""}>
          <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>Inicio</NavLink>
          <NavLink to="/trivia" className={({ isActive }) => (isActive ? "active" : "")}>Trivia</NavLink>
          <NavLink to="/guia" className={({ isActive }) => (isActive ? "active" : "")}>Guía</NavLink>
          <NavLink to="/leyes" className={({ isActive }) => (isActive ? "active" : "")}>Leyes</NavLink>
          <NavLink to="/denuncia" className={({ isActive }) => (isActive ? "active" : "")}>Denuncia</NavLink>
          {user ? (
            <button type="button" style={logoutButtonStyle} onClick={onSignOut}>
              Cerrar sesión
            </button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Acceder</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const hideLayout = location.pathname === "/login";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/login");
  };

  if (!authReady) return null;

  return (
    <div className="app-shell" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!hideLayout && <Navbar user={user} onSignOut={handleSignOut} />}
      <main className="container" style={{ flex: 1, padding: "40px 0" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/trivia" element={<Trivia />} />
          <Route path="/guia" element={<Guia />} />
          <Route path="/leyes" element={<Leyes />} />
          <Route path="/denuncia" element={<Denuncia />} />
          <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
