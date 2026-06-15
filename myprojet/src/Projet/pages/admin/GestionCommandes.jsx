/**
 * GestionCommandes.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page d'administration des commandes.
 * Accessible uniquement aux administrateurs (AdminRoute).
 *
 * Fonctionnalités :
 *   - Liste toutes les commandes avec les infos client
 *   - Modification du statut via un sélecteur coloré
 *
 * Statuts possibles : en_attente | confirmee | expediee | livree | annulee
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext.jsx";

// Couleur de fond pour chaque statut de commande
const STATUT_COLORS = {
  en_attente: "#f59e0b",
  confirmee:  "#3b82f6",
  expediee:   "#8b5cf6",
  livree:     "#22c55e",
  annulee:    "#ef4444",
};

function GestionCommandes() {
  const { accessToken } = useContext(UserContext);
  const [commandes, setCommandes] = useState([]);
  const [erreur, setErreur]       = useState("");

  const headers = {
    Authorization:  `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  // Charge toutes les commandes
  const charger = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/commandes", {
        credentials: "include",
        headers,
      });
      setCommandes(await res.json());
    } catch (e) {
      setErreur(e.message);
    }
  };

  useEffect(() => { if (accessToken) charger(); }, [accessToken]);

  // Met à jour le statut d'une commande
  const changerStatut = async (id, statut) => {
    await fetch(`http://localhost:3000/api/admin/commandes/${id}/statut`, {
      method:      "PUT",
      credentials: "include",
      headers,
      body:        JSON.stringify({ statut }),
    });
    charger(); // recharge après modification
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    container: { maxWidth: "1000px", margin: "40px auto", padding: "0 20px" },
    title:     { fontSize: "24px", fontWeight: 600, marginBottom: "20px" },
    table:     { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    th:        { textAlign: "left", padding: "12px 16px", background: "#f5f5f7", fontSize: "13px", color: "#888", fontWeight: 600 },
    td:        { padding: "12px 16px", borderTop: "1px solid #f0f0f0", fontSize: "14px" },
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>🛒 Gestion des commandes</h2>
      {erreur && <p style={{ color: "red", marginBottom: "12px" }}>{erreur}</p>}

      <table style={s.table}>
        <thead>
          <tr>
            {["#", "Client", "Date", "Quantité", "Statut"].map((h) => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {commandes.map((c) => (
            <tr key={c.idCommande}>
              <td style={s.td}>#{c.idCommande}</td>
              <td style={s.td}>
                {c.User
                  ? `${c.User.nom} ${c.User.prenom} (${c.User.email})`
                  : `User #${c.id_user}`}
              </td>
              <td style={s.td}>
                {new Date(c.dateCommande).toLocaleDateString("fr-FR")}
              </td>
              <td style={s.td}>{c.Quantite} article(s)</td>
              <td style={s.td}>
                {/* Sélecteur de statut avec fond coloré selon la valeur */}
                <select
                  style={{
                    padding:         "5px 8px",
                    borderRadius:    "8px",
                    border:          "none",
                    fontSize:        "13px",
                    fontWeight:       600,
                    color:           "#fff",
                    backgroundColor: STATUT_COLORS[c.statut] || "#888",
                    cursor:          "pointer",
                  }}
                  value={c.statut || "en_attente"}
                  onChange={(e) => changerStatut(c.idCommande, e.target.value)}
                >
                  {Object.keys(STATUT_COLORS).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionCommandes;
