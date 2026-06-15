import React, { useContext, useState } from "react";
import { useNavigate }    from "react-router-dom";
import { PanierContext }  from "./Context/PanierContext";
import { UserContext }    from "./Context/UserContext";
import DetailProduitPanier from "./DetailProduitPanier";

function Panier() {
  const { items, supprimerArticle, modifierQuantite } = useContext(PanierContext);
  const { user }                                      = useContext(UserContext);
  const navigate                                      = useNavigate();
  const [produitDetail, setProduitDetail]             = useState(null);

  // items peut être undefined au chargement → on sécurise avec []
  const panier = items || [];

  const augmenter = (idProduit, quantite) => modifierQuantite(idProduit, quantite + 1);
  const diminuer  = (idProduit, quantite) => modifierQuantite(idProduit, Math.max(1, quantite - 1));

  const total = panier.reduce((acc, item) => acc + item.prix * (item.quantite || 1), 0);

  const handleCommander = () => {
    if (!user) navigate("/connexion");
    else       navigate("/commande");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "20px" }}>🛒 Mon Panier</h2>
      <p style={{ fontSize: "20px", fontWeight: 500, marginBottom: "20px" }}>
        Total : {total.toFixed(2)} €
      </p>

      {panier.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          {panier.map((item) => (
            // idProduit remplace _id (MongoDB stocke idProduit, plus _id Mongoose)
            <div key={item.idProduit} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "15px", marginBottom: "15px", display: "flex", alignItems: "center", background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <img src={item.image} alt={item.nom} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", marginRight: "15px" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "16px", fontWeight: 500, marginBottom: "10px" }}>
                  {item.nom} — {item.prix} €
                </div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                  <button onClick={() => diminuer(item.idProduit, item.quantite)} style={{ padding: "5px 12px", backgroundColor: "#4EA3FF", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: 600 }}>−</button>
                  <span style={{ margin: "0 10px" }}>{item.quantite || 1}</span>
                  <button onClick={() => augmenter(item.idProduit, item.quantite)} style={{ padding: "5px 12px", backgroundColor: "#4EA3FF", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: 600 }}>+</button>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={{ padding: "5px 10px", backgroundColor: "#00bcd4", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={() => setProduitDetail(item)}>Détail</button>
                  <button style={{ padding: "5px 10px", backgroundColor: "#ff4e4e", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={() => supprimerArticle(item.idProduit)}>Supprimer</button>
                </div>
              </div>
            </div>
          ))}

          {/* Bouton commander */}
          <div style={{ textAlign: "right", marginTop: "24px" }}>
            <button
              onClick={handleCommander}
              style={{ padding: "14px 36px", backgroundColor: "#4EA3FF", color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#3793f5")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4EA3FF")}
            >
              Commander →
            </button>
          </div>
        </>
      )}

      {produitDetail && (
        <DetailProduitPanier produit={produitDetail} onClose={() => setProduitDetail(null)} />
      )}
    </div>
  );
}

export default Panier;
