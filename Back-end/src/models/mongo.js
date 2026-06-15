/**
 * mongo.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Modèles Mongoose pour la base MongoDB "Hightechshop".
 *
 * Collections créées automatiquement si elles n'existent pas :
 *   paniers   — panier de chaque utilisateur (TTL 7 jours)
 *   favoris   — favoris de chaque utilisateur (persistant)
 *   logadmins — logs des actions administrateurs
 *
 * Mongoose crée les collections automatiquement au premier save().
 * ─────────────────────────────────────────────────────────────────────────────
 */

const mongoose = require("mongoose");

// ── PANIER — TTL 7 jours (expire automatiquement via index MongoDB) ────────────
const produitPanierSchema = new mongoose.Schema({
  idProduit: { type: Number, required: true },
  nom:       { type: String, required: true },
  prix:      { type: Number, required: true },
  image:     { type: String, default: null },
  quantite:  { type: Number, required: true, min: 1 },
}, { _id: false });

const panierSchema = new mongoose.Schema({
  utilisateur_id: { type: Number, required: true, unique: true },  // idUser MySQL
  produits:       { type: [produitPanierSchema], default: [] },
  date_creation:  { type: Date, default: Date.now },
  expire_le:      { type: Date, required: true },  // TTL index sur ce champ
});
// Index TTL : MongoDB supprime automatiquement le document quand expire_le est dépassé
panierSchema.index({ expire_le: 1 }, { expireAfterSeconds: 0 });

// ── FAVORIS — persistant (pas de TTL) ─────────────────────────────────────────
const favoriSchema = new mongoose.Schema({
  idProduit: { type: Number, required: true },
  nom:       { type: String, required: true },
  prix:      { type: Number, required: true },
  image:     { type: String, default: null },
}, { _id: false });

const favorisSchema = new mongoose.Schema({
  utilisateur_id:    { type: Number, required: true, unique: true },  // idUser MySQL
  produits:          { type: [favoriSchema], default: [] },
  date_modification: { type: Date, default: Date.now },
});

// ── LOGS ADMIN — schéma flexible ──────────────────────────────────────────────
const logAdminSchema = new mongoose.Schema({
  utilisateur_id: { type: Number, required: true },
  action:         { type: String, required: true },
  details:        { type: mongoose.Schema.Types.Mixed, default: {} },
  date:           { type: Date, default: Date.now },
});

// Mongoose enregistre les collections sous les noms : "paniers", "favoris", "logadmins"
const Panier   = mongoose.model("Panier",   panierSchema);
const Favoris  = mongoose.model("Favoris",  favorisSchema);
const LogAdmin = mongoose.model("LogAdmin", logAdminSchema);

module.exports = { Panier, Favoris, LogAdmin };
