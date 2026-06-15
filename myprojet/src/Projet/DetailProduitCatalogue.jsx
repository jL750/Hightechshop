import { useContext } from "react";
import { PanierContext } from "./Context/PanierContext";

function DetailProduitCatalogue({ produit, onClose }) {
  const { ajouterAuPanier } = useContext(PanierContext);

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "#fff",
      borderRadius: "16px",
      padding: "30px",
      maxWidth: "500px",
      width: "90%",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      position: "relative",
    },
    close: {
      position: "absolute",
      top: "10px",
      right: "15px",
      fontSize: "20px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    image: {
      width: "100%",
      height: "250px",
      objectFit: "contain",
      borderRadius: "10px",
      marginBottom: "15px",
    },
    name: { fontSize: "22px", fontWeight: "600", marginBottom: "10px" },
    description: { fontSize: "16px", marginBottom: "15px", color: "#555" },
    price: { fontSize: "18px", fontWeight: "500", marginBottom: "20px" },
    button: {
      padding: "12px 20px",
      backgroundColor: "#4EA3FF",
      border: "none",
      borderRadius: "25px",
      color: "#fff",
      fontWeight: 500,
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <span style={styles.close} onClick={onClose}>×</span>
        <img src={produit.image} alt={produit.nom} style={styles.image} />
        <div style={styles.name}>{produit.nom}</div>
        <div style={styles.description}>{produit.description}</div>
        <div style={styles.price}>{produit.prix} €</div>
        <button
          style={styles.button}
          onClick={() => {
            ajouterAuPanier(produit);
            onClose();
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#3793f5")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#4EA3FF")}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default DetailProduitCatalogue;
