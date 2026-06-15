/**
 * commandeRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes commandes côté client.
 * Toutes les routes nécessitent un Access Token valide (verifyToken).
 *
 * POST /api/commandes               — passer une nouvelle commande
 * GET  /api/commandes/mes-commandes — historique du client connecté
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express         = require("express");
const router          = express.Router();
const { verifyToken } = require("../middleware/auth");
const Commande        = require("../models/Commande");

// ── POST /api/commandes — créer une commande ──────────────────────────────────
router.post("/", verifyToken, async (req, res) => {
  try {
    const { paiement, adresse, lignes } = req.body;

    if (!lignes || lignes.length === 0) {
      return res.status(400).json({ message: "Le panier est vide." });
    }

    // Calcul de la quantité totale (somme des quantités de chaque ligne)
    const quantiteTotal = lignes.reduce((acc, l) => acc + (l.quantite || 1), 0);

    const commande = await Commande.create({
      id_user:      req.user.idUser,
      Quantite:     quantiteTotal,
      statut:       "en_attente",
      dateCommande: new Date(),
      // idPaiement et idAdresse peuvent être ajoutés si la BDD Adresse/modePaiement est utilisée
    });

    res.status(201).json({ message: "Commande passée avec succès.", commande });
  } catch (err) {
    console.error("[Commande] POST :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ── GET /api/commandes/mes-commandes — historique du client connecté ──────────
router.get("/mes-commandes", verifyToken, async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      where: { id_user: req.user.idUser },   // filtre sur l'utilisateur connecté
      order: [["dateCommande", "DESC"]],     // plus récentes en premier
    });
    res.json(commandes);
  } catch (err) {
    console.error("[Commande] GET mes-commandes :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
