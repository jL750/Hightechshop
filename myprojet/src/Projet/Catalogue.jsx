import { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext }    from "./Context/UserContext";
import { PanierContext }  from "./Context/PanierContext";
import { FavorisContext } from "./Context/FavorisContext";
import DetailProduitCatalogue from "./DetailProduitCatalogue";

function Catalogue() {
  const navigate = useNavigate();
  const { user }                              = useContext(UserContext);
  const { panier, ajouterAuPanier }           = useContext(PanierContext);
  const { addFavori, removeFavori, isFavori } = useContext(FavorisContext);

  const [produits, setProduits]           = useState([]);
  const [chargement, setChargement]       = useState(true);
  const [erreur, setErreur]               = useState("");
  const [recherche, setRecherche]         = useState("");
  const [searchFocus, setSearchFocus]     = useState(false);
  const [produitDetail, setProduitDetail] = useState(null);
  const [hoveredCard, setHoveredCard]     = useState(null);
  const [addedCard, setAddedCard]         = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/produits", { credentials: "include" });
        if (!res.ok) throw new Error("Impossible de charger les produits");
        setProduits(await res.json());
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const produitsFiltres = useMemo(() =>
    produits.filter(p => p.nom.toLowerCase().includes(recherche.toLowerCase())),
    [produits, recherche]
  );

  const toggleFavori = (p) => {
    if (!user) {
      sessionStorage.setItem("pendingFavori", p.idProduit);
      sessionStorage.setItem("pendingRedirect", "/catalogue");
      navigate("/connexion");
      return;
    }
    if (isFavori(p.idProduit)) removeFavori(p.idProduit);
    else                        addFavori(p.idProduit);
  };

  const handleAjouterPanier = (p) => {
    if (!user) {
      sessionStorage.setItem("pendingPanier", JSON.stringify(p));
      sessionStorage.setItem("pendingRedirect", "/catalogue");
      navigate("/connexion");
      return;
    }
    ajouterAuPanier(p, 1);
    setAddedCard(p.idProduit);
    setTimeout(() => setAddedCard(null), 1600);
  };

  const nbPanier = panier?.reduce((total, item) => total + (item.quantite || 1), 0) || 0;

  if (erreur) return (
    <div style={s.errorPage}>
      <span style={s.errorIcon}>😕</span>
      <p style={s.errorMsg}>Impossible de charger le catalogue</p>
      <p style={s.errorSub}>{erreur}</p>
    </div>
  );

  return (
    <div style={s.page}>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div style={s.hero}>
        <div style={s.heroBadge}>✦ High Tech Shop</div>
        <h1 style={s.heroTitle}>Notre catalogue</h1>
        <p style={s.heroSub}>
          {chargement ? "Chargement..." : `${produits.length} produits tech sélectionnés pour vous`}
        </p>

        {/* Barre de recherche */}
        <div style={{ ...s.searchWrap, borderColor: searchFocus ? "#4EA3FF" : "#e0e0e0", boxShadow: searchFocus ? "0 0 0 4px rgba(78,163,255,0.12)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
          <span style={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            style={s.searchInput}
          />
          {recherche && (
            <button style={s.clearBtn} onClick={() => setRecherche("")}>✕</button>
          )}
        </div>
      </div>

      {/* ── Barre info + panier ─────────────────────────────────── */}
      <div style={s.bar}>
        <span style={s.resultCount}>
          {recherche
            ? `${produitsFiltres.length} résultat${produitsFiltres.length !== 1 ? "s" : ""} pour « ${recherche} »`
            : !chargement && `${produits.length} produits`}
        </span>
        {user && (
          <button style={s.panierBtn} onClick={() => navigate("/panier")}>
            🛒&nbsp; Mon panier
            {nbPanier > 0 && <span style={s.panierBadge}>{nbPanier}</span>}
          </button>
        )}
      </div>

      {/* ── Skeletons chargement ─────────────────────────────────── */}
      {chargement && (
        <div style={s.grid}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={s.skeleton} />
          ))}
        </div>
      )}

      {/* ── Aucun résultat ──────────────────────────────────────── */}
      {!chargement && produitsFiltres.length === 0 && (
        <div style={s.emptySearch}>
          <p style={s.emptyIcon}>🔍</p>
          <h2 style={s.emptyTitle}>Aucun résultat</h2>
          <p style={s.emptySub}>Essayez un autre mot-clé.</p>
          <button style={s.emptyBtn} onClick={() => setRecherche("")}>
            Effacer la recherche
          </button>
        </div>
      )}

      {/* ── Grille produits ─────────────────────────────────────── */}
      {!chargement && produitsFiltres.length > 0 && (
        <div style={s.grid}>
          {produitsFiltres.map((p) => {
            const id        = p.idProduit || p._id;
            const isHovered = hoveredCard === id;
            const isAdded   = addedCard === p.idProduit;
            const isFav     = isFavori(p.idProduit);

            return (
              <div
                key={id}
                style={{
                  ...s.card,
                  transform:  isHovered ? "translateY(-5px)" : "translateY(0)",
                  boxShadow:  isHovered
                    ? "0 16px 40px rgba(0,0,0,0.13)"
                    : "0 2px 10px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={() => setHoveredCard(id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Bouton favori */}
                <button
                  style={{
                    ...s.favBtn,
                    background:  isFav ? "rgba(255,60,60,0.10)" : "rgba(255,255,255,0.92)",
                    color:       isFav ? "#e63333" : "#ccc",
                    borderColor: isFav ? "rgba(255,60,60,0.2)" : "rgba(0,0,0,0.08)",
                  }}
                  onClick={() => toggleFavori(p)}
                  title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  {isFav ? "♥" : "♡"}
                </button>

                {/* Zone image cliquable */}
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

                {/* Infos produit */}
                <div style={s.info}>
                  <p style={s.nom} onClick={() => setProduitDetail(p)}>{p.nom}</p>

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
      )}

      {produitDetail && (
        <DetailProduitCatalogue produit={produitDetail} onClose={() => setProduitDetail(null)} />
      )}
    </div>
  );
}

/* ── Styles ───────────────────────────────────────────────────────────────── */
const s = {
  page: { maxWidth: "1200px", margin: "0 auto", padding: "0 24px 72px" },

  /* Hero */
  hero:       { textAlign: "center", padding: "52px 20px 36px" },
  heroBadge:  { display: "inline-block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#4EA3FF", background: "rgba(78,163,255,0.1)", padding: "4px 14px", borderRadius: "50px", marginBottom: "16px", textTransform: "uppercase" },
  heroTitle:  { fontSize: "40px", fontWeight: 800, color: "#111", margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.1 },
  heroSub:    { color: "#999", fontSize: "15px", marginBottom: "32px" },

  searchWrap:  { position: "relative", maxWidth: "500px", margin: "0 auto", background: "#fff", borderRadius: "50px", border: "2px solid #e0e0e0", display: "flex", alignItems: "center", transition: "border-color 0.2s, box-shadow 0.2s" },
  searchIcon:  { paddingLeft: "18px", fontSize: "15px", flexShrink: 0, color: "#aaa" },
  searchInput: { flex: 1, padding: "14px 12px", background: "transparent", border: "none", outline: "none", fontSize: "15px", color: "#111", fontFamily: "inherit" },
  clearBtn:    { background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: "13px", paddingRight: "16px", flexShrink: 0 },

  /* Bar */
  bar:         { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", minHeight: "36px" },
  resultCount: { fontSize: "13px", color: "#aaa", fontWeight: 500 },
  panierBtn:   { display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "50px", border: "1.5px solid #e0e0e0", background: "#fff", color: "#444", fontSize: "13px", fontWeight: 600, cursor: "pointer", position: "relative" },
  panierBadge: { background: "#4EA3FF", color: "#fff", fontSize: "11px", fontWeight: 700, borderRadius: "50px", padding: "1px 7px" },

  /* Grid */
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },

  /* Skeleton */
  skeleton: { height: "340px", borderRadius: "16px", background: "linear-gradient(90deg,#f4f4f4 0%,#ececec 50%,#f4f4f4 100%)" },

  /* Card */
  card:    { background: "#fff", borderRadius: "18px", overflow: "hidden", position: "relative", border: "1px solid #f0f0f0", transition: "transform 0.22s ease, box-shadow 0.22s ease" },
  favBtn:  { position: "absolute", top: "12px", right: "12px", border: "1px solid", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "17px", zIndex: 2, transition: "all 0.15s ease", backdropFilter: "blur(4px)" },
  imgWrap: { overflow: "hidden", background: "#fafafa", cursor: "pointer" },
  img:     { width: "100%", height: "190px", objectFit: "contain", display: "block", padding: "16px", boxSizing: "border-box", transition: "transform 0.3s ease" },
  info:    { padding: "12px 14px 16px" },
  nom:     { fontSize: "14px", fontWeight: 600, color: "#111", marginBottom: "10px", lineHeight: 1.35, cursor: "pointer", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "38px" },
  priceRow:{ display: "flex", alignItems: "center", marginBottom: "12px" },
  prix:    { fontSize: "22px", fontWeight: 800, color: "#111", letterSpacing: "-0.03em" },
  actions: { display: "flex", gap: "8px" },
  addBtn:  { flex: 2, padding: "10px 0", border: "none", borderRadius: "50px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "13px", transition: "background 0.25s ease", letterSpacing: "0.01em" },
  detailBtn:{ flex: 1, padding: "10px 0", background: "transparent", border: "1.5px solid #e8e8e8", borderRadius: "50px", color: "#666", fontWeight: 600, cursor: "pointer", fontSize: "13px" },

  /* Empty search */
  emptySearch: { textAlign: "center", padding: "80px 20px" },
  emptyIcon:   { fontSize: "48px", marginBottom: "12px" },
  emptyTitle:  { fontSize: "22px", fontWeight: 700, marginBottom: "8px", color: "#111" },
  emptySub:    { color: "#aaa", marginBottom: "24px" },
  emptyBtn:    { padding: "10px 28px", background: "#4EA3FF", border: "none", borderRadius: "50px", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" },

  /* Error */
  errorPage: { textAlign: "center", padding: "100px 20px" },
  errorIcon:  { display: "block", fontSize: "52px", marginBottom: "16px" },
  errorMsg:  { fontSize: "20px", fontWeight: 700, color: "#111", marginBottom: "8px" },
  errorSub:  { color: "#aaa", fontSize: "14px" },
};

export default Catalogue;
