/**
 * Commande.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Modèle Sequelize pour la table `Commande`.
 *
 * Colonnes existantes dans le schéma SQL :
 *   idCommande, id_user, idPaiement, idAdresse,
 *   dateCommande, DatePaiement, Quantite
 *
 * Colonne ajoutée :
 *   statut — état de la commande, géré par l'admin
 *             valeurs : en_attente | confirmee | expediee | livree | annulee
 *
 * ⚠️  Penser à lancer la migration SQL :
 *   ALTER TABLE `Commande` ADD COLUMN `statut` VARCHAR(50) NOT NULL DEFAULT 'en_attente';
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Commande = sequelize.define("Commande", {
  idCommande: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idPaiement: {
    type: DataTypes.INTEGER,
    allowNull: true,  // null possible si paiement non encore confirmé
  },
  idAdresse: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dateCommande: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  DatePaiement: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  Quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  // ── Statut de la commande (géré par l'admin) ─────────────────────────────
  statut: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "en_attente",
    // Valeurs possibles : en_attente | confirmee | expediee | livree | annulee
  },
}, {
  tableName:  "Commande",
  timestamps: false,
});

// Association : une commande appartient à un utilisateur
const User = require("./User");
Commande.belongsTo(User, { foreignKey: "id_user" });
User.hasMany(Commande,   { foreignKey: "id_user" });

module.exports = Commande;
