/**
 * Launch.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Point d'entrée de l'application React.
 * Configure les Providers de Context dans l'ordre correct (du plus externe au plus interne) :
 *   UserProvider    → gestion de l'authentification (JWT, refresh token)
 *   PanierProvider  → gestion du panier (localStorage)
 *   FavorisProvider → gestion des favoris (localStorage)  ← ajouté
 *
 * BrowserRouter est placé ici pour que les Providers aient accès au router si besoin.
 *
 * Modification : ajout de FavorisProvider
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Main   from "./Main.jsx";

import { UserProvider, UserContext } from "./Context/UserContext.jsx";
import { PanierProvider }  from "./Context/PanierContext.jsx";
import { FavorisProvider } from "./Context/FavorisContext.jsx";

// Barre de navigation minimale pour l'admin
function AdminBar() {
  const { user, logout } = useContext(UserContext);
  return (
    <div style={{
      width: "100%",
      backgroundColor: "#1c1c1e",
      color: "#f5f5f7",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      height: "48px",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      fontSize: "13px",
      boxSizing: "border-box",
      position: "sticky",
      top: 0,
      zIndex: 9999,
    }}>
      <span style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
        ⚙️ Administration — {user?.prenom} {user?.nom}
      </span>
      <button
        onClick={logout}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "980px",
          color: "#f5f5f7",
          fontSize: "13px",
          padding: "6px 16px",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Déconnexion
      </button>
    </div>
  );
}

// Séparation layout client / admin — doit être à l'intérieur de BrowserRouter et UserProvider
function AppLayout() {
  const { user } = useContext(UserContext);
  const isAdmin  = user?.role === "admin";

  if (isAdmin) {
    return (
      <>
        <AdminBar />
        <Main />
      </>
    );
  }

  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

function MyAppLaunch() {
  return (
    <UserProvider>
      <PanierProvider>
        <FavorisProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </FavorisProvider>
      </PanierProvider>
    </UserProvider>
  );
}

export default MyAppLaunch;
