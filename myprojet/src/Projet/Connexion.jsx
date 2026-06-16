import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "./Context/UserContext.jsx";
import { containsXss } from "./utils/sanitize.js";

function Connexion() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    error: "",
    success: "",
  });

  const [erreurEmail, setErreurEmail] = useState("");
  const [erreurPassword, setErreurPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [btnHovered, setBtnHovered] = useState(false);

  const emailInputRef = useRef(null);

  useEffect(() => {
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  const EmailChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value, error: "", success: "" }));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!value.trim()) setErreurEmail("L'email est requis.");
    else if (!emailRegex.test(value)) setErreurEmail("Adresse e-mail invalide.");
    else setErreurEmail("");
  };

  const PasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value, error: "", success: "" }));
    if (!value.trim()) setErreurPassword("Le mot de passe est requis.");
    else setErreurPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setFormData((prev) => ({ ...prev, error: "Veuillez remplir tous les champs.", success: "" }));
      return;
    }

    // Protection XSS : blocage des tentatives d'injection avant envoi
    if (containsXss(email) || containsXss(password)) {
      setFormData((prev) => ({ ...prev, error: "Caractères non autorisés détectés.", success: "" }));
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // envoie/reçoit le cookie refreshToken HttpOnly
      });

      const data = await res.json();

      if (!res.ok) {
        setFormData((prev) => ({ ...prev, error: data.message || "Erreur", success: "" }));
      } else {
        setFormData({ email: "", password: "", error: "", success: "✅ Connexion réussie !" });
        setErreurEmail("");
        setErreurPassword("");
        login(data.user, data.accessToken);
        const isAdmin  = data.user?.role === "admin";
        const redirect = isAdmin
          ? "/admin"
          : sessionStorage.getItem("pendingRedirect") || "/mon-espace";
        sessionStorage.removeItem("pendingRedirect");
        setTimeout(() => navigate(redirect), 1000);
      }
    } catch {
      setFormData((prev) => ({ ...prev, error: "Erreur serveur. Réessayez.", success: "" }));
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f7",
      padding: "40px 20px",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      WebkitFontSmoothing: "antialiased",
    },
    formContainer: {
      background: "#ffffff",
      borderRadius: "20px",
      padding: "44px 40px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    title: {
      marginBottom: "28px",
      marginTop: 0,
      fontSize: "24px",
      fontWeight: "700",
      color: "#1d1d1f",
      letterSpacing: "-0.02em",
    },
    input: (name) => ({
      width: "100%",
      padding: "13px 14px",
      borderRadius: "10px",
      border: `1.5px solid ${focused === name ? "#0071e3" : "#e0e0e5"}`,
      fontSize: "15px",
      outline: "none",
      backgroundColor: focused === name ? "#fff" : "#f5f5f7",
      transition: "border-color 0.2s ease, background-color 0.2s ease",
      boxSizing: "border-box",
      color: "#1d1d1f",
      letterSpacing: "-0.01em",
    }),
    passwordWrap: {
      position: "relative",
      marginBottom: "4px",
    },
    eyeBtn: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "16px",
      // opacity: 0.5,  ← supprime cette ligne
      userSelect: "none",
      background: "none",
      border: "none",
      padding: 0,
      lineHeight: 1,
    },
    errorText: {
      height: "16px",
      fontSize: "12px",
      color: "#ff3b30",
      margin: "3px 0 10px 4px",
      textAlign: "left",
      letterSpacing: "-0.01em",
    },
    button: (hov) => ({
      width: "100%",
      padding: "14px",
      background: hov
        ? "linear-gradient(135deg, #29a3ff 0%, #005dbc 100%)"
        : "linear-gradient(135deg, #0af 0%, #0071e3 100%)",
      border: "none",
      borderRadius: "980px",
      color: "white",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.25s ease",
      marginTop: "16px",
      letterSpacing: "-0.01em",
      boxShadow: hov
        ? "0 6px 24px rgba(0,170,255,0.4)"
        : "0 3px 12px rgba(0,113,227,0.28)",
      transform: hov ? "translateY(-1px)" : "translateY(0)",
    }),
    loginLink: {
      textAlign: "center",
      marginTop: "20px",
      fontSize: "14px",
      color: "#6e6e73",
      letterSpacing: "-0.01em",
    },
    link: {
      color: "#0071e3",
      textDecoration: "none",
      fontWeight: "500",
    },
    message: {
      marginTop: "12px",
      fontSize: "13px",
      borderRadius: "8px",
      padding: "10px 14px",
      letterSpacing: "-0.01em",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} noValidate>
          <h2 style={styles.title}>Connexion</h2>

          {/* Email */}
          <div style={{ marginBottom: "4px" }}>
            <input
              ref={emailInputRef}
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={EmailChange}
              style={styles.input("email")}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              autoComplete="email"
            />
            <p style={styles.errorText}>{erreurEmail}</p>
          </div>

          {/* Mot de passe */}
          <div style={styles.passwordWrap}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={formData.password}
              onChange={PasswordChange}
              style={{ ...styles.input("password"), paddingRight: "40px" }}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              autoComplete="current-password"
            />
            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <p style={styles.errorText}>{erreurPassword}</p>

          {/* Bouton */}
          <button
            type="submit"
            style={styles.button(btnHovered)}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            Se connecter
          </button>

          {/* Messages globaux */}
          {formData.success && (
            <p style={{ ...styles.message, backgroundColor: "#f0fdf4", color: "#166534" }}>
              {formData.success}
            </p>
          )}
          {formData.error && (
            <p style={{ ...styles.message, backgroundColor: "#fff1f0", color: "#c0392b" }}>
              {formData.error}
            </p>
          )}

          <p style={styles.loginLink}>
            Pas encore de compte ?{" "}
            <Link to="/inscription" style={styles.link}>
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Connexion;
