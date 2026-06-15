import { Link } from "react-router-dom";
import { useState } from "react";

function Footer() {
  const [hovered, setHovered] = useState(null);

  const columns = [
    {
      title: "Boutique",
      links: [
        { label: "Accueil", to: "/home" },
        { label: "Catalogue", to: "/catalogue" },
        { label: "Panier", to: "/panier" },
        { label: "Mon espace", to: "/mon-espace" },
      ],
    },
    {
      title: "Compte",
      links: [
        { label: "Connexion", to: "/connexion" },
        { label: "Créer un compte", to: "/inscription" },
        { label: "Mes commandes", to: "/mon-espace" },
        { label: "Mes favoris", to: "/catalogue" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Centre d'aide", to: "#aide" },
        { label: "Contact", to: "#contact" },
        { label: "Livraison & retours", to: "#livraison" },
        { label: "Garantie", to: "#garantie" },
      ],
    },
    {
      title: "Société",
      links: [
        { label: "À propos", to: "#about" },
        { label: "Mentions légales", to: "#mentions" },
        { label: "Confidentialité", to: "#confidentialite" },
        { label: "Conditions d'utilisation", to: "#cgu" },
      ],
    },
  ];

  const styles = {
    footer: {
      backgroundColor: "#111113",
      color: "#86868b",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    },
    top: {
      maxWidth: "1080px",
      margin: "0 auto",
      padding: "56px 28px 40px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "40px",
    },
    brand: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    logoIcon: {
      width: "26px",
      height: "26px",
      background: "linear-gradient(135deg, #0af 0%, #0071e3 100%)",
      borderRadius: "7px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      flexShrink: 0,
    },
    logoText: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#f5f5f7",
      letterSpacing: "-0.02em",
      textDecoration: "none",
    },
    tagline: {
      fontSize: "13px",
      lineHeight: 1.6,
      color: "#6e6e73",
      maxWidth: "200px",
    },
    socialRow: {
      display: "flex",
      gap: "10px",
      marginTop: "4px",
    },
    socialBtn: (key) => ({
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.1)",
      backgroundColor: hovered === key ? "rgba(255,255,255,0.08)" : "transparent",
      color: hovered === key ? "#f5f5f7" : "#6e6e73",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      cursor: "pointer",
      textDecoration: "none",
      transition: "all 0.2s ease",
    }),
    colTitle: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#f5f5f7",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      marginBottom: "16px",
    },
    colLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    colLink: (key) => ({
      color: hovered === key ? "#f5f5f7" : "#86868b",
      fontSize: "13px",
      textDecoration: "none",
      transition: "color 0.2s ease",
      letterSpacing: "-0.01em",
    }),
    divider: {
      maxWidth: "1080px",
      margin: "0 auto",
      height: "1px",
      backgroundColor: "rgba(255,255,255,0.06)",
    },
    bottom: {
      maxWidth: "1080px",
      margin: "0 auto",
      padding: "20px 28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "12px",
    },
    copy: {
      fontSize: "12px",
      color: "#515154",
      letterSpacing: "-0.01em",
    },
    bottomLinks: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },
    bottomLink: (key) => ({
      fontSize: "12px",
      color: hovered === `b-${key}` ? "#86868b" : "#515154",
      textDecoration: "none",
      transition: "color 0.2s ease",
      letterSpacing: "-0.01em",
    }),
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "11px",
      color: "#515154",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "980px",
      padding: "4px 12px",
    },
    dot: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: "#30d158",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.top}>
        {/* Brand column */}
        <div style={styles.brand}>
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>⚡</span>
            <Link to="/home" style={styles.logoText}>HighTech</Link>
          </div>
          <p style={styles.tagline}>
            La technologie du futur, disponible aujourd'hui.
          </p>
          <div style={styles.badge}>
            <span style={styles.dot} />
            Tous les services opérationnels
          </div>
          <div style={styles.socialRow}>
            {[
              { key: "tw", icon: "𝕏" },
              { key: "ig", icon: "◉" },
              { key: "li", icon: "in" },
            ].map((s) => (
              <a
                key={s.key}
                href="#"
                style={styles.socialBtn(s.key)}
                onMouseEnter={() => setHovered(s.key)}
                onMouseLeave={() => setHovered(null)}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <p style={styles.colTitle}>{col.title}</p>
            <div style={styles.colLinks}>
              {col.links.map((link) => {
                const key = `${col.title}-${link.label}`;
                const isExternal = link.to.startsWith("#");
                return isExternal ? (
                  <a
                    key={key}
                    href={link.to}
                    style={styles.colLink(key)}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={key}
                    to={link.to}
                    style={styles.colLink(key)}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      <div style={styles.bottom}>
        <p style={styles.copy}>Copyright © 2026 HighTech. Tous droits réservés.</p>
        <div style={styles.bottomLinks}>
          {["Confidentialité", "Conditions", "Mentions légales", "Cookies"].map((label) => (
            <a
              key={label}
              href="#"
              style={styles.bottomLink(label)}
              onMouseEnter={() => setHovered(`b-${label}`)}
              onMouseLeave={() => setHovered(null)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
