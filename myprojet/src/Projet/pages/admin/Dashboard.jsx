/**
 * Dashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page d'accueil de l'interface d'administration.
 * Accessible uniquement aux administrateurs (AdminRoute).
 *
 * Affiche :
 *   - 3 cartes de statistiques (utilisateurs, produits, commandes)
 *   - 4 liens rapides vers les pages de gestion
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/UserContext.jsx";

// Carte de statistique réutilisable
function StatCard({ label, value, emoji, color }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e5e5e5", borderRadius: "16px", padding: "24px 28px", flex: 1, minWidth: "160px" }}>
      <div style={{ fontSize: "28px" }}>{emoji}</div>
      <div style={{ fontSize: "32px", fontWeight: 700, color, marginTop: "8px" }}>{value ?? "…"}</div>
      <div style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

function Dashboard() {
  const { accessToken } = useContext(UserContext);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Chargement parallèle des stats via les routes admin
    const headers = { Authorization: `Bearer ${accessToken}` };
    const get = (url) => fetch(url, { credentials: "include", headers }).then((r) => r.json());

    Promise.all([
      get("http://localhost:3000/api/admin/utilisateurs"),
      get("http://localhost:3000/api/admin/produits"),
      get("http://localhost:3000/api/admin/commandes"),
    ]).then(([users, produits, commandes]) => {
      setStats({
        users:    Array.isArray(users)     ? users.length     : 0,
        produits: Array.isArray(produits)  ? produits.length  : 0,
        commandes: Array.isArray(commandes) ? commandes.length : 0,
      });
    }).catch(console.error);
  }, [accessToken]);

  // Liens de navigation rapide
  const navLinks = [
    { to: "/admin/utilisateurs", label: "Gérer les utilisateurs", emoji: "👥" },
    { to: "/admin/produits",     label: "Gérer les produits",     emoji: "📦" },
    { to: "/admin/commandes",    label: "Gérer les commandes",    emoji: "🛒" },
    { to: "/admin/logs",         label: "Voir les logs",          emoji: "📋" },
  ];

  const s = {
    container: { maxWidth: "1000px", margin: "40px auto", padding: "0 20px" },
    title:     { fontSize: "26px", fontWeight: 700, marginBottom: "24px" },
    cards:     { display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" },
    nav:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" },
    link:      { background: "#fff", border: "1.5px solid #e5e5e5", borderRadius: "14px", padding: "20px", textDecoration: "none", color: "#1d1d1f", display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", fontWeight: 500 },
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>🏠 Dashboard Admin</h2>

      {/* Cartes statistiques */}
      <div style={s.cards}>
        <StatCard label="Utilisateurs" value={stats.users}     emoji="👥" color="#0071e3" />
        <StatCard label="Produits"     value={stats.produits}  emoji="📦" color="#22c55e" />
        <StatCard label="Commandes"    value={stats.commandes} emoji="🛒" color="#f59e0b" />
      </div>

      {/* Navigation rapide */}
      <div style={s.nav}>
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={s.link}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <span style={{ fontSize: "22px" }}>{l.emoji}</span>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
