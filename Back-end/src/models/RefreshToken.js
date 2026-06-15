const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const RefreshToken = sequelize.define('RefreshToken', {
  id_token: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  token_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  CreateAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  RevokedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,   // null = token actif
  },
  ExpireAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'RefreshToken',  // correspond exactement au MCD
  timestamps: false,
});

module.exports = RefreshToken;
