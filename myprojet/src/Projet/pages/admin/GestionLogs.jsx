import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext.jsx";

const API = "http://localhost:3000/api/admin";

// Traduit "POST /api/admin/produits" en libellé + cible lisibles
function parseAction(action, details) {
  const [method, ...rest] = action.split(" ");
  const path = rest.join(" ");
  const id   = details?.params?.id;
  const nom  = details?.body?.nom;
  const statut = details?.body?.statut || details?.body?.nouveauStatut;

  if (method === "POST"   && path.includes("/produits"))
    return { label: "Création produit",          cible: nom  || "—",          color: "#22c55e" };
  if (method === "PUT"    && path.includes("/produits"))
    return { label: "Modification produit",      cible: nom ? `${nom} (#${id})` : `#${id}`, color: "#f59e0b" };
  if (method === "DELETE" && path.includes("/produits"))
    return { label: "Suppression produit",       cible: `#${id}`,             color: "#ef4444" };
  if (method === "PUT"    && path.includes("/role"))
    return { label: "Changement de rôle",        cible: `utilisateur #${id}`, color: "#8b5cf6" };
  if (method === "DELETE" && path.includes("/utilisateurs"))
    return { label: "Suppression utilisateur",   cible: `#${id}`,             color: "#ef4444" };
  if (method === "PUT"    && path.includes("/commandes"))
    return { label: "Statut commande mis à jour", cible: statut ? `#${id} → ${statut}` : `#${id}`, color: "#3b82f6" };
  return { label: action, cible: "—", color: "#888" };
}

