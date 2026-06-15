/**
 * validateInput.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Middleware de validation des entrées utilisateur côté serveur.
 *
 * Valide uniquement les champs présents dans req.body — peut être utilisé
 * pour l'inscription, la connexion et la mise à jour de profil sans adaptation.
 *
 * Règles appliquées :
 *   nom/prenom  → lettres, espaces, tirets, 1-50 caractères
 *   email       → format standard (regex RFC-like)
 *   password    → minimum 8 caractères
 *   Tous champs → détection de patterns XSS (<script>, javascript:, onerror=…)
 *
 * Retourne 400 au premier champ invalide trouvé.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX  = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]{1,50}$/;
const XSS_PATTERN = /<[^>]*>|javascript\s*:|on\w+\s*=/i;

// Détecte les tentatives d'injection HTML/script dans une chaîne
function containsXss(value) {
  return typeof value === "string" && XSS_PATTERN.test(value);
}

function validateInput(req, res, next) {
  const { nom, prenom, email, password } = req.body;

  // ── Vérification XSS sur tous les champs string du body ──────────────────
  for (const [key, value] of Object.entries(req.body)) {
    if (containsXss(value)) {
      return res.status(400).json({
        message: `Caractères non autorisés détectés dans le champ "${key}".`,
      });
    }
  }

  // ── Validation nom ────────────────────────────────────────────────────────
  if (nom !== undefined) {
    if (!nom || !nom.trim())
      return res.status(400).json({ message: "Le nom est requis." });
    if (!NAME_REGEX.test(nom))
      return res.status(400).json({ message: "Le nom contient des caractères invalides." });
  }

  // ── Validation prénom ─────────────────────────────────────────────────────
  if (prenom !== undefined) {
    if (!prenom || !prenom.trim())
      return res.status(400).json({ message: "Le prénom est requis." });
    if (!NAME_REGEX.test(prenom))
      return res.status(400).json({ message: "Le prénom contient des caractères invalides." });
  }

  // ── Validation email ──────────────────────────────────────────────────────
  if (email !== undefined) {
    if (!email || !email.trim())
      return res.status(400).json({ message: "L'email est requis." });
    if (!EMAIL_REGEX.test(email))
      return res.status(400).json({ message: "Adresse e-mail invalide." });
  }

  // ── Validation mot de passe ───────────────────────────────────────────────
  if (password !== undefined) {
    if (!password)
      return res.status(400).json({ message: "Le mot de passe est requis." });
    if (password.length < 8)
      return res.status(400).json({ message: "Le mot de passe doit contenir au minimum 8 caractères." });
  }

  next();
}

module.exports = validateInput;
