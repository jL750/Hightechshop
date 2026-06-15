/**
 * adminLogger.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Middleware de journalisation des actions admin.
 *
 * Enregistre chaque action dans :
 *   - La console (logs serveur)
 *   - MongoDB collection "logadmins" (historique persistant)
 *
 * Utilisation : appliqué globalement dans adminRoutes.js via router.use()
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { LogAdmin } = require("../models/mongo");

const adminLogger = (req, res, next) => {
  const user      = req.user;
  const method    = req.method;
  const route     = req.originalUrl;
  const timestamp = new Date().toISOString();

  // Log console
  console.log(`[ADMIN LOG] ${timestamp} | User #${user?.idUser} | ${method} ${route}`);

  // Hook post-réponse : on enregistre dans MongoDB après que la réponse est envoyée
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    // Sauvegarde asynchrone dans MongoDB (non bloquant)
    LogAdmin.create({
      utilisateur_id: user?.idUser,
      action:         `${method} ${route}`,
      details: {
        statusCode: res.statusCode,
        body:       req.body || {},
        params:     req.params || {},
      },
      date: new Date(),
    }).catch(err => console.error("[AdminLogger] Erreur MongoDB :", err.message));

    return originalJson(body);
  };

  next();
};

module.exports = adminLogger;
