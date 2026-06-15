import { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PanierContext }  from "./Context/PanierContext";
import { FavorisContext } from "./Context/FavorisContext";
import DetailProduitCatalogue from "./DetailProduitCatalogue";

function Catalogue() {
  const navigate = useNavigate();
  const { panier, ajouterAuPanier }        = useContext(PanierContext);
  const { addFavori, removeFavori, isFavori } = useContext(FavorisContext);

  const [produits, setProduits]           = useState([]);
  const [erreur, setErreur]               = useState("");
  const [recherche, setRecherche]         = useState("");
  const [produitDetail, setProduitDetail] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/produits", { credentials: "include" });
        if (!res.ok) throw new Error("Impossible de charger les produits");
        setProduits(await res.json());
      } catch (err) { setErreur(err.message); }
    };
    charger();
  }, []);

  const produitsFiltres = useMemo(() =>
    produits.filter(p => p.nom.toLowerCase().includes(recherche.toLowerCase())),
    [produits, recherche]
  );

  // Bascule favori via l'API MongoDB
  const toggleFavori = (p) => {
    if (isFavori(p.idProduit)) removeFavori(p.idProduit);
    else                        addFavori(p.idProduit);
  };

  const styles = {
    container:       { maxWidth: "1100px", margin: "40px auto", padding: "0 20px" },
    header:          { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title:           { fontSize: "24px", fontWeight: "600" },
    panierContainer: { display: "flex", alignItems: "center", gap: "15px" },
    panierCompteur:  { fontSize: "18px", fontWeight: "500" },
    boutonPanier:    { padding: "8px 16px", borderRadius: "25px", border: "none", backgroundColor: "#4EA3FF", color: "#fff", cursor: "pointer", fontWeight: 500 },
    search:          { width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #dcdcdc", fontSize: "15px", backgroundColor: "#f5f5f5", outline: "none", marginBottom: "25px" },
    grid:            { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
    card:            { background: "#ffffff", border: "1.5px solid #000", borderRadius: "16px", padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center", position: "relative" },
    image:           { width: "100%", height: "180px", objectFit: "contain", borderRadius: "10px", marginBottom: "10px" },
    name:            { fontSize: "16px", fontWeight: "600", marginBottom: "5px" },
    price:           { fontSize: "15px", marginBottom: "10px" },
    button:          { padding: "10px", width: "100%", backgroundColor: "#4EA3FF", border: "none", borderRadius: "25px", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
    detailButton:    { marginTop: "10px", padding: "10px", width: "100%", backgroundColor: "#bfd832ff", border: "none", borderRadius: "20px", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
    favBtn:          { position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", transition: "transform 0.15s ease" },
    error:           { color: "red", textAlign: "center", marginTop: "40px" },
  };

  if (erreur) return <p style={styles.error}>Erreur : {erreur}</p>;

  return (
    <div style={styles.container}>
      <input type="text" placeholder="Rechercher un produit..." value={recherche}
        onChange={(e) => setRecherche(e.target.value)} style={styles.search}
        onFocus={(e) => (e.target.style.borderColor = "#4EA3FF")}
        onBlur={(e)  => (e.target.style.borderColor = "#dcdcdc")} />

      <div style={styles.header}>
        <h2 style={styles.title}>Catalogue</h2>
        <div style={styles.panierContainer}>
          <span style={styles.panierCompteur}>
            🛒 {panier?.reduce((total, item) => total + (item.quantite || 1), 0) || 0}
          </span>
          <button style={styles.boutonPanier} onClick={() => navigate("/panier")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#3793f5")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4EA3FF")}>
            Voir le panier
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {produitsFiltres.map((p) => (
          <div key={p.idProduit || p._id} style={styles.card}>
            {/* Bouton favori — appelle l'API MongoDB */}
            <button
              style={styles.favBtn}
              onClick={() => toggleFavori(p)}
              title={isFavori(p.idProduit) ? "Retirer des favoris" : "Ajouter aux favoris"}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {isFavori(p.idProduit) ? "❤️" : "🤍"}
            </button>

            <img src={p.image} alt={p.nom} style={styles.image} />
            <div style={styles.name}>{p.nom}</div>
            <div style={styles.price}>{p.prix} €</div>

            <button style={styles.button} onClick={() => ajouterAuPanier(p, 1)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#3793f5")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4EA3FF")}>
              Ajouter au panier
            </button>
            <button style={styles.detailButton} onClick={() => setProduitDetail(p)}>
              Voir le détail
            </button>
          </div>
        ))}
      </div>

      {produitDetail && (
        <DetailProduitCatalogue produit={produitDetail} onClose={() => setProduitDetail(null)} />
      )}
    </div>
  );
}

export default Catalogue;
