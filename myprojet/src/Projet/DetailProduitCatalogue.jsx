import { useState, useContext } from "react";
import { useNavigate }   from "react-router-dom";
import { PanierContext } from "./Context/PanierContext";
import { UserContext }   from "./Context/UserContext";

function DetailProduitCatalogue({ produit, onClose }) {
  const { ajouterAuPanier } = useContext(PanierContext);
  const { user }            = useContext(UserContext);
  const navigate            = useNavigate();
  const [added, setAdded]   = useState(false);

  const handleAdd = () => {
    if (!user) {
      sessionStorage.setItem("pendingPanier",   JSON.stringify(produit));
      sessionStorage.setItem("pendingRedirect", "/catalogue");
      onClose();
      navigate("/connexion");
      return;
    }
    ajouterAuPanier(produit);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>

        {/* Bouton fermer */}
        <button style={s.closeBtn} onClick={onClose}>✕</button>

        {/* Image */}
        <div style={s.imgWrap}>
          <img
            src={produit.image || "https://via.placeholder.com/400x280?text=Photo"}
            alt={produit.nom}
            style={s.img}
          />
        </div>

        {/* Contenu */}
        <div style={s.body}>
          <h2 style={s.nom}>{produit.nom}</h2>

          {produit.description && (
            <p style={s.desc}>{produit.description}</p>
          )}

          <div style={s.footer}>
            <span style={s.prix}>{Number(produit.prix).toFixed(2)} €</span>
            <button
              style={{
                ...s.addBtn,
                background: added
                  ? "linear-gradient(135deg,#22c55e,#16a34a)"
                  : "linear-gradient(135deg,#4EA3FF,#2563eb)",
              }}
              onClick={handleAdd}
            >
              {added ? "✓ Ajouté au panier !" : "Ajouter au panier"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)", padding: "20px" },
  modal:   { backgroundColor: "#fff", borderRadius: "20px", maxWidth: "480px", width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden", position: "relative" },

  closeBtn: { position: "absolute", top: "14px", right: "14px", background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "13px", color: "#555", zIndex: 1, lineHeight: 1 },

  imgWrap: { background: "#fafafa", display: "flex", justifyContent: "center", alignItems: "center" },
  img:     { width: "100%", height: "240px", objectFit: "contain", padding: "20px", boxSizing: "border-box" },

  body:   { padding: "20px 24px 24px" },
  nom:    { fontSize: "20px", fontWeight: 700, color: "#111", marginBottom: "10px", lineHeight: 1.3 },
  desc:   { fontSize: "14px", color: "#666", lineHeight: 1.6, marginBottom: "20px" },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" },
  prix:   { fontSize: "26px", fontWeight: 800, color: "#111", letterSpacing: "-0.03em", flexShrink: 0 },
  addBtn: { flex: 1, padding: "12px 20px", border: "none", borderRadius: "50px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "14px", transition: "background 0.25s ease" },
};

export default DetailProduitCatalogue;
