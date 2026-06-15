/**
 * GestionProduits.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page d'administration des produits.
 * Accessible uniquement aux administrateurs (AdminRoute).
 *
 * Fonctionnalités :
 *   - Liste tous les produits avec image miniature
 *   - Formulaire d'ajout d'un nouveau produit
 *   - Modification d'un produit existant (pré-remplissage du formulaire)
 *   - Suppression d'un produit
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext.jsx";

// Valeurs vides par défaut pour le formulaire
const FORM_VIDE = { nom: "", prix: "", quantite: "", description: "", image: "", idCategorie: "" };

// Champs du formulaire
const CHAMPS_FORM = [
  { name: "nom",         placeholder: "Nom du produit" },
  { name: "prix",        placeholder: "Prix (€)" },
  { name: "quantite",    placeholder: "Quantité en stock" },
  { name: "idCategorie", placeholder: "ID Catégorie" },
  { name: "description", placeholder: "Description" },
  { name: "image",       placeholder: "URL de l'image" },
];

function GestionProduits() {
  const { accessToken } = useContext(UserContext);
  const [produits, setProduits] = useState([]);
  const [form, setForm]         = useState(FORM_VIDE);
  const [editId, setEditId]     = useState(null);  // null = mode création, sinon mode édition
  const [erreur, setErreur]     = useState("");

  const headers = {
    Authorization:  `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  // Charge la liste des produits
  const charger = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/produits", { credentials: "include", headers });
      setProduits(await res.json());
    } catch (e) {
      setErreur(e.message);
    }
  };

  useEffect(() => { if (accessToken) charger(); }, [accessToken]);

  // Mise à jour d'un champ du formulaire
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Soumission : création ou modification selon editId
  const handleSubmit = async () => {
    const method = editId ? "PUT" : "POST";
    const url    = editId
      ? `http://localhost:3000/api/admin/produits/${editId}`
      : "http://localhost:3000/api/admin/produits";

    const res = await fetch(url, { method, credentials: "include", headers, body: JSON.stringify(form) });
    if (!res.ok) {
      const d = await res.json();
      setErreur(d.message);
      return;
    }
    // Réinitialisation du formulaire après succès
    setForm(FORM_VIDE);
    setEditId(null);
    charger();
  };

  // Pré-remplit le formulaire avec les données du produit à modifier
  const editer = (p) => {
    setEditId(p.idProduit);
    setForm({
      nom:         p.nom,
      prix:        p.prix,
      quantite:    p.quantite,
      description: p.description || "",
      image:       p.image       || "",
      idCategorie: p.idCategorie,
    });
  };

  // Supprime un produit après confirmation
  const supprimer = async (id) => {
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    await fetch(`http://localhost:3000/api/admin/produits/${id}`, {
      method: "DELETE", credentials: "include", headers,
    });
    charger();
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    container:  { maxWidth: "1000px", margin: "40px auto", padding: "0 20px" },
    title:      { fontSize: "24px", fontWeight: 600, marginBottom: "20px" },
    formBox:    { background: "#fff", border: "1.5px solid #e5e5e5", borderRadius: "14px", padding: "20px", marginBottom: "24px" },
    formTitle:  { fontWeight: 600, fontSize: "16px", marginBottom: "14px" },
    grid:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    input:      { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
    btnSave:    { marginTop: "14px", padding: "10px 24px", backgroundColor: "#4EA3FF", border: "none", borderRadius: "20px", color: "#fff", cursor: "pointer", fontWeight: 500 },
    btnCancel:  { marginTop: "14px", marginLeft: "10px", padding: "10px 20px", backgroundColor: "#888", border: "none", borderRadius: "20px", color: "#fff", cursor: "pointer" },
    table:      { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    th:         { textAlign: "left", padding: "12px 14px", background: "#f5f5f7", fontSize: "12px", color: "#888", fontWeight: 600 },
    td:         { padding: "10px 14px", borderTop: "1px solid #f0f0f0", fontSize: "13px" },
    img:        { width: "48px", height: "48px", objectFit: "contain", borderRadius: "6px" },
    btnEdit:    { padding: "5px 10px", backgroundColor: "#f59e0b", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "12px", marginRight: "6px" },
    btnDel:     { padding: "5px 10px", backgroundColor: "#ff4e4e", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "12px" },
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>📦 Gestion des produits</h2>
      {erreur && <p style={{ color: "red", marginBottom: "12px" }}>{erreur}</p>}

      {/* Formulaire ajout / modification */}
      <div style={s.formBox}>
        <div style={s.formTitle}>
          {editId ? "✏️ Modifier le produit" : "➕ Ajouter un produit"}
        </div>
        <div style={s.grid}>
          {CHAMPS_FORM.map((c) => (
            <input
              key={c.name}
              name={c.name}
              placeholder={c.placeholder}
              value={form[c.name]}
              onChange={handleChange}
              style={s.input}
            />
          ))}
        </div>
        <button style={s.btnSave} onClick={handleSubmit}>
          {editId ? "Enregistrer" : "Ajouter"}
        </button>
        {/* Bouton annuler visible uniquement en mode édition */}
        {editId && (
          <button style={s.btnCancel} onClick={() => { setForm(FORM_VIDE); setEditId(null); }}>
            Annuler
          </button>
        )}
      </div>

      {/* Tableau des produits */}
      <table style={s.table}>
        <thead>
          <tr>
            {["Image", "Nom", "Prix", "Stock", "Catégorie", "Actions"].map((h) => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {produits.map((p) => (
            <tr key={p.idProduit}>
              <td style={s.td}><img src={p.image} alt={p.nom} style={s.img} /></td>
              <td style={s.td}>{p.nom}</td>
              <td style={s.td}>{p.prix} €</td>
              <td style={s.td}>{p.quantite}</td>
              <td style={s.td}>{p.idCategorie}</td>
              <td style={s.td}>
                <button style={s.btnEdit} onClick={() => editer(p)}>Modifier</button>
                <button style={s.btnDel}  onClick={() => supprimer(p.idProduit)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionProduits;
