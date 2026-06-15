/**
 * Middleware de protection XSS
 * Sanitise récursivement tous les champs string du req.body
 * en échappant les caractères HTML dangereux.
 */

/**
 * Échappe les caractères spéciaux HTML dans une chaîne.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Parcourt récursivement un objet/tableau et échappe
 * toutes les valeurs de type string.
 * @param {*} data
 * @returns {*}
 */
function sanitize(data) {
  if (typeof data === 'string') {
    return escapeHtml(data);
  }
  if (Array.isArray(data)) {
    return data.map(sanitize);
  }
  if (data !== null && typeof data === 'object') {
    const result = {};
    for (const key of Object.keys(data)) {
      result[key] = sanitize(data[key]);
    }
    return result;
  }
  return data; // number, boolean, null, undefined → inchangé
}

/**
 * Middleware Express : sanitise req.body avant chaque handler.
 */
function xssMiddleware(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body);
  }
  next();
}

module.exports = xssMiddleware;
