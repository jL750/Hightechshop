/**
 * adminController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Contrôleur des routes d'administration.
 * Toutes les fonctions sont protégées par verifyToken + isAdmin + adminLogger
 * (appliqués globalement dans adminRoutes.js).
 *
 * Sections :
 *   UTILISATEURS  — liste, changement de rôle, suppression
 *   PRODUITS      — liste, création, modification, suppression
 *   COMMANDES     — liste, changement de statut
 *   LOGS          — lecture des tentatives de connexion (LoginAttempts)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const User          = require("../models/User");
const Produit       = require("../models/Produit");
const Commande      = require("../models/Commande");
const LoginAttempts = require("../models/LoginAttempts");

// ── UTILISATEURS ──────────────────────────────────────────────────────────────

// GET /api/admin/utilisateurs
exports.getUtilisateurs = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["idUser", "nom", "prenom", "email", "role", "date_inscription"],
    });
    res.json(users);
  } catch (err) {
    console.error("[Admin] getUtilisateurs :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// PUT /api/admin/utilisateurs/:id/role
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["client", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide. Valeurs acceptées : client, admin." });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
    // Empêche un admin de se rétrograder lui-même (évite le lock-out)
    if (user.idUser === req.user.idUser) {
      return res.status(403).json({ message: "Vous ne pouvez pas modifier votre propre rôle." });
    }
    await user.update({ role });
    res.json({ message: "Rôle mis à jour.", user: { idUser: user.idUser, role: user.role } });
  } catch (err) {
    console.error("[Admin] updateRole :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// DELETE /api/admin/utilisateurs/:id
exports.deleteUtilisateur = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
    // Empêche un admin de supprimer son propre compte
    if (user.idUser === req.user.idUser) {
      return res.status(403).json({ message: "Vous ne pouvez pas supprimer votre propre compte." });
    }
    await user.destroy();
    res.json({ message: "Utilisateur supprimé." });
  } catch (err) {
    console.error("[Admin] deleteUtilisateur :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PRODUITS ──────────────────────────────────────────────────────────────────

// GET /api/admin/produits
exports.getProduits = async (req, res) => {
  try {
    res.json(await Produit.findAll());
  } catch (err) {
    console.error("[Admin] getProduits :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// POST /api/admin/produits
exports.createProduit = async (req, res) => {
  try {
    const { nom, prix, quantite, description, image, idCategorie } = req.body;
    if (!nom || !prix || !idCategorie) {
      return res.status(400).json({ message: "Champs requis : nom, prix, idCategorie." });
    }
    const produit = await Produit.create({ nom, prix, quantite: quantite ?? 0, description, image, idCategorie });
    res.status(201).json({ message: "Produit créé.", produit });
  } catch (err) {
    console.error("[Admin] createProduit :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// PUT /api/admin/produits/:id
exports.updateProduit = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit introuvable." });
    await produit.update(req.body);
    res.json({ message: "Produit mis à jour.", produit });
  } catch (err) {
    console.error("[Admin] updateProduit :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// DELETE /api/admin/produits/:id
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit introuvable." });
    await produit.destroy();
    res.json({ message: "Produit supprimé." });
  } catch (err) {
    console.error("[Admin] deleteProduit :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── COMMANDES ─────────────────────────────────────────────────────────────────

// GET /api/admin/commandes
exports.getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      include: [{ model: User, attributes: ["idUser", "nom", "prenom", "email"] }],
      order:   [["dateCommande", "DESC"]],
    });
    res.json(commandes);
  } catch (err) {
    console.error("[Admin] getCommandes :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// PUT /api/admin/commandes/:id/statut
exports.updateStatutCommande = async (req, res) => {
  try {
    const { statut } = req.body;
    const STATUTS_VALIDES = ["en_attente", "confirmee", "expediee", "livree", "annulee"];
    if (!STATUTS_VALIDES.includes(statut)) {
      return res.status(400).json({ message: `Statut invalide. Valeurs : ${STATUTS_VALIDES.join(", ")}` });
    }
    const commande = await Commande.findByPk(req.params.id);
    if (!commande) return res.status(404).json({ message: "Commande introuvable." });
    await commande.update({ statut });
    res.json({ message: "Statut mis à jour.", commande });
  } catch (err) {
    console.error("[Admin] updateStatutCommande :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── LOGS ──────────────────────────────────────────────────────────────────────

// GET /api/admin/logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await LoginAttempts.findAll({
      include: [{ model: User, attributes: ["idUser", "nom", "prenom", "email"] }],
      order:   [["LastAttemptAt", "DESC"]],
    });
    res.json(logs);
  } catch (err) {
    console.error("[Admin] getLogs :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
