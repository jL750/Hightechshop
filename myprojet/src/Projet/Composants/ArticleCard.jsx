import React, { useContext } from "react";
import { PanierContext }  from "../Context/PanierContext";
import { FavorisContext } from "../Context/FavorisContext";

function ArticleCard({ produit }) {
  const { ajouterAuPanier }               = useContext(PanierContext);
  const { addFavori, removeFavori, isFavori } = useContext(FavorisContext);

  const favori = isFavori(produit.idProduit);

  const toggleFavori = () => {
    if (favori) removeFavori(produit.idProduit);
    else        addFavori(produit.idProduit);  // envoie l'id → API MongoDB
  };

  const styles = {
    card:   { background: "#ffffff", border: "1.5px solid #000", borderRadius: "16px", padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center", position: "relative" },
    image:  { width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px", marginBottom: "10px" },
    name:   { fontSize: "16px", fontWeight: "600", marginBottom: "5px" },
    price:  { fontSize: "15px", marginBottom: "10px" },
    button: { padding: "10px", width: "100%", backgroundColor: "#4EA3FF", border: "none", borderRadius: "25px", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
    favBtn: { position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.12)", transition: "transform 0.15s ease" },
  };

  return (
    <div style={styles.card}>
      <button
        style={styles.favBtn}
        onClick={toggleFavori}
        title={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {favori ? "❤️" : "🤍"}
      </button>

      <img src={produit.image} alt={produit.nom} style={styles.image} />
      <div style={styles.name}>{produit.nom}</div>
      <div style={styles.price}>{produit.prix} €</div>

      <button
        style={styles.button}
        onClick={() => ajouterAuPanier(produit, 1)}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#3793f5")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#4EA3FF")}
      >
        Ajouter au panier
      </button>
    </div>
  );
}

export default ArticleCard;
