/**
 * mongo.js (config)
 * ─────────────────────────────────────────────────────────────────────────────
 * Connexion à MongoDB via Mongoose.
 *
 * La base "Hightechshop" est créée automatiquement par MongoDB si elle n'existe pas.
 * Les collections (paniers, favoris, logadmins) sont créées au premier save().
 *
 * URI attendue dans .env :
 *   MONGO_URI=mongodb://localhost:27017/Hightechshop
 * ─────────────────────────────────────────────────────────────────────────────
 */

const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connecté — base : Hightechshop");
  } catch (err) {
    console.error("❌ Erreur MongoDB :", err.message);
    // On ne stoppe pas le serveur si MongoDB est indisponible
    // (MySQL reste fonctionnel pour auth et produits)
  }
};

module.exports = { connectMongo };
