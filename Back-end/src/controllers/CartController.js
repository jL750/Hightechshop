/**
 * CartController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Gestion du panier utilisateur — stocké dans MongoDB (collection "paniers").
 *
 * Le panier est lié à l'idUser MySQL et expire automatiquement après 7 jours
 * grâce à l'index TTL de Mongoose (expire_le).
 *
 * Quand l'utilisateur se connecte, son panier est rechargé depuis MongoDB.
 *
 * Routes :
 *   GET    /api/cart             — récupérer son panier
 *   POST   /api/cart/add        — ajouter/modifier { idProduit, quantite }
 *   DELETE /api/cart/remove/:id — retirer un produit
 *   DELETE /api/cart            — vider le panier
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { Panier } = require("../models/mongo");
const Produit    = require("../models/Produit");

const TTL_JOURS = 7;

// Calcule la date d'expiration du panier (maintenant + 7 jours)
function dateExpiration() {
  return new Date(Date.now() + TTL_JOURS * 24 * 60 * 60 * 1000);
}

class CartController {

  // GET /api/cart — retourne le panier de l'utilisateur connecté
  async getCart(req, res) {
    try {
      let panier = await Panier.findOne({ utilisateur_id: req.user.idUser });
      // Si aucun panier, retourner un objet vide (pas d'erreur 404)
      if (!panier) panier = { utilisateur_id: req.user.idUser, produits: [] };
      res.json(panier);
    } catch (err) {
      console.error("[Cart] getCart :", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // POST /api/cart/add — ajouter un produit ou modifier sa quantité
  async addItem(req, res) {
    try {
      const { idProduit, quantite = 1 } = req.body;
      if (!idProduit) return res.status(400).json({ message: "idProduit requis." });

      const qty = parseInt(quantite);

      // Vérifie que le produit existe en BDD MySQL
      const produit = await Produit.findByPk(idProduit);
      if (!produit) return res.status(404).json({ message: "Produit introuvable." });

      let panier = await Panier.findOne({ utilisateur_id: req.user.idUser });

      if (!panier) {
        // Créer un nouveau panier pour cet utilisateur
        if (qty <= 0) return res.status(400).json({ message: "Quantité invalide." });
        panier = new Panier({
          utilisateur_id: req.user.idUser,
          expire_le: dateExpiration(),
          produits: [{
            idProduit: produit.idProduit,
            nom:       produit.nom,
            prix:      parseFloat(produit.prix),
            image:     produit.image || null,
            quantite:  qty,
          }],
        });
      } else {
        const idx = panier.produits.findIndex(p => p.idProduit === idProduit);

        if (idx >= 0) {
          // Produit déjà dans le panier → mettre à jour la quantité
          const newQty = panier.produits[idx].quantite + qty;
          if (newQty <= 0) {
            // Quantité à 0 ou moins → supprimer le produit
            panier.produits.splice(idx, 1);
          } else {
            // Limiter au stock disponible
            panier.produits[idx].quantite = Math.min(newQty, produit.quantite);
          }
        } else {
          // Nouveau produit dans le panier existant
          if (qty <= 0) return res.status(400).json({ message: "Quantité invalide." });
          panier.produits.push({
            idProduit: produit.idProduit,
            nom:       produit.nom,
            prix:      parseFloat(produit.prix),
            image:     produit.image || null,
            quantite:  Math.min(qty, produit.quantite),
          });
        }

        // Renouveler le TTL à chaque modification
        panier.expire_le = dateExpiration();
        panier.markModified("produits");
      }

      await panier.save();
      res.json(panier);
    } catch (err) {
      console.error("[Cart] addItem :", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // DELETE /api/cart/remove/:id — retirer un produit du panier
  async removeItem(req, res) {
    try {
      const idProduit = parseInt(req.params.id);
      const panier = await Panier.findOne({ utilisateur_id: req.user.idUser });
      if (!panier) return res.json({ utilisateur_id: req.user.idUser, produits: [] });

      panier.produits = panier.produits.filter(p => p.idProduit !== idProduit);
      panier.markModified("produits");
      await panier.save();
      res.json(panier);
    } catch (err) {
      console.error("[Cart] removeItem :", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // DELETE /api/cart — vider complètement le panier
  async clearCart(req, res) {
    try {
      await Panier.deleteOne({ utilisateur_id: req.user.idUser });
      res.json({ message: "Panier vidé." });
    } catch (err) {
      console.error("[Cart] clearCart :", err.message);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new CartController();
