/**
 * GestionUtilisateurs.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page d'administration des utilisateurs.
 * Accessible uniquement aux administrateurs (AdminRoute).
 *
 * Fonctionnalités :
 *   - Liste tous les utilisateurs
 *   - Modifier le rôle d'un utilisateur (client ↔ admin)
 *   - Supprimer un utilisateur (désactivé pour son propre compte)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext.jsx";

function GestionUtilisateurs() {
  const { accessToken, user: currentUser } = useContext(UserContext);
  const [users, setUsers]   = useState([]);
  const [erreur, setErreur] = useState("");

  // Headers communs pour toutes les requêtes admin
  const headers = {
    Authorization:  `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  // Charge la liste des utilisateurs depuis l'API
  const charger = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/utilisateurs", {
        credentials: "include",
        headers,
      });
      if (!res.ok) throw new Error("Erreur lors du chargement.");
      setUsers(await res.json());
    } catch (e) {
      setErreur(e.message);
    }
  };

  useEffect(() => { if (accessToken) charger(); }, [accessToken]);

  // Change le rôle d'un utilisateur
  const changerRole = async (id, role) => {
    await fetch(`http://localhost:3000/api/admin/utilisateurs/${id}/role`, {
      method:      "PUT",
      credentials: "include",
      headers,
      body:        JSON.stringify({ role }),
    });
    charger(); // recharge la liste après modification
  };

  // Supprime un utilisateur après confirmation
  const supprimer = async (id) => {
    if (!confirm("Supprimer cet utilisateur définitivement ?")) return;
    await fetch(`http://localhost:3000/api/admin/utilisateurs/${id}`, {
      method:      "DELETE",
      credentials: "include",
      headers,
    });
    charger();
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    container: { maxWidth: "1000px", margin: "40px auto", padding: "0 20px" },
    title:     { fontSize: "24px", fontWeight: 600, marginBottom: "20px" },
    table:     { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    th:        { textAlign: "left", padding: "12px 16px", background: "#f5f5f7", fontSize: "13px", color: "#888", fontWeight: 600 },
    td:        { padding: "12px 16px", borderTop: "1px solid #f0f0f0", fontSize: "14px" },
    select:    { padding: "5px 8px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px" },
    btnDel:    { padding: "5px 12px", backgroundColor: "#ff4e4e", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "12px" },
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>👥 Gestion des utilisateurs</h2>
      {erreur && <p style={{ color: "red", marginBottom: "12px" }}>{erreur}</p>}

      <table style={s.table}>
        <thead>
          <tr>
            {["Nom", "Prénom", "Email", "Rôle", "Inscrit le", "Actions"].map((h) => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.idUser}>
              <td style={s.td}>{u.nom}</td>
              <td style={s.td}>{u.prenom}</td>
              <td style={s.td}>{u.email}</td>
              <td style={s.td}>
                {/* Sélecteur de rôle — désactivé pour son propre compte */}
                <select
                  style={s.select}
                  value={u.role}
                  onChange={(e) => changerRole(u.idUser, e.target.value)}
                  disabled={u.idUser === currentUser?.idUser}
                >
                  <option value="client">client</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td style={s.td}>
                {new Date(u.date_inscription).toLocaleDateString("fr-FR")}
              </td>
              <td style={s.td}>
                {/* Bouton suppression — masqué pour son propre compte */}
                {u.idUser !== currentUser?.idUser && (
                  <button style={s.btnDel} onClick={() => supprimer(u.idUser)}>
                    Supprimer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionUtilisateurs;
