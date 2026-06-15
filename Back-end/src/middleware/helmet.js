/**
 * helmet.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Applique les headers HTTP de sécurité via le package `helmet`.
 *
 * Remplace les headers manuels définis dans expressApp.js :
 *   X-XSS-Protection, X-Content-Type-Options, Content-Security-Policy,
 *   X-Frame-Options
 *
 * Installation : npm install helmet
 * ─────────────────────────────────────────────────────────────────────────────
 */

const helmet = require("helmet");

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],                              // aucun script inline ni CDN non listé
      styleSrc:    ["'self'", "'unsafe-inline'"],           // inline styles nécessaires pour React
      imgSrc:      ["'self'", "data:", "https:"],           // images produits depuis URL externes
      connectSrc:  ["'self'"],
      fontSrc:     ["'self'", "https://fonts.gstatic.com"],
      objectSrc:   ["'none'"],
      frameSrc:    ["'none'"],
      frameAncestors: ["'none'"],                           // anti-clickjacking (remplace X-Frame-Options)
      formAction:  ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,  // nécessaire pour certains assets externes (images produits)
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

module.exports = helmetMiddleware;
