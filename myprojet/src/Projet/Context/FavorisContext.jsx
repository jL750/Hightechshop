/**
 * FavorisContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Context React pour la gestion des favoris.
 *
 * Les favoris sont sauvegardés dans MongoDB (via /api/favoris) et liés à l'idUser.
 * Ils sont chargés automatiquement à la connexion et vidés à la déconnexion.
 *
 * Exports :
 *   FavorisContext — le contexte React
 *   FavorisProvider — le provider à wrapper autour de l'app
 *   useFavoris — hook pour consommer le context
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { favorisService } from "../services/favorisService";
import { UserContext }    from "./UserContext";

export const FavorisContext = createContext(null);

export function FavorisProvider({ children }) {
  const { user, accessToken } = useContext(UserContext);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les favoris depuis MongoDB à chaque connexion/déconnexion
  useEffect(() => {
    if (!user || !accessToken) {
      setItems([]); // Vider les favoris à la déconnexion
      return;
    }
    const charger = async () => {
      setLoading(true);
      try {
        const fav = await favorisService.getFavoris(accessToken);
        setItems(fav?.produits || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, [user, accessToken]);

  // Ajoute un produit aux favoris (via API → MongoDB)
  const addFavori = useCallback(async (idProduit) => {
    try {
      const updated = await favorisService.addFavori(accessToken, idProduit);
      setItems(updated.produits || []);
    } catch (err) {
      console.error("[Favoris] addFavori :", err.message);
    }
  }, [accessToken]);

  // Retire un produit des favoris (via API → MongoDB)
  const removeFavori = useCallback(async (idProduit) => {
    try {
      const updated = await favorisService.removeFavori(accessToken, idProduit);
      setItems(updated.produits || []);
    } catch (err) {
      console.error("[Favoris] removeFavori :", err.message);
    }
  }, [accessToken]);

  // Vérifie si un produit est dans les favoris
  const isFavori = useCallback((idProduit) => {
    return items.some(p => p.idProduit === idProduit);
  }, [items]);

  return (
    <FavorisContext.Provider value={{
      items,
      loading,
      addFavori,
      removeFavori,
      isFavori,
      total: items.length,
    }}>
      {children}
    </FavorisContext.Provider>
  );
}

// Hook raccourci
export function useFavoris() {
  const ctx = useContext(FavorisContext);
  if (!ctx) throw new Error("useFavoris doit être utilisé dans FavorisProvider");
  return ctx;
}
