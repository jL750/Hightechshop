/**
 * adminRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes d'administration — toutes protégées par :
 *   1. verifyToken  — Access Token JWT valide requis
 *   2. isAdmin      — rôle "admin" requis
 *   3. adminLogger  — journalise chaque action
 *
 * Montées dans expressApp.js sous le préfixe /api/admin
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express                  = require("express");
const router                   = express.Router();
const adminCtrl                = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middleware/auth");
const adminLogger              = require("../middleware/adminLogger");

// Applique les trois middlewares à toutes les routes de ce router
router.use(verifyToken, isAdmin, adminLogger);

// ── Utilisateurs ──────────────────────────────────────────────────────────────
router.get   ("/utilisateurs",          adminCtrl.getUtilisateurs);
router.put   ("/utilisateurs/:id/role", adminCtrl.updateRole);
router.delete("/utilisateurs/:id",      adminCtrl.deleteUtilisateur);

// ── Produits ──────────────────────────────────────────────────────────────────
router.get   ("/produits",     adminCtrl.getProduits);
router.post  ("/produits",     adminCtrl.createProduit);
router.put   ("/produits/:id", adminCtrl.updateProduit);
router.delete("/produits/:id", adminCtrl.deleteProduit);

// ── Commandes ─────────────────────────────────────────────────────────────────
router.get("/commandes",            adminCtrl.getCommandes);
router.put("/commandes/:id/statut", adminCtrl.updateStatutCommande);

// ── Logs de connexion (LoginAttempts) ─────────────────────────────────────────
router.get("/logs", adminCtrl.getLogs);

module.exports = router;
