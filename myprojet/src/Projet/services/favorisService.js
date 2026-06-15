/**
 * favorisService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Service d'accès à l'API favoris (MongoDB via le back-end).
 * Toutes les requêtes nécessitent un Access Token.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const API = "http://localhost:3000/api";

const headers = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const favorisService = {
  // Récupère les favoris de l'utilisateur connecté
  async getFavoris(token) {
    const res = await fetch(`${API}/favoris`, {
      headers: headers(token),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur chargement favoris");
    return res.json();
  },

  // Ajoute un produit aux favoris
  async addFavori(token, idProduit) {
    const res = await fetch(`${API}/favoris/add`, {
      method: "POST",
      headers: headers(token),
      credentials: "include",
      body: JSON.stringify({ idProduit }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur ajout favori");
    return data;
  },

  // Retire un produit des favoris
  async removeFavori(token, idProduit) {
    const res = await fetch(`${API}/favoris/remove/${idProduit}`, {
      method: "DELETE",
      headers: headers(token),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur suppression favori");
    return res.json();
  },
};
