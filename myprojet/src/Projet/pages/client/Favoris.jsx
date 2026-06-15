/**
 * Favoris.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page des produits favoris — chargés depuis MongoDB via /api/favoris.
 * Protégée par ProtectedRoute (connexion requise).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useNavigate } from "react-router-dom";
import { useFavoris }  from "../../Context/FavorisContext";
import { useContext }  from "react";
import { PanierContext } from "../../Context/PanierContext";

export default function Favoris() {
  const { items, loading, removeFavori } = useFavoris();
  const { ajouterAuPanier }              = useContext(PanierContext);
  const navigate                          = useNavigate();

  if (loading) return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#888", fontSize: "18px" }}>Chargement de vos favoris...</p>
    </div>
  );

  return (
    <div style={s.page}>
      <h1 style={s.title}>Mes Favoris ♥</h1>

      {items.length === 0 ? (
        // État vide
        <div style={s.empty}>
          <p style={s.emptyIcon}>🤍</p>
          <h2 style={s.emptyTitle}>Aucun favori pour l'instant</h2>
          <p style={s.emptySub}>Ajoutez des produits à vos favoris depuis le catalogue.</p>
          <button style={s.ctaBtn} onClick={() => navigate("/catalogue")}>
            Explorer le catalogue
          </button>
        </div>
      ) : (
        <div style={s.grid}>
          {items.map((p) => (
            <div key={p.idProduit} style={s.card}>
              {/* Bouton retirer du favori */}
              <button
                style={s.heartBtn}
                onClick={() => removeFavori(p.idProduit)}
                title="Retirer des favoris"
              >
                ♥
              </button>

              <img
                src={p.image || "https://via.placeholder.com/300x200?text=Hightechshop"}
                alt={p.nom}
                style={s.img}
              />

              <div style={s.info}>
                <h3 style={s.nom}>{p.nom}</h3>
                <p style={s.prix}>{Number(p.prix).toFixed(2)} €</p>
                <div style={s.actions}>
                  {/* Ajouter au panier */}
                  <button
                    style={s.addBtn}
                    onClick={() => ajouterAuPanier(p, 1)}
                  >
                    + Panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page:       { maxWidth: "1100px", margin: "0 auto", padding: "40px 20px", minHeight: "80vh" },
  title:      { fontSize: "32px", fontWeight: 700, marginBottom: "32px" },
  empty:      { textAlign: "center", paddingTop: "80px" },
  emptyIcon:  { fontSize: "64px", marginBottom: "12px" },
  emptyTitle: { fontSize: "26px", fontWeight: 700, marginBottom: "12px" },
  emptySub:   { color: "#888", marginBottom: "32px" },
  ctaBtn:     { padding: "14px 40px", background: "#4EA3FF", border: "none", borderRadius: "30px", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer" },
  grid:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" },
  card:       { background: "#fff", border: "1.5px solid #e5e5e5", borderRadius: "16px", overflow: "hidden", position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  heartBtn:   { position: "absolute", top: "12px", right: "12px", background: "rgba(255,78,78,0.85)", border: "none", borderRadius: "50%", width: "34px", height: "34px", color: "#fff", fontSize: "16px", cursor: "pointer", zIndex: 2 },
  img:        { width: "100%", height: "200px", objectFit: "contain", display: "block", padding: "12px", boxSizing: "border-box" },
  info:       { padding: "16px" },
  nom:        { fontSize: "15px", fontWeight: 700, marginBottom: "6px" },
  prix:       { fontSize: "22px", fontWeight: 700, color: "#4EA3FF", marginBottom: "14px" },
  actions:    { display: "flex", gap: "10px" },
  addBtn:     { flex: 1, padding: "9px 0", background: "rgba(78,163,255,0.1)", border: "1.5px solid #4EA3FF", borderRadius: "30px", color: "#4EA3FF", fontWeight: 700, cursor: "pointer", fontSize: "14px" },
};
