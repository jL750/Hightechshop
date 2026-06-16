import { useState, useContext } from "react";
import { useNavigate }          from "react-router-dom";
import { useFavoris }           from "../../Context/FavorisContext";
import { PanierContext }        from "../../Context/PanierContext";
import DetailProduitCatalogue   from "../../DetailProduitCatalogue";

export default function Favoris() {
  const { items, loading, removeFavori } = useFavoris();
  const { ajouterAuPanier }              = useContext(PanierContext);
  const navigate                          = useNavigate();
  const [produitDetail, setProduitDetail] = useState(null);
  const [hoveredCard, setHoveredCard]     = useState(null);
  const [addedCard, setAddedCard]         = useState(null);
  const [removingCard, setRemovingCard]   = useState(null);

  const handleAjouterPanier = (p) => {
    ajouterAuPanier(p, 1);
    setAddedCard(p.idProduit);
    setTimeout(() => setAddedCard(null), 1600);
  };

  const handleRemove = (idProduit) => {
    setRemovingCard(idProduit);
    setTimeout(() => {
      removeFavori(idProduit);
      setRemovingCard(null);
    }, 250);
  };

  /* ── Chargement ─────────────────────────────────────────────────────── */
  if (loading) return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroBadge}>♥ Mes Favoris</div>
        <h1 style={s.heroTitle}>Mes coups de cœur</h1>
        <p style={s.heroSub}>Chargement de vos favoris...</p>
      </div>
      <div style={s.grid}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={s.skeleton} />
        ))}
      </div>
    </div>
  );

  /* ── État vide ──────────────────────────────────────────────────────── */
  if (items.length === 0) return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroBadge}>♥ Mes Favoris</div>
        <h1 style={s.heroTitle}>Mes coups de cœur</h1>
      </div>
      <div style={s.emptyWrap}>
        <p style={s.emptyIcon}>🤍</p>
        <h2 style={s.emptyTitle}>Aucun favori pour l'instant</h2>
        <p style={s.emptySub}>
          Ajoutez des produits depuis le catalogue en cliquant sur le cœur.
        </p>
        <button style={s.ctaBtn} onClick={() => navigate("/catalogue")}>
          Explorer le catalogue
        </button>
      </div>
    </div>
  );

  /* ── Liste des favoris ──────────────────────────────────────────────── */
  return (
    <div style={s.page}>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroBadge}>♥ Mes Favoris</div>
        <h1 style={s.heroTitle}>Mes coups de cœur</h1>
        <p style={s.heroSub}>
          {items.length} produit{items.length > 1 ? "s" : ""} dans vos favoris
        </p>
      </div>

      {/* Grille */}
      <div style={s.grid}>
        {items.map((p) => {
          const isHovered  = hoveredCard === p.idProduit;
          const isAdded    = addedCard   === p.idProduit;
          const isRemoving = removingCard === p.idProduit;

          return (
            <div
              key={p.idProduit}
              style={{
                ...s.card,
                opacity:    isRemoving ? 0 : 1,
                transform:  isRemoving
                  ? "scale(0.95)"
                  : isHovered
                  ? "translateY(-5px)"
                  : "translateY(0)",
                boxShadow:  isHovered
                  ? "0 16px 40px rgba(0,0,0,0.13)"
                  : "0 2px 10px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={() => setHoveredCard(p.idProduit)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Bouton retirer */}
              <button
                style={s.heartBtn}
                onClick={() => handleRemove(p.idProduit)}
                title="Retirer des favoris"
              >
                ♥
              </button>

              {/* Image */}
              <div style={s.imgWrap} onClick={() => setProduitDetail(p)}>
                <img
                  src={p.image || "https://via.placeholder.com/300x200?text=Photo"}
                  alt={p.nom}
                  style={{
                    ...s.img,
                    transform: isHovered ? "scale(1.06)" : "scale(1)",
                  }}
                />
              </div>

              {/* Infos */}
              <div style={s.info}>
                <p style={s.nom} onClick={() => setProduitDetail(p)}>{p.nom}</p>
                {p.description && <p style={s.desc}>{p.description}</p>}

                <div style={s.priceRow}>
                  <span style={s.prix}>{Number(p.prix).toFixed(2)} €</span>
                </div>

                <div style={s.actions}>
                  <button
                    style={{
                      ...s.addBtn,
                      background: isAdded
                        ? "linear-gradient(135deg,#22c55e,#16a34a)"
                        : "linear-gradient(135deg,#4EA3FF,#2563eb)",
                    }}
                    onClick={() => handleAjouterPanier(p)}
                  >
                    {isAdded ? "✓ Ajouté !" : "+ Panier"}
                  </button>
                  <button style={s.detailBtn} onClick={() => setProduitDetail(p)}>
                    Détails
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {produitDetail && (
        <DetailProduitCatalogue
          produit={produitDetail}
          onClose={() => setProduitDetail(null)}
        />
      )}
    </div>
  );
}

/* ── Styles ───────────────────────────────────────────────────────────────── */
const s = {
  page: { maxWidth: "1200px", margin: "0 auto", padding: "0 24px 72px" },

  /* Hero */
  hero:      { textAlign: "center", padding: "52px 20px 36px" },
  heroBadge: { display: "inline-block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#e63333", background: "rgba(230,51,51,0.08)", padding: "4px 14px", borderRadius: "50px", marginBottom: "16px", textTransform: "uppercase" },
  heroTitle: { fontSize: "40px", fontWeight: 800, color: "#111", margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.1 },
  heroSub:   { color: "#999", fontSize: "15px" },

  /* Grid */
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },

  /* Skeleton */
  skeleton: { height: "360px", borderRadius: "18px", background: "linear-gradient(90deg,#f4f4f4 0%,#ececec 50%,#f4f4f4 100%)" },

  /* Card */
  card:    { background: "#fff", borderRadius: "18px", overflow: "hidden", position: "relative", border: "1px solid #f0f0f0", transition: "transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease" },
  heartBtn:{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,60,60,0.10)", border: "1px solid rgba(255,60,60,0.2)", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "17px", color: "#e63333", zIndex: 2, transition: "all 0.15s ease" },
  imgWrap: { overflow: "hidden", background: "#fafafa", cursor: "pointer" },
  img:     { width: "100%", height: "190px", objectFit: "contain", display: "block", padding: "16px", boxSizing: "border-box", transition: "transform 0.3s ease" },
  info:    { padding: "12px 14px 16px" },
  nom:     { fontSize: "14px", fontWeight: 600, color: "#111", marginBottom: "6px", lineHeight: 1.35, cursor: "pointer", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "38px" },
  desc:    { fontSize: "12px", color: "#aaa", lineHeight: 1.4, marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  priceRow:{ display: "flex", alignItems: "center", marginBottom: "12px" },
  prix:    { fontSize: "22px", fontWeight: 800, color: "#111", letterSpacing: "-0.03em" },
  actions: { display: "flex", gap: "8px" },
  addBtn:  { flex: 2, padding: "10px 0", border: "none", borderRadius: "50px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "13px", transition: "background 0.25s ease", letterSpacing: "0.01em" },
  detailBtn:{ flex: 1, padding: "10px 0", background: "transparent", border: "1.5px solid #e8e8e8", borderRadius: "50px", color: "#666", fontWeight: 600, cursor: "pointer", fontSize: "13px" },

  /* Empty */
  emptyWrap:  { textAlign: "center", padding: "40px 20px 80px" },
  emptyIcon:  { fontSize: "64px", marginBottom: "16px" },
  emptyTitle: { fontSize: "26px", fontWeight: 700, color: "#111", marginBottom: "10px" },
  emptySub:   { color: "#aaa", fontSize: "15px", marginBottom: "32px", maxWidth: "340px", margin: "0 auto 32px" },
  ctaBtn:     { padding: "14px 40px", background: "linear-gradient(135deg,#4EA3FF,#2563eb)", border: "none", borderRadius: "50px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer" },
};
