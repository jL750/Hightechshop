/**
 * GestionLogs.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page de visualisation des logs de connexion (table LoginAttempts).
 * Accessible uniquement aux administrateurs (AdminRoute).
 *
 * Affiche pour chaque entrée :
 *   - L'utilisateur concerné (nom, prénom, email)
 *   - L'adresse IP de la dernière tentative
 *   - Le nombre de tentatives échouées
 *   - La date/heure de la dernière tentative
 *   - Le statut : "Bloqué" (rouge) si LockedUntil > maintenant, "OK" (vert) sinon
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext.jsx";

function GestionLogs() {
  const { accessToken } = useContext(UserContext);
  const [logs, setLogs]     = useState([]);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/logs", {
          credentials: "include",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des logs.");
        setLogs(await res.json());
      } catch (e) {
        setErreur(e.message);
      }
    };
    if (accessToken) charger();
  }, [accessToken]);

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    container: { maxWidth: "1000px", margin: "40px auto", padding: "0 20px" },
    title:     { fontSize: "24px", fontWeight: 600, marginBottom: "20px" },
    table:     { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    th:        { textAlign: "left", padding: "12px 16px", background: "#f5f5f7", fontSize: "13px", color: "#888", fontWeight: 600 },
    td:        { padding: "12px 16px", borderTop: "1px solid #f0f0f0", fontSize: "13px" },
  };

  // Style du badge statut selon l'état du blocage
  const badgeStyle = (locked) => ({
    display:         "inline-block",
    padding:         "3px 10px",
    borderRadius:    "20px",
    fontSize:        "12px",
    fontWeight:       600,
    color:           "#fff",
    backgroundColor: locked ? "#ef4444" : "#22c55e",
  });

  return (
    <div style={s.container}>
      <h2 style={s.title}>📋 Logs de connexion</h2>
      {erreur && <p style={{ color: "red", marginBottom: "12px" }}>{erreur}</p>}

      <table style={s.table}>
        <thead>
          <tr>
            {["Utilisateur", "IP", "Tentatives", "Dernière tentative", "Statut"].map((h) => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => {
            // Vérifie si le compte est actuellement bloqué
            const locked = l.LockedUntil && new Date(l.LockedUntil) > new Date();
            return (
              <tr key={l.id}>
                <td style={s.td}>
                  {l.User
                    ? `${l.User.nom} ${l.User.prenom} — ${l.User.email}`
                    : `User #${l.idUser}`}
                </td>
                <td style={s.td}>{l.ip_adresse || "—"}</td>
                <td style={s.td}>{l.AttemptCount}</td>
                <td style={s.td}>
                  {l.LastAttemptAt
                    ? new Date(l.LastAttemptAt).toLocaleString("fr-FR")
                    : "—"}
                </td>
                <td style={s.td}>
                  <span style={badgeStyle(locked)}>
                    {locked ? "🔒 Bloqué" : "✅ OK"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default GestionLogs;
