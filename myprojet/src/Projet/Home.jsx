import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ── Tiny hook: observe element entering viewport ── */
function useVisible(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Animated counter ── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useVisible(0.2);
  useEffect(() => {
    if (!visible) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    const isFloat = target.includes(".");
    let start = null;
    const duration = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(isFloat ? (eased * num).toFixed(1) : Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Fade-in section wrapper ── */
function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useVisible(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
function Home() {
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setBannerVisible(true), 100);
    setTimeout(() => setHeroVisible(true), 200);
  }, []);

  const products = [
    {
      id: 1,
      tag: "NOUVEAU",
      tagColor: "#0071e3",
      title: "iPhone 15 Pro Max.",
      sub: "La puissance du titane.",
      price: "À partir de 759 €",
      bg: "#f5f5f7",
      accent: "#0071e3",
      image: "https://rent.loca-images.com/cdn/shop/files/iPhone_15_Pro_Max_Blue_Titanium_1-square_medium_ca51cabc-3ae5-48ec-a6ff-b75484715fb3.jpg?v=1721641598",
    },
    {
      id: 2,
      tag: "TENDANCE",
      tagColor: "#bf4800",
      title: "AirPods Pro 3.",
      sub: "Son. Réinventé.",
      price: "À partir de 249 €",
      bg: "#e8f0fe",
      accent: "#0055d4",
      image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-3-hero-select-202509_FMT_WHH?wid=752&hei=636&fmt=jpeg&qlt=90&.v=1758077264181",
    },
    {
      id: 3,
      tag: "POPULAIRE",
      tagColor: "#515154",
      title: "AirPods Max.",
      sub: "Audio haute fidélité.",
      price: "À partir de 579 €",
      bg: "#fdf2e9",
      accent: "#bf4800",
      image: "https://www.grosbill.com/images_produits/f2005157-818d-48af-bbdb-21fce6dd6dbb.jpg",
    },
    {
      id: 4,
      tag: "PROMO",
      tagColor: "#28a745",
      title: "Casque Bluetooth.",
      sub: "Musique sans limites.",
      price: "À partir de 89,99 €",
      bg: "#f0fdf4",
      accent: "#28a745",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    },
  ];

  const features = [
    { icon: "🚚", label: "Livraison offerte",  sub: "Dès 99 € d'achat" },
    { icon: "↩️", label: "Retours gratuits",   sub: "Sous 30 jours" },
    { icon: "🔒", label: "Paiement sécurisé",  sub: "Visa · PayPal · Apple Pay" },
    { icon: "💬", label: "Support 7j/7",        sub: "Chat & e-mail" },
  ];

  const stats = [
    { num: "500", suffix: "+", label: "Produits" },
    { num: "4",   suffix: "",  label: "Catégories" },
    { num: "12",  suffix: "k+", label: "Clients" },
    { num: "4.8", suffix: "★",  label: "Note moyenne" },
  ];

  const base = {
    fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
    WebkitFontSmoothing: "antialiased",
    backgroundColor: "#fff",
    overflowX: "hidden",
  };

  return (
    <div style={base}>

      {/* ── Announcement banner ── */}
      <div
        style={{
          background: "linear-gradient(90deg, #1a1a1c 0%, #232325 50%, #1a1a1c 100%)",
          textAlign: "center",
          padding: "10px 20px",
          fontSize: "13px",
          color: "#a1a1a6",
          letterSpacing: "-0.01em",
          opacity: bannerVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        🎉 Livraison offerte + 10% de réduction avec le code{" "}
        <span style={{ color: "#0af", fontWeight: "700" }}>BIENVENUE10</span>
        {" "}·{" "}
        <Link to="/catalogue" style={{ color: "#0af", textDecoration: "none", fontWeight: "500" }}>
          Voir le catalogue →
        </Link>
      </div>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(170deg, #ffffff 0%, #f2f6ff 45%, #e8f0fe 100%)",
          padding: "100px 20px 96px",
          textAlign: "center",
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: "-160px", left: "-60px",
          width: "560px", height: "560px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,170,255,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-120px", right: "-80px",
          width: "480px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,113,227,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(0,113,227,0.08)",
            border: "1px solid rgba(0,113,227,0.2)",
            borderRadius: "980px",
            padding: "5px 16px",
            marginBottom: "28px",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#0071e3", display: "inline-block" }} />
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#0071e3", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            HighTech Shop — 2026
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: "700",
            color: "#1d1d1f",
            margin: "0 0 18px",
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          La tech que vous{" "}
          <span style={{
            background: "linear-gradient(135deg, #0af 0%, #0071e3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            méritez.
          </span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "clamp(1rem, 2.2vw, 1.3rem)",
            color: "#6e6e73",
            margin: "0 auto 44px",
            maxWidth: "520px",
            lineHeight: 1.6,
            fontWeight: "400",
            letterSpacing: "-0.01em",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
          }}
        >
          Explorez notre sélection de produits premium. Connexion fluide, expérience exceptionnelle.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}
        >
          <Link
            to="/catalogue"
            style={{
              background: hoveredBtn === "h1"
                ? "linear-gradient(135deg, #29a3ff 0%, #005dbc 100%)"
                : "linear-gradient(135deg, #0af 0%, #0071e3 100%)",
              color: "#fff",
              borderRadius: "980px",
              padding: "14px 32px",
              fontSize: "15px",
              fontWeight: "500",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.25s ease",
              boxShadow: hoveredBtn === "h1"
                ? "0 8px 32px rgba(0,170,255,0.4)"
                : "0 4px 16px rgba(0,113,227,0.3)",
              transform: hoveredBtn === "h1" ? "translateY(-1px)" : "translateY(0)",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={() => setHoveredBtn("h1")}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Découvrir maintenant →
          </Link>
          <Link
            to="/inscription"
            style={{
              backgroundColor: "transparent",
              color: hoveredBtn === "h2" ? "#0071e3" : "#1d1d1f",
              borderRadius: "980px",
              padding: "13px 32px",
              fontSize: "15px",
              fontWeight: "500",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              border: `1.5px solid ${hoveredBtn === "h2" ? "#0071e3" : "#c7c7cc"}`,
              transition: "all 0.25s ease",
              transform: hoveredBtn === "h2" ? "translateY(-1px)" : "translateY(0)",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={() => setHoveredBtn("h2")}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Créer un compte
          </Link>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "56px",
            marginTop: "64px",
            flexWrap: "wrap",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s",
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                fontWeight: "700",
                color: "#1d1d1f",
                margin: "0 0 4px",
                letterSpacing: "-0.03em",
              }}>
                <Counter target={s.num} suffix={s.suffix} />
              </p>
              <p style={{ fontSize: "13px", color: "#86868b", margin: 0, letterSpacing: "-0.01em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section title ── */}
      <FadeIn delay={0} style={{ textAlign: "center", padding: "72px 20px 16px" }}>
        <p style={{
          fontSize: "12px",
          fontWeight: "600",
          color: "#0071e3",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}>
          Nos produits phares
        </p>
        <h2 style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: "700",
          color: "#1d1d1f",
          margin: 0,
          letterSpacing: "-0.03em",
          lineHeight: 1.08,
        }}>
          Conçus pour vous impressionner.
        </h2>
      </FadeIn>

      {/* ── Product grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "12px",
          padding: "28px 12px 12px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {products.map((p, i) => (
          <FadeIn key={p.id} delay={i * 80}>
            <div
              style={{
                backgroundColor: p.bg,
                borderRadius: "24px",
                padding: "44px 32px 0",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                minHeight: "500px",
                cursor: "pointer",
                transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
                transform: hoveredCard === p.id ? "translateY(-8px) scale(1.005)" : "translateY(0) scale(1)",
                boxShadow: hoveredCard === p.id
                  ? `0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)`
                  : "0 2px 8px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={() => setHoveredCard(p.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span style={{
                display: "inline-block",
                backgroundColor: p.tagColor,
                color: "#fff",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                borderRadius: "980px",
                padding: "3px 12px",
                marginBottom: "14px",
              }}>
                {p.tag}
              </span>

              <h2 style={{
                fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                fontWeight: "700",
                color: "#1d1d1f",
                margin: "0 0 8px",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}>
                {p.title}
              </h2>

              <p style={{ fontSize: "15px", color: "#6e6e73", margin: "0 0 6px", fontWeight: "400", letterSpacing: "-0.01em" }}>
                {p.sub}
              </p>

              <p style={{ fontSize: "13px", color: p.accent, fontWeight: "600", margin: "0 0 24px", letterSpacing: "-0.01em" }}>
                {p.price}
              </p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "28px", flexWrap: "wrap" }}>
                <Link
                  to="/catalogue"
                  style={{
                    backgroundColor: "#1d1d1f",
                    color: "#fff",
                    borderRadius: "980px",
                    padding: "9px 20px",
                    fontSize: "13px",
                    fontWeight: "500",
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                    transition: "background 0.2s ease",
                  }}
                >
                  En savoir plus
                </Link>
                <Link
                  to="/catalogue"
                  style={{
                    color: p.accent,
                    fontSize: "13px",
                    fontWeight: "500",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Acheter →
                </Link>
              </div>

              <img
                src={p.image}
                alt={p.title}
                style={{
                  width: "75%",
                  maxWidth: "220px",
                  height: "210px",
                  objectFit: "contain",
                  marginTop: "auto",
                  display: "block",
                  transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: hoveredCard === p.id ? "scale(1.08) translateY(-4px)" : "scale(1) translateY(0)",
                  filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.10))",
                }}
              />
            </div>
          </FadeIn>
        ))}
      </div>

      {/* ── Features strip ── */}
      <FadeIn delay={0} style={{ marginTop: "12px" }}>
        <div
          style={{
            backgroundColor: "#f5f5f7",
            borderTop: "1px solid #e5e5ea",
            borderBottom: "1px solid #e5e5ea",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {features.map((item, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 200px",
                padding: "32px 20px",
                textAlign: "center",
                borderRight: i < features.length - 1 ? "1px solid #e5e5ea" : "none",
              }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: "10px" }}>{item.icon}</div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1d1d1f", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                {item.label}
              </p>
              <p style={{ fontSize: "12px", color: "#86868b", margin: 0, letterSpacing: "-0.01em" }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ── CTA banner ── */}
      <FadeIn delay={0}>
        <div
          style={{
            margin: "12px",
            borderRadius: "24px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 40%, #0f2240 100%)",
            padding: "80px 40px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{
            position: "absolute", top: "-80px", left: "20%",
            width: "300px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,170,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#0af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
            Nouvelle collection
          </p>
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: "700",
            color: "#f5f5f7",
            margin: "0 0 16px",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}>
            Découvrez les dernières nouveautés.
          </h2>
          <p style={{ fontSize: "15px", color: "#86868b", margin: "0 0 36px", maxWidth: "460px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Des produits soigneusement sélectionnés pour une expérience tech sans compromis.
          </p>
          <Link
            to="/catalogue"
            style={{
              background: hoveredBtn === "cta"
                ? "linear-gradient(135deg, #29a3ff 0%, #005dbc 100%)"
                : "linear-gradient(135deg, #0af 0%, #0071e3 100%)",
              color: "#fff",
              borderRadius: "980px",
              padding: "14px 32px",
              fontSize: "15px",
              fontWeight: "500",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.25s ease",
              boxShadow: hoveredBtn === "cta" ? "0 8px 32px rgba(0,170,255,0.4)" : "0 4px 16px rgba(0,113,227,0.3)",
              transform: hoveredBtn === "cta" ? "translateY(-2px)" : "translateY(0)",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={() => setHoveredBtn("cta")}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Explorer le catalogue →
          </Link>
        </div>
      </FadeIn>

      <div style={{ height: "12px" }} />
    </div>
  );
}

export default Home;
