/**
 * favorisRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes favoris — toutes protégées par verifyToken (connexion requise).
 * Montées dans expressApp.js sous /api/favoris
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express           = require("express");
const router            = express.Router();
const FavorisController = require("../controllers/FavorisController");
const { verifyToken }   = require("../middleware/auth");

// Toutes les routes nécessitent un token valide
router.use(verifyToken);

router.get("/",              FavorisController.getFavoris.bind(FavorisController));
router.post("/add",          FavorisController.addFavori.bind(FavorisController));
router.delete("/remove/:id", FavorisController.removeFavori.bind(FavorisController));

module.exports = router;
