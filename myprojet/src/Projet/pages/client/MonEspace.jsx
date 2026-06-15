import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext }    from "../../Context/UserContext.jsx";
import { PanierContext }  from "../../Context/PanierContext.jsx";
import { FavorisContext } from "../../Context/FavorisContext.jsx";

const CARDS = [
  {
    to:      "/profil",
    icon:    "🪪",
    label:   "Mon profil",
    desc:    "Modifier mes informations",
    color:   "#0071e3",
  },
  {
    to:      "/historique",
    icon:    "📦",
    label:   "Mes commandes",
    desc:    "Suivre et consulter mes achats",
    color:   "#34c759",
  },
  {
    to:      "/favoris",
    icon:    "❤️",
    label:   "Mes favoris",
    desc:    "Les produits que j'ai aimés",
    color:   "#ff2d55",
  },
  {
    to:      "/panier",
    icon:    "🛒",
    label:   "Mon panier",
    desc:    "Finaliser mes achats",
    color:   "#ff9500",
  },
];

function MonEspace() {
  const { user, logout }             = useContext(UserContext);
  const { panier }                   = useContext(PanierContext);
  const { items: favorisItems }      = useContext(FavorisContext);

  if (!user) return null;

  const initiales = `${(user.prenom?.[0] || "").toUpperCase()}${(user.nom?.[0] || "").toUpperCase()}` || "U";
  const nbPanier  = panier?.reduce((acc, i) => acc + (i.quantite || 1), 0) || 0;
  const nbFavoris = favorisItems?.length || 0;

  const badges = { "/panier": nbPanier, "/favoris": nbFavoris };

  const s = {
    page: {
      minHeight: "calc(100vh - 52px)",
      backgroundColor: "#f5f5f7",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      WebkitFontSmoothing: "antialiased",
      padding: "48px 24px 64px",
    },
    inner: {
      maxWidth: "860px",
      margin: "0 auto",
    },
    // ── En-tête ──────────────────────────────────────────────────
    hero: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "40px",
    },
    avatar: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #0af 0%, #0071e3 100%)",
      color: "#fff",
      fontSize: "22px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      letterSpacing: "0.02em",
      boxShadow: "0 4px 16px rgba(0,113,227,0.25)",
    },
    heroText: {
      flex: 1,
    },
    welcome: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1d1d1f",
      letterSpacing: "-0.03em",
      margin: 0,
    },
    subtitle: {
      fontSize: "15px",
      color: "#6e6e73",
      margin: "4px 0 0",
      letterSpacing: "-0.01em",
    },
    logoutBtn: {
      background: "none",
      border: "1px solid rgba(0,0,0,0.12)",
      borderRadius: "980px",
      padding: "8px 18px",
      fontSize: "13px",
      color: "#6e6e73",
      cursor: "pointer",
      fontFamily: "inherit",
      letterSpacing: "-0.01em",
      transition: "all 0.2s ease",
      flexShrink: 0,
    },
    // ── Grille de cartes ─────────────────────────────────────────
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
      gap: "16px",
    },
    card: () => ({
      background: "#fff",
      borderRadius: "18px",
      padding: "24px 20px",
      textDecoration: "none",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.05)",
      transition: "transform 0.18s ease, box-shadow 0.18s ease",
      position: "relative",
      overflow: "hidden",
    }),
    cardAccent: (color) => ({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: color,
      borderRadius: "18px 18px 0 0",
    }),
    cardIcon: {
      fontSize: "28px",
      lineHeight: 1,
    },
    cardLabel: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1d1d1f",
      letterSpacing: "-0.02em",
      margin: 0,
    },
    cardDesc: {
      fontSize: "13px",
      color: "#6e6e73",
      margin: 0,
      letterSpacing: "-0.01em",
    },
    badge: {
      position: "absolute",
      top: "16px",
      right: "16px",
      minWidth: "22px",
      height: "22px",
      borderRadius: "11px",
      backgroundColor: "#0071e3",
      color: "#fff",
      fontSize: "11px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 5px",
    },
    // ── Bloc infos ────────────────────────────────────────────────
    infoBox: {
      background: "#fff",
      borderRadius: "18px",
      padding: "24px 28px",
      marginTop: "16px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.05)",
    },
    infoTitle: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#6e6e73",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: "14px",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #f0f0f2",
      fontSize: "15px",
      color: "#1d1d1f",
      letterSpacing: "-0.01em",
    },
    infoLabel: {
      color: "#6e6e73",
      fontSize: "14px",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.inner}>

        {/* ── En-tête ─────────────────────────────────────────── */}
        <div style={s.hero}>
          <div style={s.avatar}>{initiales}</div>
          <div style={s.heroText}>
            <h1 style={s.welcome}>Bonjour, {user.prenom} 👋</h1>
            <p style={s.subtitle}>Bienvenue dans votre espace personnel</p>
          </div>
          <button style={s.logoutBtn} onClick={logout}>
            Déconnexion
          </button>
        </div>

        {/* ── Cartes de navigation ─────────────────────────────── */}
        <div style={s.grid}>
          {CARDS.map((c) => {
            const count = badges[c.to];
            return (
              <Link
                key={c.to}
                to={c.to}
                style={s.card()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                }}
              >
                <div style={s.cardAccent(c.color)} />
                {count > 0 && <span style={s.badge}>{count}</span>}
                <span style={s.cardIcon}>{c.icon}</span>
                <p style={s.cardLabel}>{c.label}</p>
                <p style={s.cardDesc}>{c.desc}</p>
              </Link>
            );
          })}
        </div>

        {/* ── Bloc informations du compte ──────────────────────── */}
        <div style={s.infoBox}>
          <p style={s.infoTitle}>Informations du compte</p>
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Prénom</span>
            <span>{user.prenom}</span>
          </div>
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Nom</span>
            <span>{user.nom}</span>
          </div>
          <div style={{ ...s.infoRow, borderBottom: "none" }}>
            <span style={s.infoLabel}>E-mail</span>
            <span>{user.email}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MonEspace;
