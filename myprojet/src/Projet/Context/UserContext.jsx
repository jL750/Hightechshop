import { createContext, useState, useEffect, useRef } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(null); // en mémoire, jamais dans localStorage
  const timerRef = useRef(null);

  // Déconnexion complète
  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include", // envoie le cookie refreshToken automatiquement
      });
    } catch (_) {}

    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user"); // on garde l'info user pour l'UX
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Démarre le timer de déconnexion automatique (3 min = durée refresh token)
  const startAutoLogout = (delayMs) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      logout();
    }, delayMs);
  };

  // Connexion : on stocke user dans localStorage (UX), access token en mémoire
  // Le refresh token est dans le cookie HttpOnly géré par le navigateur
  const login = (userData, newAccessToken) => {
    setUser(userData);
    setAccessToken(newAccessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    // Déconnexion auto dans 3 minutes (durée du refresh token)
    startAutoLogout(15 * 60 * 1000);
  };

  // Au rechargement de la page : tenter de restaurer la session via le cookie
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return; // pas de session précédente connue

    // Le cookie refreshToken est envoyé automatiquement par le navigateur
    fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      credentials: "include", // envoie le cookie HttpOnly
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          // Token encore valide : on restaure la session
          setAccessToken(data.accessToken);
          setUser(JSON.parse(savedUser));
          startAutoLogout(15 * 60 * 1000);
        } else {
          // Token expiré : on nettoie
          setUser(null);
          setAccessToken(null);
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("user");
      });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
