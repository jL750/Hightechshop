const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const LoginAttempts = sequelize.define('LoginAttempts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  AttemptCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  LastAttemptAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  LockedUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,   // null = compte non bloqué
  },
  ip_adresse: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'LoginAttempts',
  timestamps: false,
});

module.exports = LoginAttempts;
