/**
 * expressApp.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Configuration de l'application Express.
 *
 * Ordre des middlewares :
 *   1. Helmet      — headers HTTP sécurisés
 *   2. CORS        — autorise le front React
 *   3. Parsers     — JSON + cookies
 *   4. XSS         — sanitise req.body
 *   5. Routes      — auth, produits, admin, commandes, favoris, cart
 *   6. 404 / erreur globale
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express          = require("express");
const cors             = require("cors");
const cookieParser     = require("cookie-parser");
const helmetMiddleware = require("./middleware/helmet");
const xssMiddleware    = require("./middleware/xss");

const authRoutes      = require("./routes/authRoutes");
const produitRoutes   = require("./routes/Produits");
const adminRoutes     = require("./routes/adminRoutes");
const commandeRoutes  = require("./routes/commandeRoutes");
const favorisRoutes   = require("./routes/favorisRoutes");   // nouveau
const cartRoutes      = require("./routes/cartRoutes");       // nouveau

const app = express();

app.use(helmetMiddleware);

app.use(cors({
  origin:         process.env.FRONTEND_URL || "http://localhost:5173",
  credentials:    true,
  methods:        ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
app.use(xssMiddleware);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/produits",  produitRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/favoris",   favorisRoutes);   // favoris MongoDB
app.use("/api/cart",      cartRoutes);      // panier MongoDB

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((req, res) => res.status(404).json({ message: "Route introuvable." }));

app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur :", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur." });
});

module.exports = app;
