/**
 * cartService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Service d'accès à l'API panier (MongoDB via le back-end).
 * Le panier est sauvegardé par utilisateur et restauré à la connexion.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const API = "http://localhost:3000/api";

const headers = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const cartService = {
  // Récupère le panier de l'utilisateur connecté
  async getCart(token) {
    const res = await fetch(`${API}/cart`, {
      headers: headers(token),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur chargement panier");
    return res.json();
  },

  // Ajoute un produit au panier (ou incrémente la quantité)
  async addItem(token, idProduit, quantite = 1) {
    const res = await fetch(`${API}/cart/add`, {
      method: "POST",
      headers: headers(token),
      credentials: "include",
      body: JSON.stringify({ idProduit, quantite }),
    });
    if (!res.ok) throw new Error("Erreur ajout panier");
    return res.json();
  },

  // Retire un produit du panier
  async removeItem(token, idProduit) {
    const res = await fetch(`${API}/cart/remove/${idProduit}`, {
      method: "DELETE",
      headers: headers(token),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur suppression panier");
    return res.json();
  },

  // Vide le panier
  async clearCart(token) {
    await fetch(`${API}/cart`, {
      method: "DELETE",
      headers: headers(token),
      credentials: "include",
    });
  },
};
