/**
 * auth.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Middlewares de vérification JWT et de contrôle de rôle.
 *
 * Exports :
 *   verifyToken  — vérifie l'Access Token Bearer + existence du user en BDD
 *   isAdmin      — vérifie que le user connecté a le rôle "admin"
 *
 * Utilisation dans une route :
 *   router.get("/admin", verifyToken, isAdmin, adminCtrl.dashboard);
 * ─────────────────────────────────────────────────────────────────────────────
 */

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ── Vérifier l'Access Token JWT ───────────────────────────────────────────────
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Le token doit être au format "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token d'accès manquant." });
  }

  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Distingue token expiré (→ le front peut tenter un refresh) vs token invalide
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré.", code: "TOKEN_EXPIRED" });
    }
    return res.status(403).json({ message: "Token invalide." });
  }

  // ── Vérification que l'utilisateur existe toujours en BDD ────────────────
  // Cas concret : compte supprimé par un admin → son access token (1 min)
  // serait encore valide cryptographiquement sans cette vérification.
  if (decoded?.idUser) {
    try {
      const user = await User.findByPk(decoded.idUser, {
        attributes: ["idUser", "role"],
      });

      if (!user) {
        // Compte supprimé → on rejette le token même s'il est cryptographiquement valide
        return res.status(401).json({
          message: "Compte introuvable ou supprimé.",
          code: "USER_NOT_FOUND",
        });
      }

      // Mettre à jour le rôle depuis la BDD (au cas où il aurait changé depuis l'émission du token)
      decoded.role = user.role;
    } catch (dbErr) {
      console.error("[verifyToken] Erreur vérification BDD :", dbErr.message);
      // fail-open : si la BDD est injoignable, on laisse passer avec le payload du token
      // Passer en fail-close si sécurité maximale requise :
      // return res.status(503).json({ message: "Service temporairement indisponible." });
    }
  }

  req.user = decoded; // disponible dans les contrôleurs via req.user
  next();
};

// ── Vérifier le rôle admin ────────────────────────────────────────────────────
// À placer APRÈS verifyToken dans la chaîne de middlewares
const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Non authentifié." });
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès réservé aux administrateurs." });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
