import { useContext } from "react";
import { useNavigate }   from "react-router-dom";
import { PanierContext } from "./Context/PanierContext";
import { UserContext }   from "./Context/UserContext";

function Panier() {
  const { items, totalPrice, supprimerArticle, modifierQuantite } = useContext(PanierContext);
  const { user }    = useContext(UserContext);
  const navigate    = useNavigate();
  const panier      = items || [];
  const nbArticles  = panier.reduce((acc, i) => acc + (i.quantite || 1), 0);

  const augmenter = (id, q) => modifierQuantite(id, q + 1);
  const diminuer  = (id, q) => modifierQuantite(id, Math.max(1, q - 1));

  /* ── Panier vide ────────────────────────────────────────────────────── */
  if (panier.length === 0) return (
    <div style={s.page}>
      <div style={s.emptyWrap}>
        <p style={s.emptyIcon}>🛒</p>
        <h2 style={s.emptyTitle}>Votre panier est vide</h2>
        <p style={s.emptySub}>Découvrez nos produits et ajoutez vos favoris.</p>
        <button style={s.ctaBtn} onClick={() => navigate("/catalogue")}>
          Explorer le catalogue
        </button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>

      {/* ── Titre ────────────────────────────────────────────────────── */}
      <h1 style={s.title}>Mon panier</h1>

      <div style={s.layout}>

        {/* ── Liste des articles ───────────────────────────────────── */}
        <div style={s.liste}>
          {panier.map((item) => (
            <div key={item.idProduit} style={s.card}>

              {/* Image */}
              <div style={s.imgWrap}>
                <img
                  src={item.image || "https://via.placeholder.com/100x100?text=Photo"}
                  alt={item.nom}
                  style={s.img}
                />
              </div>

              {/* Infos */}
              <div style={s.cardBody}>
                <p style={s.nom}>{item.nom}</p>
                <p style={s.unitPrice}>{Number(item.prix).toFixed(2)} € / unité</p>

                {/* Contrôle quantité */}
                <div style={s.qtyRow}>
                  <button style={s.qtyBtn} onClick={() => diminuer(item.idProduit, item.quantite || 1)}>−</button>
                  <span style={s.qty}>{item.quantite || 1}</span>
                  <button style={s.qtyBtn} onClick={() => augmenter(item.idProduit, item.quantite || 1)}>+</button>
                </div>
              </div>

              {/* Sous-total + supprimer */}
              <div style={s.cardRight}>
                <span style={s.subtotal}>
                  {(item.prix * (item.quantite || 1)).toFixed(2)} €
                </span>
                <button
                  style={s.deleteBtn}
                  onClick={() => supprimerArticle(item.idProduit)}
                  title="Supprimer"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Récapitulatif ───────────────────────────────────────── */}
        <div style={s.summary}>
          <h2 style={s.summaryTitle}>Récapitulatif</h2>

          <div style={s.summaryRow}>
            <span style={s.summaryLabel}>
              {nbArticles} article{nbArticles > 1 ? "s" : ""}
            </span>
            <span style={s.summaryValue}>{(totalPrice || 0).toFixed(2)} €</span>
          </div>

          <div style={s.summaryRow}>
            <span style={s.summaryLabel}>Livraison</span>
            <span style={{ ...s.summaryValue, color: "#22c55e", fontWeight: 700 }}>Gratuite</span>
          </div>

          <div style={s.divider} />

          <div style={{ ...s.summaryRow, marginBottom: "24px" }}>
            <span style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: "22px", color: "#111", letterSpacing: "-0.03em" }}>
              {(totalPrice || 0).toFixed(2)} €
            </span>
          </div>

          <button
            style={s.checkoutBtn}
            onClick={() => user ? navigate("/commande") : navigate("/connexion")}
          >
            Commander →
          </button>

          <button style={s.continueBtn} onClick={() => navigate("/catalogue")}>
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:  { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 72px" },
  title: { fontSize: "32px", fontWeight: 800, color: "#111", marginBottom: "32px", letterSpacing: "-0.02em" },

  /* Layout */
  layout: { display: "flex", gap: "28px", alignItems: "flex-start" },
  liste:  { flex: 1, display: "flex", flexDirection: "column", gap: "14px", minWidth: 0 },

  /* Item card */
  card:      { display: "flex", alignItems: "center", gap: "16px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  imgWrap:   { flexShrink: 0, width: "88px", height: "88px", background: "#fafafa", borderRadius: "10px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
  img:       { width: "100%", height: "100%", objectFit: "contain", padding: "6px", boxSizing: "border-box" },
  cardBody:  { flex: 1, minWidth: 0 },
  nom:       { fontSize: "14px", fontWeight: 600, color: "#111", marginBottom: "4px", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  unitPrice: { fontSize: "13px", color: "#aaa", marginBottom: "10px" },
  qtyRow:    { display: "flex", alignItems: "center", gap: "10px" },
  qtyBtn:    { width: "30px", height: "30px", borderRadius: "50%", border: "1.5px solid #e0e0e0", background: "#fff", color: "#333", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, lineHeight: 1 },
  qty:       { fontSize: "15px", fontWeight: 700, color: "#111", minWidth: "20px", textAlign: "center" },
  cardRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", flexShrink: 0 },
  subtotal:  { fontSize: "17px", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "16px", opacity: 0.4, padding: "4px" },

  /* Summary */
  summary:      { width: "280px", flexShrink: 0, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", position: "sticky", top: "80px" },
  summaryTitle: { fontSize: "18px", fontWeight: 700, color: "#111", marginBottom: "20px" },
  summaryRow:   { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  summaryLabel: { fontSize: "14px", color: "#888" },
  summaryValue: { fontSize: "14px", fontWeight: 600, color: "#111" },
  divider:      { height: "1px", background: "#f0f0f0", margin: "16px 0" },
  checkoutBtn:  { width: "100%", padding: "14px", background: "linear-gradient(135deg,#4EA3FF,#2563eb)", border: "none", borderRadius: "50px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", marginBottom: "10px" },
  continueBtn:  { width: "100%", padding: "12px", background: "transparent", border: "1.5px solid #e0e0e0", borderRadius: "50px", color: "#666", fontSize: "13px", fontWeight: 600, cursor: "pointer" },

  /* Empty */
  emptyWrap:  { textAlign: "center", padding: "80px 20px" },
  emptyIcon:  { fontSize: "64px", marginBottom: "16px" },
  emptyTitle: { fontSize: "26px", fontWeight: 700, color: "#111", marginBottom: "10px" },
  emptySub:   { color: "#aaa", fontSize: "15px", marginBottom: "32px" },
  ctaBtn:     { padding: "14px 40px", background: "linear-gradient(135deg,#4EA3FF,#2563eb)", border: "none", borderRadius: "50px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer" },
};

export default Panier;
