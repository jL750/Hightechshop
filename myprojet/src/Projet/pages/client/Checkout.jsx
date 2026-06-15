/**
 * Checkout.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page de finalisation de commande.
 * Protégée par ProtectedRoute (connexion requise).
 *
 * Fonctionnalités :
 *   - Récapitulatif du panier avec total
 *   - Saisie de l'adresse de livraison
 *   - Choix du mode de paiement (visa / paypal)
 *   - Envoi de la commande à POST /api/commandes
 *   - Vidage du panier après succès + redirection vers /historique
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useContext, useState } from "react";
import { PanierContext } from "../../Context/PanierContext.jsx";
import { UserContext }   from "../../Context/UserContext.jsx";
import { useNavigate }   from "react-router-dom";

function Checkout() {
  const { panier, setPanier }   = useContext(PanierContext);
  const { accessToken }         = useContext(UserContext);
  const navigate                = useNavigate();

  const [paiement, setPaiement] = useState("visa");
  const [adresse, setAdresse]   = useState({ numero: "", codepostal: "", ville: "", pays: "France" });
  const [erreur, setErreur]     = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  // Total du panier
  const total = panier.reduce((acc, item) => acc + item.prix * (item.quantite || 1), 0);

  // Mise à jour d'un champ de l'adresse
  const handleChange = (e) =>
    setAdresse((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Soumission de la commande
  const handleSubmit = async () => {
    if (!adresse.numero || !adresse.codepostal || !adresse.ville) {
      setErreur("Veuillez remplir tous les champs de l'adresse.");
      return;
    }
    if (panier.length === 0) {
      setErreur("Votre panier est vide.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          paiement,
          adresse,
          // Lignes de commande : idProduit, quantité, prix unitaire
          lignes: panier.map((p) => ({
            idProduit: p.idProduit,
            quantite:  p.quantite || 1,
            prix:      p.prix,
          })),
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Erreur lors de la commande.");
      }

      setSuccess(true);
      // Vider le panier après confirmation
      setPanier([]);
      localStorage.removeItem("panier");
      // Redirection vers l'historique après 2 secondes
      setTimeout(() => navigate("/historique"), 2000);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    container:    { maxWidth: "680px", margin: "40px auto", padding: "0 20px" },
    title:        { fontSize: "24px", fontWeight: 600, marginBottom: "24px" },
    section:      { background: "#fff", border: "1.5px solid #e5e5e5", borderRadius: "14px", padding: "24px", marginBottom: "16px" },
    sectionTitle: { fontSize: "17px", fontWeight: 600, marginBottom: "16px" },
    input:        { width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e0e0e5", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "10px" },
    total:        { fontSize: "20px", fontWeight: 700, textAlign: "right", marginTop: "12px" },
    btnConfirm:   { width: "100%", padding: "14px", backgroundColor: "#4EA3FF", border: "none", borderRadius: "25px", color: "#fff", fontSize: "16px", fontWeight: 600, cursor: "pointer" },
    success:      { backgroundColor: "#f0fdf4", color: "#166534", padding: "14px", borderRadius: "10px", textAlign: "center", fontWeight: 500 },
    error:        { backgroundColor: "#fff1f0", color: "#c0392b", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "12px" },
  };

  // Message de succès avant redirection
  if (success) {
    return (
      <div style={s.container}>
        <div style={s.success}>
          ✅ Commande passée avec succès ! Redirection vers votre historique…
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h2 style={s.title}>💳 Finaliser la commande</h2>

      {/* Récapitulatif du panier */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Récapitulatif</div>
        {panier.map((item) => (
          <div key={item.idProduit} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "14px" }}>
            <span>{item.nom} × {item.quantite || 1}</span>
            <span>{(item.prix * (item.quantite || 1)).toFixed(2)} €</span>
          </div>
        ))}
        <div style={s.total}>Total : {total.toFixed(2)} €</div>
      </div>

      {/* Adresse de livraison */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Adresse de livraison</div>
        {[
          { name: "numero",     placeholder: "Numéro" },
          { name: "codepostal", placeholder: "Code postal" },
          { name: "ville",      placeholder: "Ville" },
          { name: "pays",       placeholder: "Pays" },
        ].map((f) => (
          <input
            key={f.name}
            name={f.name}
            placeholder={f.placeholder}
            value={adresse[f.name]}
            onChange={handleChange}
            style={s.input}
          />
        ))}
      </div>

      {/* Mode de paiement */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Mode de paiement</div>
        <div style={{ display: "flex", gap: "16px" }}>
          {["visa", "paypal"].map((m) => (
            <label key={m} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "15px" }}>
              <input
                type="radio"
                name="paiement"
                value={m}
                checked={paiement === m}
                onChange={() => setPaiement(m)}
              />
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Erreur */}
      {erreur && <p style={s.error}>{erreur}</p>}

      {/* Bouton de confirmation */}
      <button
        style={s.btnConfirm}
        onClick={handleSubmit}
        disabled={loading}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#3793f5")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#4EA3FF")}
      >
        {loading ? "Traitement…" : "Confirmer la commande"}
      </button>
    </div>
  );
}

export default Checkout;
