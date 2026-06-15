import React, { useContext } from "react";
import { PanierContext } from "./Context/PanierContext";

function DetailProduitPanier({ produit, onClose }) {
  const { supprimerArticle } = useContext(PanierContext);

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      overflowY: "auto",
      padding: "20px",
    },
    modal: {
      background: "#fff",
      padding: "30px",
      borderRadius: "12px",
      maxWidth: "500px",
      width: "100%",
      textAlign: "center",
      position: "relative",
    },
    image: {
      width: "100%",
      height: "auto",
      maxHeight: "300px",
      objectFit: "contain",
      borderRadius: "10px",
      marginBottom: "20px",
    },
    nom: { fontSize: "22px", fontWeight: 600, marginBottom: "10px" },
    desc: { fontSize: "16px", marginBottom: "10px" },
    prix: { fontSize: "18px", fontWeight: 500, marginBottom: "15px" },
    button: {
      padding: "10px 20px",
      margin: "10px 0",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 600,
      color: "#fff",
      backgroundColor: "#ff4e4e",
    },
    close: { position: "absolute", top: "10px", right: "15px", cursor: "pointer", fontSize: "20px", fontWeight: 700 },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span style={styles.close} onClick={onClose}>×</span>
        <img src={produit.image} alt={produit.nom} style={styles.image} />
        <div style={styles.nom}>{produit.nom}</div>
        <div style={styles.desc}>{produit.description || "Pas de description disponible."}</div>
        <div style={styles.prix}>Prix : {produit.prix} €</div>

        <button
          style={styles.button}
          onClick={() => { supprimerArticle(produit._id); onClose(); }}
        >
          Supprimer du panier
        </button>
      </div>
    </div>
  );
}

export default DetailProduitPanier;
