/**
 * cartRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes panier — toutes protégées par verifyToken (connexion requise).
 * Montées dans expressApp.js sous /api/cart
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express        = require("express");
const router         = express.Router();
const CartController = require("../controllers/CartController");
const { verifyToken } = require("../middleware/auth");

// Toutes les routes nécessitent un token valide
router.use(verifyToken);

router.get("/",              CartController.getCart.bind(CartController));
router.post("/add",          CartController.addItem.bind(CartController));
router.delete("/remove/:id", CartController.removeItem.bind(CartController));
router.delete("/",           CartController.clearCart.bind(CartController));

module.exports = router;
