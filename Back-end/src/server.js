/**
 * server.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Point d'entrée du serveur.
 *
 * Initialisation :
 *   1. Variables d'environnement (.env)
 *   2. Modèles Sequelize (MySQL) + associations
 *   3. Connexion MySQL
 *   4. Connexion MongoDB (base Hightechshop — créée automatiquement si absente)
 *   5. Démarrage du serveur HTTP
 * ─────────────────────────────────────────────────────────────────────────────
 */

require("dotenv").config();

const app               = require("./expressApp");
const { connectMySQL }  = require("./db");
const { connectMongo }  = require("./config/mongo");

// ── Import des modèles MySQL pour l'enregistrement Sequelize ──────────────────
const User          = require("./models/User");
const RefreshToken  = require("./models/RefreshToken");
const LoginAttempts = require("./models/LoginAttempts");
const Produit       = require("./models/Produit");
const Commande      = require("./models/Commande");

// ── Import des modèles MongoDB (suffit d'importer pour les enregistrer) ───────
require("./models/mongo");

// ── Associations Sequelize ────────────────────────────────────────────────────
User.hasMany(LoginAttempts, { foreignKey: "idUser" });
LoginAttempts.belongsTo(User, { foreignKey: "idUser" });

User.hasMany(Commande, { foreignKey: "id_user" });
Commande.belongsTo(User, { foreignKey: "id_user" });

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectMySQL();   // MySQL obligatoire
  await connectMongo();   // MongoDB — la BDD et les collections sont créées automatiquement

  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
};

start();
