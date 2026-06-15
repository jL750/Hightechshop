/**
 * PanierContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Context React pour la gestion du panier.
 *
 * Si l'utilisateur est connecté :
 *   → le panier est sauvegardé dans MongoDB (via /api/cart)
 *   → il est restauré automatiquement à la reconnexion
 *
 * Si l'utilisateur n'est pas connecté :
 *   → le panier est géré en mémoire (état local)
 *   → à la connexion, les items locaux sont fusionnés avec le panier MongoDB
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartService } from "../services/cartService";
import { UserContext } from "./UserContext";

export const PanierContext = createContext(null);

export function PanierProvider({ children }) {
  const { user, accessToken } = useContext(UserContext);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger le panier MongoDB à la connexion, vider à la déconnexion
  useEffect(() => {
    if (!user || !accessToken) {
      setItems([]);
      return;
    }
    const charger = async () => {
      setLoading(true);
      try {
        const cart = await cartService.getCart(accessToken);
        setItems(cart?.produits || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, [user, accessToken]);

  // Ajouter ou incrémenter un produit dans le panier
  const ajouterAuPanier = useCallback(async (produit, quantite = 1) => {
    if (user && accessToken) {
      // Connecté → sauvegarde MongoDB
      try {
        const updated = await cartService.addItem(accessToken, produit.idProduit, quantite);
        setItems(updated.produits || []);
      } catch (err) {
        console.error("[Panier] addItem :", err.message);
      }
    } else {
      // Non connecté → panier en mémoire uniquement
      setItems(prev => {
        const idx = prev.findIndex(p => p.idProduit === produit.idProduit);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], quantite: updated[idx].quantite + quantite };
          return updated;
        }
        return [...prev, { ...produit, quantite }];
      });
    }
  }, [user, accessToken]);

  // Modifier la quantité d'un produit
  const modifierQuantite = useCallback(async (idProduit, nouvelleQuantite) => {
    if (user && accessToken) {
      const diff = nouvelleQuantite - (items.find(p => p.idProduit === idProduit)?.quantite || 0);
      try {
        const updated = await cartService.addItem(accessToken, idProduit, diff);
        setItems(updated.produits || []);
      } catch (err) {
        console.error("[Panier] modifierQuantite :", err.message);
      }
    } else {
      setItems(prev =>
        prev.map(p => p.idProduit === idProduit ? { ...p, quantite: Math.max(1, nouvelleQuantite) } : p)
      );
    }
  }, [user, accessToken, items]);

  // Supprimer un produit du panier
  const supprimerArticle = useCallback(async (idProduit) => {
    if (user && accessToken) {
      try {
        const updated = await cartService.removeItem(accessToken, idProduit);
        setItems(updated.produits || []);
      } catch (err) {
        console.error("[Panier] removeItem :", err.message);
      }
    } else {
      setItems(prev => prev.filter(p => p.idProduit !== idProduit));
    }
  }, [user, accessToken]);

  // Vider le panier
  const viderPanier = useCallback(async () => {
    if (user && accessToken) {
      try {
        await cartService.clearCart(accessToken);
      } catch (err) {
        console.error("[Panier] clearCart :", err.message);
      }
    }
    setItems([]);
  }, [user, accessToken]);

  return (
    <PanierContext.Provider value={{
      panier:         items,         // alias pour compatibilité avec l'ancien code
      items,
      loading,
      totalItems:     items.reduce((s, i) => s + i.quantite, 0),
      totalPrice:     items.reduce((s, i) => s + i.prix * i.quantite, 0),
      ajouterAuPanier,
      modifierQuantite,
      supprimerArticle,
      viderPanier,
      setPanier:      setItems,      // alias pour compatibilité Checkout
    }}>
      {children}
    </PanierContext.Provider>
  );
}
