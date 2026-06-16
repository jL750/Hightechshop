/**
 * FavorisController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Gestion des favoris utilisateur — stockés dans MongoDB (collection "favoris").
 *
 * Chaque utilisateur a un seul document dans la collection,
 * identifié par son idUser MySQL.
 * Le document est créé automatiquement au premier ajout.
 *
 * Routes :
 *   GET    /api/favoris          — récupérer ses favoris
 *   POST   /api/favoris/add      — ajouter un produit { idProduit }
 *   DELETE /api/favoris/remove/:id — retirer un produit
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { Favoris } = require("../models/mongo");
const Produit     = require("../models/Produit");

class FavorisController {

  // GET /api/favoris — retourne les favoris enrichis avec les données MySQL
  async getFavoris(req, res) {
    try {
      let fav = await Favoris.findOne({ utilisateur_id: req.user.idUser });
      if (!fav) return res.json({ utilisateur_id: req.user.idUser, produits: [] });

      // Récupérer les données complètes depuis MySQL pour chaque produit favori
      const ids      = fav.produits.map(p => p.idProduit);
      const produits = await Produit.findAll({ where: { idProduit: ids } });
      const map      = Object.fromEntries(produits.map(p => [p.idProduit, p]));

      const enrichis = fav.produits.map(p => ({
        ...p.toObject(),
        description: map[p.idProduit]?.description || p.description || null,
        image:       map[p.idProduit]?.image       || p.image       || null,
        prix:        map[p.idProduit]?.prix        || p.prix,
        nom:         map[p.idProduit]?.nom         || p.nom,
      }));

      res.json({ ...fav.toObject(), produits: enrichis });
    } catch (err) {
      console.error("[Favoris] getFavoris :", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // POST /api/favoris/add — ajouter un produit aux favoris
  async addFavori(req, res) {
    try {
      const { idProduit } = req.body;
      if (!idProduit) return res.status(400).json({ message: "idProduit requis." });

      // Vérifier que le produit existe dans MySQL
      const produit = await Produit.findByPk(idProduit);
      if (!produit) return res.status(404).json({ message: "Produit introuvable." });

      let fav = await Favoris.findOne({ utilisateur_id: req.user.idUser });

      if (!fav) {
        // Créer le document favoris pour cet utilisateur (première fois)
        fav = new Favoris({
          utilisateur_id: req.user.idUser,
          produits: [{
            idProduit:   produit.idProduit,
            nom:         produit.nom,
            prix:        parseFloat(produit.prix),
            image:       produit.image       || null,
            description: produit.description || null,
          }],
        });
      } else {
        // Vérifier que le produit n'est pas déjà dans les favoris
        const existe = fav.produits.some(p => p.idProduit === idProduit);
        if (existe) return res.status(409).json({ message: "Déjà dans les favoris." });

        fav.produits.push({
          idProduit:   produit.idProduit,
          nom:         produit.nom,
          prix:        parseFloat(produit.prix),
          image:       produit.image       || null,
          description: produit.description || null,
        });
        fav.date_modification = new Date();
        fav.markModified("produits");
      }

      await fav.save();
      res.json(fav);
    } catch (err) {
      console.error("[Favoris] addFavori :", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // DELETE /api/favoris/remove/:id — retirer un produit des favoris
  async removeFavori(req, res) {
    try {
      const idProduit = parseInt(req.params.id);
      const fav = await Favoris.findOne({ utilisateur_id: req.user.idUser });

      // Si aucun favori, retourner un objet vide (idempotent)
      if (!fav) return res.json({ utilisateur_id: req.user.idUser, produits: [] });

      fav.produits = fav.produits.filter(p => p.idProduit !== idProduit);
      fav.date_modification = new Date();
      fav.markModified("produits");
      await fav.save();
      res.json(fav);
    } catch (err) {
      console.error("[Favoris] removeFavori :", err.message);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new FavorisController();
