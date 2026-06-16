/**
 * Main.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Routeur principal de l'application React (React Router v6).
 *
 * Structure des routes :
 *   PUBLIC       — accessibles sans connexion (Home, Catalogue, Connexion, Inscription)
 *   PROTÉGÉES    — connexion requise (ProtectedRoute → redirige vers /connexion)
 *   ADMIN        — rôle admin requis (AdminRoute → redirige vers /home)
 *
 * Nouvelles routes ajoutées :
 *   /favoris     → page favoris (protégée)
 *   /profil      → profil utilisateur (protégée)
 *   /historique  → historique commandes (protégée)
 *   /commande    → finaliser une commande (protégée)
 *   /admin/*     → pages d'administration (admin uniquement)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Routes, Route, Navigate } from "react-router-dom";

// ── Guards de routes ──────────────────────────────────────────────────────────
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute.jsx";

// ── Pages publiques ───────────────────────────────────────────────────────────
import Home        from "./Home.jsx";
import Connexion   from "./Connexion.jsx";
import Inscription from "./Inscription.jsx";
import Catalogue   from "./Catalogue.jsx";

// ── Pages client (connexion requise) ─────────────────────────────────────────
import Panier     from "./Panier.jsx";
import MonEspace  from "./pages/client/MonEspace.jsx";
import Favoris    from "./pages/client/Favoris.jsx";
import Profil     from "./pages/client/Profil.jsx";
import Historique from "./pages/client/Historique.jsx";
import Checkout   from "./pages/client/Checkout.jsx";

// ── Pages admin (rôle admin requis) ──────────────────────────────────────────
import Dashboard           from "./pages/admin/Dashboard.jsx";
import GestionUtilisateurs from "./pages/admin/GestionUtilisateurs.jsx";
import GestionProduits     from "./pages/admin/GestionProduits.jsx";
import GestionCommandes    from "./pages/admin/GestionCommandes.jsx";
import GestionLogs         from "./pages/admin/GestionLogs.jsx";

function Main() {
  return (
    <main style={{ minHeight: "80vh" }}>
      <Routes>

        {/* ── Routes publiques ────────────────────────────────────────────── */}
        <Route path="/home"        element={<Home />} />
        <Route path="/connexion"   element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/catalogue"   element={<Catalogue />} />

        {/* ── Routes client protégées (connexion requise) ─────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/panier"     element={<Panier />} />
          <Route path="/mon-espace" element={<MonEspace />} />
          <Route path="/favoris"    element={<Favoris />} />
          <Route path="/profil"     element={<Profil />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/commande"   element={<Checkout />} />
        </Route>

        {/* ── Routes admin (rôle admin requis) ────────────────────────────── */}
        <Route element={<AdminRoute />}>
          <Route path="/admin"              element={<Dashboard />} />
          <Route path="/admin/utilisateurs" element={<GestionUtilisateurs />} />
          <Route path="/admin/produits"     element={<GestionProduits />} />
          <Route path="/admin/commandes"    element={<GestionCommandes />} />
          <Route path="/admin/logs"         element={<GestionLogs />} />
        </Route>

        {/* ── Fallback : toute route inconnue → accueil ───────────────────── */}
        <Route path="*" element={<Navigate to="/home" replace />} />

      </Routes>
    </main>
  );
}

export default Main;
