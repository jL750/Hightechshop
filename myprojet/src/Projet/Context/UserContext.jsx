import { createContext, useState, useEffect, useRef } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(null); // en mémoire, jamais dans localStorage
  const [initializing, setInitializing] = useState(true); // true tant que le refresh n'a pas répondu
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
    if (!savedUser) {
      setInitializing(false); // pas de session à restaurer, on débloque immédiatement
      return;
    }

    fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          setUser(JSON.parse(savedUser));
          startAutoLogout(15 * 60 * 1000);
        } else {
          setUser(null);
          setAccessToken(null);
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("user");
      })
      .finally(() => {
        setInitializing(false); // session restaurée ou non, on débloque les routes
      });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, accessToken, initializing, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
