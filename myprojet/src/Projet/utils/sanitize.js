/**
 * Utilitaire de protection XSS côté front-end (React / Vite)
 *
 * IMPORTANT : React échappe automatiquement les valeurs rendues via JSX
 * (ex. <p>{userInput}</p>).  Ces fonctions sont à utiliser UNIQUEMENT
 * lorsque vous manipulez le DOM manuellement (dangerouslySetInnerHTML,
 * document.write, innerHTML, window.location.href, etc.).
 *
 * Règle d'or : éviter dangerouslySetInnerHTML.
 * Si c'est incontournable, passer la valeur par sanitizeHtml() d'abord.
 */

/**
 * Échappe les caractères HTML spéciaux dans une chaîne brute.
 * Utiliser avant tout rendu via innerHTML / dangerouslySetInnerHTML.
 *
 * @param {string} str - Valeur utilisateur non fiable.
 * @returns {string}   - Chaîne sûre à injecter dans le HTML.
 */
export function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Vérifie qu'une chaîne ne contient pas de balises HTML ou d'attributs
 * d'événement JavaScript (pattern XSS courants).
 *
 * @param {string} str
 * @returns {boolean} true si une tentative XSS est détectée.
 */
export function containsXss(str) {
  if (typeof str !== 'string') return false;
  const XSS_PATTERN = /<[^>]*>|javascript\s*:|on\w+\s*=/i;
  return XSS_PATTERN.test(str);
}

/**
 * Nettoie une URL avant de l'utiliser dans href / window.location.
 * Bloque les schémas dangereux (javascript:, data:text/html, …).
 *
 * @param {string} url
 * @returns {string} URL sûre, ou '#' si elle est suspecte.
 */
export function sanitizeUrl(url) {
  if (typeof url !== 'string') return '#';
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:text/html') ||
    trimmed.startsWith('vbscript:')
  ) {
    console.warn('[XSS] URL bloquée :', url);
    return '#';
  }
  return url;
}
