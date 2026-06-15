const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Produit = sequelize.define('Produit', {
  idProduit: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  prix: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  quantite: {
    type: DataTypes.DECIMAL(15, 0),
    allowNull: false,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  idCategorie: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Produits',
  timestamps: false,
});

module.exports = Produit;
