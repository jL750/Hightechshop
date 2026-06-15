const User          = require('../models/User');
const RefreshToken  = require('../models/RefreshToken');
const LoginAttempts = require('../models/LoginAttempts');
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const { Op }        = require('sequelize');

const JWT_SECRET         = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_TOKEN_EXPIRY     = '15m';
const REFRESH_TOKEN_EXPIRY    = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const BCRYPT_ROUNDS    = 10;
const MAX_ATTEMPTS     = 3;
const LOCK_DURATION_MS = 5  * 60 * 1000; // 5 minutes de blocage
const RESET_WINDOW_MS  = 15 * 60 * 1000; // 15 min sans tentative 2192 compteur remis 00e0 z00e9ro

// ── Helpers tokens ────────────────────────────────────
const generateAccessToken = (user) =>
  jwt.sign(
    { idUser: user.idUser, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    { idUser: user.idUser },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

// ── Validation XSS : détecte les tentatives d'injection HTML/script ──────────
// On rejette dès l'arrivée tout champ qui contiendrait des balises HTML,
// avant même que le middleware de sanitisation ne les échappe.
const XSS_PATTERN = /<[^>]*>|javascript\s*:|on\w+\s*=/i;

function containsXss(value) {
  return typeof value === 'string' && XSS_PATTERN.test(value);
}

// ── INSCRIPTION ───────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    if (!nom || !prenom || !email || !password)
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });

    // Rejet explicite des tentatives XSS
    if ([nom, prenom, email].some(containsXss))
      return res.status(400).json({ message: 'Caractères non autorisés détectés.' });

    // Validation : nom et prénom ne doivent contenir que des lettres/espaces/tirets
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]{1,50}$/;
    if (!nameRegex.test(nom))
      return res.status(400).json({ message: 'Le nom contient des caractères invalides.' });
    if (!nameRegex.test(prenom))
      return res.status(400).json({ message: 'Le prénom contient des caractères invalides.' });

    // Validation email basique côté serveur
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Adresse e-mail invalide.' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Le mot de passe doit contenir au minimum 8 caractères.' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email déjà utilisé.' });

    const hashedPw = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const newUser  = await User.create({ nom, prenom, email, pw: hashedPw, role: 'client' });

    console.log('Utilisateur créé :', newUser.idUser, newUser.email);
    res.status(201).json({ message: 'Inscription réussie !' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ── CONNEXION ─────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'inconnue';

    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis.' });

    const user = await User.findOne({ where: { email } });

    // ── Gestion des tentatives ──────────────────────────
    // On récupère ou crée l'entrée LoginAttempts pour cet utilisateur
    // Si l'utilisateur n'existe pas, on rejette sans créer d'entrée
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    let attempt = await LoginAttempts.findOne({ where: { idUser: user.idUser } });

    if (!attempt) {
      // Première tentative : créer l'entrée
      attempt = await LoginAttempts.create({ idUser: user.idUser, AttemptCount: 0 });
    }

    // Vérifier si le compte est bloqué
    if (attempt.LockedUntil && new Date() < new Date(attempt.LockedUntil)) {
      const remainingMs  = new Date(attempt.LockedUntil) - new Date();
      const remainingMin = Math.ceil(remainingMs / 1000 / 60);
      return res.status(429).json({
        message: `Compte temporairement bloqué. Réessayez dans ${remainingMin} minute(s).`,
      });
    }

    // Si le blocage est expiré, on remet à zéro et on recharge l'objet
    if (attempt.LockedUntil && new Date() >= new Date(attempt.LockedUntil)) {
      await attempt.update({ AttemptCount: 0, LockedUntil: null, LastAttemptAt: new Date() });
      await attempt.reload();
    }

    // ── Fenêtre glissante de 15 minutes ────────────────
    // Si la dernière tentative date de plus de 15 min, on remet le compteur à zéro
    // Exemple : 2 tentatives à 10h00, puis une à 10h16 → compteur = 0 avant de compter la nouvelle
    if (attempt.LastAttemptAt && !attempt.LockedUntil) {
      const elapsed = Date.now() - new Date(attempt.LastAttemptAt).getTime();
      if (elapsed > RESET_WINDOW_MS) {
        await attempt.update({ AttemptCount: 0, LastAttemptAt: new Date() });
        await attempt.reload();
      }
    }

    // ── Vérification mot de passe ───────────────────────
    const isMatch = await bcrypt.compare(password, user.pw);

    if (!isMatch) {
      const newCount = attempt.AttemptCount + 1;

      if (newCount >= MAX_ATTEMPTS) {
        // Bloquer le compte pendant 5 minutes
        await attempt.update({
          AttemptCount:  newCount,
          LastAttemptAt: new Date(),
          LockedUntil:   new Date(Date.now() + LOCK_DURATION_MS),
          ip_adresse:    ip,
        });
        return res.status(429).json({
          message: `Trop de tentatives. Compte bloqué pendant 5 minutes.`,
        });
      }

      await attempt.update({
        AttemptCount:  newCount,
        LastAttemptAt: new Date(),
        ip_adresse:    ip,
      });

      const restantes = MAX_ATTEMPTS - newCount;
      return res.status(401).json({
        message: `Email ou mot de passe incorrect. ${restantes} tentative(s) restante(s).`,
      });
    }

    // ── Connexion réussie : remise à zéro des tentatives ──
    await attempt.update({ AttemptCount: 0, LockedUntil: null, LastAttemptAt: new Date() });

    // ── Génération des tokens ───────────────────────────
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Stocker le hash du refresh token en BDD (colonnes du MCD)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);

    await RefreshToken.create({
      idUser:     user.idUser,
      token_hash: hashedRefreshToken,   // hash — jamais le token brut
      ExpireAt:   new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
      RevokedAt:  null,                 // null = actif
    });

    // Refresh token → cookie HttpOnly (invisible au JavaScript)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,                                    // inaccessible via document.cookie
      secure:   process.env.NODE_ENV === 'production',  // HTTPS uniquement en prod
      sameSite: 'strict',                               // protection CSRF
      maxAge:   REFRESH_TOKEN_EXPIRY_MS,                // 3 minutes (même durée que le JWT)
    });

    res.status(200).json({
      message: 'Connexion réussie !',
      accessToken,   // access token dans le body (stocké en mémoire React)
      user: {
        idUser: user.idUser,
        nom:    user.nom,
        prenom: user.prenom,
        email:  user.email,
        role:   user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ── REFRESH TOKEN ─────────────────────────────────────
exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // lu depuis le cookie HttpOnly

    if (!refreshToken)
      return res.status(400).json({ message: 'Refresh token manquant.' });

    // 1. Vérifier la signature JWT
    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: 'Refresh token invalide ou expiré.' });
    }

    // 2. Récupérer les tokens actifs (non révoqués, non expirés) de l'utilisateur
    const userTokens = await RefreshToken.findAll({
      where: {
        idUser:    payload.idUser,
        RevokedAt: { [Op.is]: null },              // pas révoqué
        ExpireAt:  { [Op.gt]: new Date() },        // pas expiré
      },
    });

    // 3. Trouver le token correspondant via bcrypt.compare
    let storedToken = null;
    for (const record of userTokens) {
      const match = await bcrypt.compare(refreshToken, record.token_hash);
      if (match) { storedToken = record; break; }
    }

    if (!storedToken)
      return res.status(401).json({ message: 'Refresh token inconnu ou révoqué.' });

    // 4. Récupérer l'utilisateur
    const user = await User.findByPk(payload.idUser);
    if (!user)
      return res.status(401).json({ message: 'Utilisateur introuvable.' });

    // 5. Rotation : révoquer l'ancien (RevokedAt = maintenant), créer le nouveau
    await storedToken.update({ RevokedAt: new Date() });

    const newAccessToken  = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const hashedNew = await bcrypt.hash(newRefreshToken, BCRYPT_ROUNDS);

    await RefreshToken.create({
      idUser:     user.idUser,
      token_hash: hashedNew,
      ExpireAt:   new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
      RevokedAt:  null,
    });

    // Nouveau refresh token → cookie HttpOnly (rotation)
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   REFRESH_TOKEN_EXPIRY_MS,
    });

    res.status(200).json({
      accessToken: newAccessToken, // uniquement l'access token dans le body
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ── Révocation des refresh tokens ─────────────────────
// Marque tous les tokens actifs d'un utilisateur comme révoqués (RevokedAt)
// sans les supprimer → traçabilité complète en BDD
const revokeRefreshToken = (idUser) =>
  RefreshToken.update(
    { RevokedAt: new Date() },
    {
      where: {
        idUser,
        RevokedAt: { [Op.is]: null }, // uniquement les tokens encore actifs
      },
    }
  );

// ── LOGOUT ────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // lu depuis le cookie HttpOnly

    if (refreshToken) {
      let payload;
      try {
        payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      } catch {
        // Token invalide ou expiré : on efface quand même le cookie
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Déconnexion réussie.' });
      }

      // Révoquer tous les tokens actifs de l'utilisateur en BDD
      await revokeRefreshToken(payload.idUser);
    }

    // Effacer le cookie côté client
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Déconnexion réussie.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
// Retourne le profil complet de l'utilisateur connecté (depuis la BDD, pas juste le token).
// Protégée par verifyToken — req.user.idUser est garanti présent.
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.idUser, {
      attributes: ["idUser", "nom", "prenom", "email", "role", "date_inscription"],
    });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PUT /api/auth/me ───────────────────────────────────────────────────────────
// Met à jour le profil de l'utilisateur connecté (nom, prenom, email).
// Protégée par verifyToken — req.user.idUser est garanti présent.
exports.updateMe = async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;
    const user = await User.findByPk(req.user.idUser);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    await user.update({ nom, prenom, email });
    res.json({ message: "Profil mis à jour.", user: { idUser: user.idUser, nom: user.nom, prenom: user.prenom, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
