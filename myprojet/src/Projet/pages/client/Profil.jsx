/**
 * Profil.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page profil utilisateur — affiche les informations et permet de les modifier.
 * Protégée par ProtectedRoute (connexion requise).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext";

const API = "http://localhost:3000/api";

export default function Profil() {
  const { user, accessToken } = useContext(UserContext);

  const [form, setForm]       = useState({
    nom:    user?.nom    || "",
    prenom: user?.prenom || "",
    email:  user?.email  || "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); setSuccess("");
    try {
      const res = await fetch(`${API}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("✅ Profil mis à jour avec succès !");
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Mon profil</h1>
      <div style={s.card}>
        {/* Avatar avec initiales */}
        <div style={s.avatar}>
          {user?.prenom?.[0]}{user?.nom?.[0]}
        </div>
        <p style={s.role}>
          {user?.role === "admin" ? "👑 Administrateur" : "🛒 Client"}
        </p>

        <form onSubmit={handleSubmit} style={s.form}>
          {[
            { label: "Nom",     name: "nom" },
            { label: "Prénom",  name: "prenom" },
            { label: "Email",   name: "email", type: "email" },
          ].map((f) => (
            <div key={f.name} style={s.field}>
              <label style={s.label}>{f.label}</label>
              <input
                type={f.type || "text"}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                style={s.input}
              />
            </div>
          ))}

          {error   && <p style={s.error}>{error}</p>}
          {success && <p style={s.successMsg}>{success}</p>}

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page:       { maxWidth: "600px", margin: "50px auto", padding: "0 20px", minHeight: "80vh" },
  title:      { fontSize: "28px", fontWeight: 700, marginBottom: "28px" },
  card:       { background: "#fff", borderRadius: "20px", padding: "40px", border: "1.5px solid #e5e5e5", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" },
  avatar:     { width: "72px", height: "72px", borderRadius: "50%", background: "#4EA3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "12px" },
  role:       { color: "#888", fontSize: "14px", marginBottom: "28px" },
  form:       { display: "flex", flexDirection: "column", gap: "16px" },
  field:      { display: "flex", flexDirection: "column", gap: "6px" },
  label:      { fontSize: "13px", color: "#888", fontWeight: 600 },
  input:      { padding: "12px 16px", background: "#f8f8f8", border: "1.5px solid #e5e5e5", borderRadius: "10px", color: "#1d1d1f", fontSize: "15px", outline: "none" },
  error:      { color: "#e74c3c", fontSize: "13px" },
  successMsg: { color: "#27ae60", fontSize: "13px" },
  btn:        { padding: "13px", background: "#4EA3FF", border: "none", borderRadius: "30px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", marginTop: "8px" },
};
