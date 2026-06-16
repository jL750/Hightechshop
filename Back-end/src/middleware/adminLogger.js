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
  // On ne logue que les actions d'écriture (pas les GET ni les logs eux-mêmes)
  if (req.method === "GET") return next();

  const user      = req.user;
  const method    = req.method;
  const route     = req.originalUrl;
  const timestamp = new Date().toISOString();

  console.log(`[ADMIN LOG] ${timestamp} | User #${user?.idUser} | ${method} ${route}`);

  const originalJson = res.json.bind(res);
  res.json = function (body) {
    LogAdmin.create({
      utilisateur_id: user?.idUser,
      action:         `${method} ${route}`,
      details: {
        statusCode: res.statusCode,
        body:       req.body   || {},
        params:     req.params || {},
      },
      date: new Date(),
    }).catch(err => console.error("[AdminLogger] Erreur MongoDB :", err.message));

    return originalJson(body);
  };

  next();
};

module.exports = adminLogger;
