/**
 * ProtectedRoute.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Composants de protection des routes React Router v6.
 *
 * ProtectedRoute — redirige vers /connexion si l'utilisateur n'est pas connecté.
 * AdminRoute     — redirige vers /connexion si non connecté, /home si non admin.
 *
 * Utilisation dans Main.jsx :
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/favoris" element={<Favoris />} />
 *   </Route>
 *   <Route element={<AdminRoute />}>
 *     <Route path="/admin" element={<Dashboard />} />
 *   </Route>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../Context/UserContext.jsx";

// Protège les routes nécessitant une connexion client
export function ProtectedRoute() {
  const { user, initializing } = useContext(UserContext);
  if (initializing) return null; // attend la fin du refresh avant de décider
  if (!user) return <Navigate to="/connexion" replace />;
  return <Outlet />;
}

// Protège les routes réservées aux administrateurs
export function AdminRoute() {
  const { user, initializing } = useContext(UserContext);
  if (initializing)            return null;
  if (!user)                   return <Navigate to="/connexion" replace />;
  if (user.role !== "admin")   return <Navigate to="/home" replace />;
  return <Outlet />;
}
