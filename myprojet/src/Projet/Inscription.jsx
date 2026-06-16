import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { containsXss } from "./utils/sanitize.js";

function Inscription() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    success: "",
  });

  const nomInputRef = useRef(null);

  useEffect(() => {
    if (nomInputRef.current) {
      nomInputRef.current.focus();
    }
  }, []);

  const [erreurNom, setErreurNom] = useState("");
  const [erreurPrenom, setErreurPrenom] = useState("");
  const [erreurEmail, setErreurEmail] = useState("");
  const [erreurPassword, setErreurPassword] = useState("");
  const [erreurConfirm, setErreurConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const styles = {
    // ── Wrapper pleine page ──
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
    inputWrap: {
      marginBottom: "4px",
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

  const [btnHovered, setBtnHovered] = useState(false);

  const NameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, nom: value, error: "", success: "" }));
    if (!value.trim()) setErreurNom("Le nom est requis.");
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value))
      setErreurNom("Le nom ne doit contenir que des lettres.");
    else setErreurNom("");
  };

  const PrenomChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, prenom: value, error: "", success: "" }));
    if (!value.trim()) setErreurPrenom("Le prénom est requis.");
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value))
      setErreurPrenom("Le prénom ne doit contenir que des lettres.");
    else setErreurPrenom("");
  };

  const EmailChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value, error: "", success: "" }));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!value.trim()) setErreurEmail("L'email est requis.");
    else if (!emailRegex.test(value)) setErreurEmail("Adresse e-mail invalide.");
    else setErreurEmail("");
  };

  const validatePassword = (value) => {
    if (!value.trim())               return "Le mot de passe est requis.";
    if (value.length < 12)           return "12 caractères minimum.";
    if (!/[A-Z]/.test(value))        return "Au moins une majuscule requise.";
    if (!/[0-9]/.test(value))        return "Au moins un chiffre requis.";
    if (!/[^A-Za-z0-9]/.test(value)) return "Au moins un caractère spécial requis.";
    return "";
  };

  const PasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value, error: "", success: "" }));
    setErreurPassword(validatePassword(value));
  };

  const ConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, confirmPassword: value, error: "", success: "" }));
    if (!value.trim()) setErreurConfirm("Veuillez confirmer le mot de passe.");
    else if (value !== formData.password)
      setErreurConfirm("Les mots de passe ne correspondent pas.");
    else setErreurConfirm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, prenom, email, password, confirmPassword } = formData;

    if (!nom || !prenom || !email || !password || !confirmPassword) {
      setFormData((prev) => ({ ...prev, error: "Veuillez remplir tous les champs.", success: "" }));
      return;
    }
    const pwErr = validatePassword(password);
    if (pwErr) {
      setErreurPassword(pwErr);
      return;
    }
    if (password !== confirmPassword) {
      setFormData((prev) => ({ ...prev, error: "Les mots de passe ne correspondent pas.", success: "" }));
      return;
    }

    // Protection XSS : blocage des tentatives d'injection avant envoi
    if ([nom, prenom, email].some(containsXss)) {
      setFormData((prev) => ({ ...prev, error: "Caractères non autorisés détectés.", success: "" }));
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, email, password }),
        credentials: "include", // cohérence avec les autres appels API
      });
      const data = await res.json();
      if (!res.ok) {
        setFormData((prev) => ({ ...prev, error: data.message || "Erreur", success: "" }));
      } else {
        setFormData({ nom: "", prenom: "", email: "", password: "", confirmPassword: "", error: "", success: "✅ Inscription réussie !" });
        setErreurNom(""); setErreurPrenom(""); setErreurEmail(""); setErreurPassword(""); setErreurConfirm("");
      }
    } catch {
      setFormData((prev) => ({ ...prev, error: "Erreur serveur. Réessayez.", success: "" }));
    }
  };

  const fields = [
    { name: "nom",      type: "text",     placeholder: "Nom",        onChange: NameChange,    value: formData.nom,      erreur: erreurNom },
    { name: "prenom",   type: "text",     placeholder: "Prénom",     onChange: PrenomChange,  value: formData.prenom,   erreur: erreurPrenom },
    { name: "email",    type: "email",    placeholder: "E-mail",     onChange: EmailChange,   value: formData.email,    erreur: erreurEmail },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} noValidate>
          <h2 style={styles.title}>Créer un compte</h2>

          {/* Champs texte / email */}
          {fields.map((f, i) => (
            <div key={f.name} style={styles.inputWrap}>
              <input
                ref={i === 0 ? nomInputRef : undefined}
                type={f.type}
                placeholder={f.placeholder}
                value={f.value}
                onChange={f.onChange}
                style={styles.input(f.name)}
                onFocus={() => setFocused(f.name)}
                onBlur={() => setFocused(null)}
                autoComplete={f.name}
              />
              <p style={styles.errorText}>{f.erreur}</p>
            </div>
          ))}

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
              autoComplete="new-password"
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

          {/* Confirmation mot de passe */}
          <div style={styles.passwordWrap}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={ConfirmPasswordChange}
              style={{ ...styles.input("confirmPassword"), paddingRight: "40px" }}
              onFocus={() => setFocused("confirmPassword")}
              onBlur={() => setFocused(null)}
              autoComplete="new-password"
            />
            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowConfirmPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <p style={styles.errorText}>{erreurConfirm}</p>

          {/* Bouton */}
          <button
            type="submit"
            style={styles.button(btnHovered)}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            S'inscrire
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
            Déjà un compte ?{" "}
            <Link to="/connexion" style={styles.link}>
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Inscription;
