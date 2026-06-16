import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext }   from "./Context/UserContext.jsx";
import { FavorisContext } from "./Context/FavorisContext.jsx";
import { PanierContext }  from "./Context/PanierContext.jsx";

function Header() {
  const { user, logout }   = useContext(UserContext);
  const { items: favorisItems } = useContext(FavorisContext);
  const { panier }         = useContext(PanierContext);
  const location           = useLocation();
  const [hovered, setHovered]   = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Sous-menu utilisateur (Profil / Historique / Admin)
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu mobile et le sous-menu user au changement de route
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Ferme le sous-menu user si on clique en dehors
  useEffect(() => {
    const close = () => setUserMenuOpen(false);
    if (userMenuOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [userMenuOpen]);

  // Liens de navigation principaux
  const navLinks = [
    { to: "/home",      label: "Accueil" },
    { to: "/catalogue", label: "Catalogue" },
  ];

  // Nombre total d'articles dans le panier (pour le badge)
  const nbPanier  = panier?.reduce((acc, item) => acc + (item.quantite || 1), 0) || 0;
  const nbFavoris = favorisItems?.length || 0;

  const s = {
    header: {
      width: "100%",
      backgroundColor: scrolled
        ? "rgba(17, 17, 19, 0.95)"
        : "rgba(17, 17, 19, 0.80)",
      backdropFilter: "saturate(200%) blur(24px)",
      WebkitBackdropFilter: "saturate(200%) blur(24px)",
      color: "#f5f5f7",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      position: "sticky",
      top: 0,
      zIndex: 9999,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      transition: "background 0.4s ease, border-color 0.4s ease",
    },
    inner: {
      maxWidth: "1080px",
      margin: "0 auto",
      padding: "0 28px",
      height: "52px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
    },
    logo: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#f5f5f7",
      textDecoration: "none",
      letterSpacing: "-0.02em",
      display: "flex",
      alignItems: "center",
      gap: "7px",
      flexShrink: 0,
      opacity: hovered === "logo" ? 0.75 : 1,
      transition: "opacity 0.2s ease",
    },
    logoIcon: {
      width: "22px",
      height: "22px",
      background: "linear-gradient(135deg, #0af 0%, #0071e3 100%)",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
    },
    nav: {
      display: "flex",
      alignItems: "center",
      gap: "2px",
      flex: 1,
      justifyContent: "center",
    },
    navLink: (key) => ({
      color: isActive(key) ? "#f5f5f7" : hovered === key ? "#f5f5f7" : "#a1a1a6",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: isActive(key) ? "500" : "400",
      padding: "6px 14px",
      borderRadius: "8px",
      backgroundColor:
        isActive(key)
          ? "rgba(255,255,255,0.10)"
          : hovered === key
          ? "rgba(255,255,255,0.07)"
          : "transparent",
      transition: "all 0.2s ease",
      display: "inline-block",
      letterSpacing: "-0.01em",
    }),
    right: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexShrink: 0,
    },
    btnOutline: (key) => ({
      color: hovered === key ? "#f5f5f7" : "#a1a1a6",
      backgroundColor: hovered === key ? "rgba(255,255,255,0.08)" : "transparent",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "980px",
      padding: "6px 16px",
      fontSize: "13px",
      fontWeight: "400",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      letterSpacing: "-0.01em",
    }),
    btnPrimary: (key) => ({
      color: "#fff",
      background: hovered === key
        ? "linear-gradient(135deg, #29a3ff 0%, #0071e3 100%)"
        : "linear-gradient(135deg, #0af 0%, #0071e3 100%)",
      border: "none",
      borderRadius: "980px",
      padding: "7px 18px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      letterSpacing: "-0.01em",
      boxShadow: hovered === key
        ? "0 4px 16px rgba(0,170,255,0.35)"
        : "0 2px 8px rgba(0,113,227,0.25)",
    }),
    avatar: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #0af 0%, #0071e3 100%)",
      color: "#fff",
      fontSize: "11px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      letterSpacing: "0.02em",
      cursor: "pointer",
    },
    logoutBtn: (key) => ({
      color: hovered === key ? "#ff6961" : "#a1a1a6",
      backgroundColor: hovered === key ? "rgba(255,105,97,0.10)" : "transparent",
      border: "none",
      fontSize: "13px",
      fontWeight: "400",
      cursor: "pointer",
      padding: "6px 12px",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      letterSpacing: "-0.01em",
    }),
    // Icône avec badge (panier / favoris)
    iconBtn: (key) => ({
      position: "relative",
      color: isActive(key) ? "#f5f5f7" : hovered === key ? "#f5f5f7" : "#a1a1a6",
      fontSize: "17px",
      cursor: "pointer",
      padding: "6px 10px",
      borderRadius: "8px",
      backgroundColor: hovered === key ? "rgba(255,255,255,0.07)" : "transparent",
      transition: "all 0.2s ease",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
    }),
    badge: {
      position: "absolute",
      top: "1px",
      right: "1px",
      minWidth: "16px",
      height: "16px",
      borderRadius: "8px",
      backgroundColor: "#0071e3",
      color: "#fff",
      fontSize: "10px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 3px",
    },
    // Sous-menu dropdown utilisateur
    userMenuWrapper: {
      position: "relative",
    },
    userDropdown: {
      position: "absolute",
      top: "calc(100% + 10px)",
      right: 0,
      backgroundColor: "rgba(28,28,30,0.98)",
      backdropFilter: "blur(24px)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: "14px",
      padding: "6px",
      minWidth: "180px",
      zIndex: 10000,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    },
    dropdownLink: (key) => ({
      display: "block",
      padding: "9px 14px",
      borderRadius: "9px",
      textDecoration: "none",
      fontSize: "13px",
      color: hovered === key ? "#f5f5f7" : "#c8c8cc",
      backgroundColor: hovered === key ? "rgba(255,255,255,0.08)" : "transparent",
      transition: "all 0.15s ease",
      letterSpacing: "-0.01em",
    }),
    dropdownDivider: {
      height: "1px",
      backgroundColor: "rgba(255,255,255,0.07)",
      margin: "4px 0",
    },
    mobileMenu: {
      display: menuOpen ? "flex" : "none",
      flexDirection: "column",
      gap: "2px",
      padding: "8px 16px 16px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      backgroundColor: "rgba(17,17,19,0.98)",
      backdropFilter: "blur(24px)",
    },
    mobileLink: (path) => ({
      color: isActive(path) ? "#f5f5f7" : "#a1a1a6",
      textDecoration: "none",
      fontSize: "15px",
      fontWeight: isActive(path) ? "500" : "400",
      padding: "10px 12px",
      borderRadius: "10px",
      backgroundColor: isActive(path) ? "rgba(255,255,255,0.08)" : "transparent",
      letterSpacing: "-0.01em",
    }),
  };

  const getInitials = () => {
    if (!user) return "";
    const prenom = user.prenom || user.name || "";
    const nom    = user.nom    || "";
    return `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase() || "U";
  };

  return (
    <header style={s.header}>
      <div style={s.inner}>

        {/* ── Logo ────────────────────────────────────────────────────── */}
        <Link
          to="/home"
          style={s.logo}
          onMouseEnter={() => setHovered("logo")}
          onMouseLeave={() => setHovered(null)}
        >
          <span style={s.logoIcon}>⚡</span>
          HighTech
        </Link>

        {/* ── Navigation desktop ──────────────────────────────────────── */}
        <nav style={s.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={s.navLink(link.to)}
              onMouseEnter={() => setHovered(link.to)}
              onMouseLeave={() => setHovered(null)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Droite : icônes + auth ──────────────────────────────────── */}
        <div style={s.right}>

          {/* Icône Favoris — visible uniquement si connecté */}
          {user && (
            <Link
              to="/favoris"
              style={s.iconBtn("/favoris")}
              onMouseEnter={() => setHovered("/favoris")}
              onMouseLeave={() => setHovered(null)}
              title="Mes favoris"
            >
              ❤️
              {nbFavoris > 0 && <span style={s.badge}>{nbFavoris}</span>}
            </Link>
          )}

          {/* Icône Panier avec badge quantité — visible uniquement si connecté */}
          {user && (
            <Link
              to="/panier"
              style={s.iconBtn("/panier")}
              onMouseEnter={() => setHovered("/panier")}
              onMouseLeave={() => setHovered(null)}
              title="Mon panier"
            >
              🛒
              {nbPanier > 0 && <span style={s.badge}>{nbPanier}</span>}
            </Link>
          )}

          {/* ── Utilisateur connecté ─────────────────────────────────── */}
          {user ? (
            <div style={s.userMenuWrapper}>
              {/* Avatar cliquable → ouvre le sous-menu */}
              <div
                style={s.avatar}
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen((o) => !o); }}
                title="Mon compte"
              >
                {getInitials()}
              </div>

              {/* Sous-menu dropdown */}
              {userMenuOpen && (
                <div style={s.userDropdown} onClick={(e) => e.stopPropagation()}>

                  {/* Nom de l'utilisateur */}
                  <div style={{ padding: "8px 14px 6px", fontSize: "12px", color: "#6e6e73" }}>
                    {user.prenom} {user.nom}
                  </div>
                  <div style={s.dropdownDivider} />

                  {/* Mon espace */}
                  <Link to="/mon-espace" style={s.dropdownLink("/mon-espace")}
                    onMouseEnter={() => setHovered("/mon-espace")}
                    onMouseLeave={() => setHovered(null)}>
                    👤 Mon espace
                  </Link>

                  {/* Profil */}
                  <Link to="/profil" style={s.dropdownLink("/profil")}
                    onMouseEnter={() => setHovered("/profil")}
                    onMouseLeave={() => setHovered(null)}>
                    🪪 Mon profil
                  </Link>

                  {/* Historique commandes */}
                  <Link to="/historique" style={s.dropdownLink("/historique")}
                    onMouseEnter={() => setHovered("/historique")}
                    onMouseLeave={() => setHovered(null)}>
                    📦 Mes commandes
                  </Link>

                  {/* Favoris */}
                  <Link to="/favoris" style={s.dropdownLink("/favoris")}
                    onMouseEnter={() => setHovered("/favoris-dd")}
                    onMouseLeave={() => setHovered(null)}>
                    ❤️ Mes favoris
                  </Link>

                  {/* Lien admin — visible uniquement si admin */}
                  {user.role === "admin" && (
                    <>
                      <div style={s.dropdownDivider} />
                      <Link to="/admin" style={{ ...s.dropdownLink("/admin"), color: hovered === "/admin" ? "#f5f5f7" : "#f59e0b" }}
                        onMouseEnter={() => setHovered("/admin")}
                        onMouseLeave={() => setHovered(null)}>
                        ⚙️ Administration
                      </Link>
                    </>
                  )}

                  <div style={s.dropdownDivider} />

                  {/* Déconnexion */}
                  <button
                    style={{ ...s.logoutBtn("logout-dd"), width: "100%", textAlign: "left", borderRadius: "9px", padding: "9px 14px" }}
                    onClick={logout}
                    onMouseEnter={() => setHovered("logout-dd")}
                    onMouseLeave={() => setHovered(null)}
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Non connecté ────────────────────────────────────────── */
            <>
              <Link
                to="/connexion"
                style={s.btnOutline("connexion")}
                onMouseEnter={() => setHovered("connexion")}
                onMouseLeave={() => setHovered(null)}
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                style={s.btnPrimary("inscription")}
                onMouseEnter={() => setHovered("inscription")}
                onMouseLeave={() => setHovered(null)}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Menu mobile ─────────────────────────────────────────────────── */}
      <div style={s.mobileMenu}>
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} style={s.mobileLink(link.to)}>
            {link.label}
          </Link>
        ))}

        {/* Liens connecté en mobile */}
        {user && (
          <>
            <Link to="/panier"     style={s.mobileLink("/panier")}>🛒 Panier {nbPanier > 0 && `(${nbPanier})`}</Link>
            <Link to="/favoris"    style={s.mobileLink("/favoris")}>❤️ Favoris {nbFavoris > 0 && `(${nbFavoris})`}</Link>
            <Link to="/profil"     style={s.mobileLink("/profil")}>🪪 Mon profil</Link>
            <Link to="/historique" style={s.mobileLink("/historique")}>📦 Mes commandes</Link>
            {user.role === "admin" && (
              <Link to="/admin" style={{ ...s.mobileLink("/admin"), color: "#f59e0b" }}>⚙️ Administration</Link>
            )}
            <button
              style={{ ...s.logoutBtn("m-logout"), width: "100%", textAlign: "left", padding: "10px 12px", marginTop: "4px" }}
              onClick={logout}
            >
              Déconnexion
            </button>
          </>
        )}

        {/* Boutons connexion/inscription en mobile si non connecté */}
        {!user && (
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <Link to="/connexion"   style={{ ...s.btnOutline("m-connexion"),   flex: 1, justifyContent: "center" }}>Connexion</Link>
            <Link to="/inscription" style={{ ...s.btnPrimary("m-inscription"), flex: 1, justifyContent: "center" }}>S'inscrire</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