export default function GestionLogs() {
  const { accessToken }         = useContext(UserContext);
  const [onglet, setOnglet]     = useState("actions");
  const [actions, setActions]   = useState([]);
  const [connexions, setConnexions] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur]     = useState("");

  useEffect(() => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const charger = async () => {
      setChargement(true);
      setErreur("");
      try {
        const [resA, resC] = await Promise.all([
          fetch(`${API}/action-logs`, { credentials: "include", headers }),
          fetch(`${API}/logs`,        { credentials: "include", headers }),
        ]);

        if (!resA.ok) {
          const msg = await resA.text().catch(() => resA.status);
          throw new Error(`action-logs : ${resA.status} — ${msg}`);
        }
        if (!resC.ok) {
          const msg = await resC.text().catch(() => resC.status);
          throw new Error(`logs : ${resC.status} — ${msg}`);
        }

        const [a, c] = await Promise.all([resA.json(), resC.json()]);
        setActions(a);
        setConnexions(c);
      } catch (e) {
        setErreur(e.message);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [accessToken]);

  return (
    <div style={s.page}>
      <h1 style={s.title}>📋 Logs</h1>

      {/* Onglets */}
      <div style={s.tabs}>
        <button
          style={{ ...s.tab, ...(onglet === "actions" ? s.tabActive : {}) }}
          onClick={() => setOnglet("actions")}
        >
          Actions admin
          {actions.length > 0 && <span style={s.badge}>{actions.length}</span>}
        </button>
        <button
          style={{ ...s.tab, ...(onglet === "connexions" ? s.tabActive : {}) }}
          onClick={() => setOnglet("connexions")}
        >
          Tentatives de connexion
          {connexions.length > 0 && <span style={s.badge}>{connexions.length}</span>}
        </button>
      </div>

      {erreur    && <p style={s.erreur}>{erreur}</p>}
      {chargement && <p style={s.loading}>Chargement…</p>}

      {/* ── Onglet Actions ───────────────────────────────────────── */}
      {!chargement && onglet === "actions" && (
        actions.length === 0
          ? <p style={s.vide}>Aucune action enregistrée pour le moment.</p>
          : <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Date", "Admin", "Action", "Cible", "Statut HTTP"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {actions.map((l) => {
                    const { label, cible, color } = parseAction(l.action, l.details);
                    const admin = l.user
                      ? `${l.user.prenom} ${l.user.nom}`
                      : `Admin #${l.utilisateur_id}`;
                    const ok = l.details?.statusCode < 400;
                    return (
                      <tr key={l._id}>
                        <td style={s.td}>{new Date(l.date).toLocaleString("fr-FR")}</td>
                        <td style={s.td}>
                          <span style={s.adminName}>{admin}</span>
                          {l.user && <span style={s.email}>{l.user.email}</span>}
                        </td>
                        <td style={s.td}>
                          <span style={{ ...s.actionBadge, background: color + "18", color }}>
                            {label}
                          </span>
                        </td>
                        <td style={{ ...s.td, fontWeight: 600 }}>{cible}</td>
                        <td style={s.td}>
                          <span style={{
                            ...s.statusBadge,
                            background: ok ? "#dcfce7" : "#fee2e2",
                            color:      ok ? "#166534" : "#991b1b",
                          }}>
                            {l.details?.statusCode || "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
      )}

      {/* ── Onglet Connexions ────────────────────────────────────── */}
      {!chargement && onglet === "connexions" && (
        connexions.length === 0
          ? <p style={s.vide}>Aucune tentative enregistrée.</p>
          : <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Utilisateur", "IP", "Tentatives", "Dernière tentative", "Statut"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {connexions.map((l) => {
                    const locked = l.LockedUntil && new Date(l.LockedUntil) > new Date();
                    return (
                      <tr key={l.id}>
                        <td style={s.td}>
                          {l.User
                            ? <><span style={s.adminName}>{l.User.prenom} {l.User.nom}</span><span style={s.email}>{l.User.email}</span></>
                            : `User #${l.idUser}`}
                        </td>
                        <td style={s.td}>{l.ip_adresse || "—"}</td>
                        <td style={s.td}>{l.AttemptCount}</td>
                        <td style={s.td}>{l.LastAttemptAt ? new Date(l.LastAttemptAt).toLocaleString("fr-FR") : "—"}</td>
                        <td style={s.td}>
                          <span style={{ ...s.statusBadge, background: locked ? "#fee2e2" : "#dcfce7", color: locked ? "#991b1b" : "#166534" }}>
                            {locked ? "🔒 Bloqué" : "✅ OK"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
      )}
    </div>
  );
}

const s = {
  page:      { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 72px" },
  title:     { fontSize: "28px", fontWeight: 800, color: "#111", marginBottom: "28px", letterSpacing: "-0.02em" },

  tabs:      { display: "flex", gap: "6px", marginBottom: "24px", borderBottom: "2px solid #f0f0f0", paddingBottom: "0" },
  tab:       { padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "#888", borderBottom: "2px solid transparent", marginBottom: "-2px", display: "flex", alignItems: "center", gap: "8px", transition: "color 0.15s" },
  tabActive: { color: "#111", borderBottomColor: "#111" },
  badge:     { background: "#f0f0f0", color: "#555", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "50px" },

  loading:   { color: "#aaa", padding: "40px 0", textAlign: "center" },
  erreur:    { color: "#ef4444", marginBottom: "16px" },
  vide:      { color: "#aaa", padding: "60px 0", textAlign: "center" },

  tableWrap: { overflowX: "auto" },
  table:     { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", fontSize: "13px" },
  th:        { textAlign: "left", padding: "12px 16px", background: "#fafafa", color: "#888", fontWeight: 600, borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap" },
  td:        { padding: "12px 16px", borderTop: "1px solid #f7f7f7", verticalAlign: "middle" },

  adminName:   { display: "block", fontWeight: 600, color: "#111" },
  email:       { display: "block", fontSize: "12px", color: "#aaa" },
  actionBadge: { display: "inline-block", padding: "3px 10px", borderRadius: "50px", fontSize: "12px", fontWeight: 700 },
  statusBadge: { display: "inline-block", padding: "3px 10px", borderRadius: "50px", fontSize: "12px", fontWeight: 700 },
};
