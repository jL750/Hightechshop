/**
 * authRoutes.js
 * POST /api/auth/register  — inscription (validation des inputs)
 * POST /api/auth/login     — connexion
 * POST /api/auth/refresh   — renouvellement de l'access token
 * POST /api/auth/logout    — déconnexion
 * GET  /api/auth/me        — profil de l'utilisateur connecté
 * PUT  /api/auth/me        — modifier son profil (nom, prenom, email)
 */

const express         = require("express");
const router          = express.Router();
const authController  = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");
const validateInput   = require("../middleware/validateInput");

router.post("/register", validateInput, authController.register);
router.post("/login",    authController.login);
router.post("/refresh",  authController.refresh);
router.post("/logout",   authController.logout);

// Profil — lecture et modification
router.get("/me",  verifyToken, authController.me);
router.put("/me",  verifyToken, validateInput, authController.updateMe);

module.exports = router;
