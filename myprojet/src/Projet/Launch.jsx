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

import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Main   from "./Main.jsx";

import { UserProvider }    from "./Context/UserContext.jsx";
import { PanierProvider }  from "./Context/PanierContext.jsx";
import { FavorisProvider } from "./Context/FavorisContext.jsx";   // nouveau

function MyAppLaunch() {
  return (
    <UserProvider>
      <PanierProvider>
        {/* FavorisProvider doit être dans PanierProvider car Favoris.jsx utilise les deux */}
        <FavorisProvider>
          <BrowserRouter>
            <Header />
            <Main />
            <Footer />
          </BrowserRouter>
        </FavorisProvider>
      </PanierProvider>
    </UserProvider>
  );
}

export default MyAppLaunch;
