const { Sequelize } = require('sequelize');

// ── MySQL (Sequelize) → Utilisateurs + Produits ──────
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST,
    port:    parseInt(process.env.DB_PORT, 10),
    dialect: 'mysql',
    logging: false,
    timezone: '+02:00', // Europe/Paris (UTC+2 en heure d'été)
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Connecté à MySQL');
  } catch (err) {
    console.error('❌ Erreur MySQL :', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectMySQL };
