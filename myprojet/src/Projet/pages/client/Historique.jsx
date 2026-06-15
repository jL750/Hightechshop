/**
 * Historique.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page historique des commandes — avec accordéon pour afficher le détail.
 * Protégée par ProtectedRoute (connexion requise).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/UserContext";

const API = "http://localhost:3000/api";

const STATUT_LABELS = {
  en_attente: { label: "En attente",  color: "#f39c12" },
  confirmee:  { label: "Confirmée",   color: "#3498db" },
  expediee:   { label: "Expédiée",    color: "#9b59b6" },
  livree:     { label: "Livrée",      color: "#27ae60" },
  annulee:    { label: "Annulée",     color: "#e74c3c" },
};

export default function Historique() {
  const { accessToken }           = useContext(UserContext);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);  // id de la commande ouverte

  useEffect(() => {
    if (!accessToken) return;
    fetch(`${API}/commandes/mes-commandes`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(r => r.json())
      .then(data => setCommandes(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#888" }}>Chargement...</p>
    </div>
  );

  return (
    <div style={s.page}>
      <h1 style={s.title}>Mes Commandes</h1>

      {commandes.length === 0 ? (
        <div style={s.empty}>
          <p style={{ fontSize: "48px" }}>📦</p>
          <h2 style={s.emptyTitle}>Aucune commande pour l'instant</h2>
          <p style={{ color: "#888" }}>Vos commandes passées apparaîtront ici.</p>
        </div>
      ) : (
        <div style={s.list}>
          {commandes.map(cmd => {
            const statut = STATUT_LABELS[cmd.statut] || { label: cmd.statut, color: "#888" };
            const isOpen = expanded === cmd.idCommande;

            return (
              <div key={cmd.idCommande} style={s.card}>
                {/* En-tête cliquable → ouvre/ferme le détail */}
                <div style={s.cardHeader} onClick={() => setExpanded(isOpen ? null : cmd.idCommande)}>
                  <div style={s.cmdInfo}>
                    <span style={s.cmdNum}>Commande #{cmd.idCommande}</span>
                    <span style={s.cmdDate}>
                      {new Date(cmd.dateCommande).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Badge statut coloré */}
                    <span style={{
                      ...s.statutBadge,
                      background:  statut.color + "22",
                      border:     `1px solid ${statut.color}`,
                      color:       statut.color,
                    }}>
                      {statut.label}
                    </span>
                    <span style={s.quantite}>{cmd.Quantite} article(s)</span>
                    <span style={{ color: "#aaa", fontSize: "18px" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Détail accordéon */}
                {isOpen && (
                  <div style={s.cardBody}>
                    <p style={{ color: "#888", fontSize: "14px" }}>
                      Commande passée le {new Date(cmd.dateCommande).toLocaleDateString("fr-FR")}
                    </p>
                    <p style={{ color: "#888", fontSize: "14px" }}>
                      Quantité totale : {cmd.Quantite} article(s)
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page:       { maxWidth: "860px", margin: "0 auto", padding: "40px 20px", minHeight: "80vh" },
  title:      { fontSize: "28px", fontWeight: 700, marginBottom: "32px" },
  empty:      { textAlign: "center", paddingTop: "60px" },
  emptyTitle: { fontSize: "24px", fontWeight: 700, marginBottom: "12px" },
  list:       { display: "flex", flexDirection: "column", gap: "14px" },
  card:       { background: "#fff", borderRadius: "14px", border: "1.5px solid #e5e5e5", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", cursor: "pointer" },
  cmdInfo:    { display: "flex", flexDirection: "column", gap: "4px" },
  cmdNum:     { fontWeight: 700, fontSize: "16px" },
  cmdDate:    { fontSize: "13px", color: "#888" },
  statutBadge:{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 },
  quantite:   { fontSize: "15px", fontWeight: 600, color: "#4EA3FF" },
  cardBody:   { borderTop: "1px solid #f0f0f0", padding: "18px 22px", display: "flex", flexDirection: "column", gap: "8px" },
};
