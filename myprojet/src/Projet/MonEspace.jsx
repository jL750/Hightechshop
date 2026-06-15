import { useContext } from "react";
import { UserContext } from "./Context/UserContext.jsx";

function MonEspace() {
  const { user, logout } = useContext(UserContext);

  const styles = {
    container: {
      width: "360px",
      margin: "50px auto",
      padding: "40px 45px",
      backgroundColor: "#ffffff",
      border: "1.8px solid #000000",
      borderRadius: "16px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      textAlign: "center",
    },
    title: {
      fontSize: "22px",
      fontWeight: 600,
      marginBottom: "25px",
      color: "#111",
    },
    info: {
      fontSize: "16px",
      margin: "10px 0",
      textAlign: "left",
    },
    button: {
      width: "100%",
      padding: "13px",
      backgroundColor: "#4EA3FF",
      border: "none",
      borderRadius: "25px",
      color: "white",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      marginTop: "20px",
      transition: "background-color 0.3s ease",
    },
  };

  const handleHover = (e) => (e.target.style.backgroundColor = "#3793f5");
  const handleLeave = (e) => (e.target.style.backgroundColor = "#4EA3FF");

  if (!user) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Mon Espace</h2>
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mon Espace</h2>
      <p style={styles.info}>Nom : {user.nom}</p>
      <p style={styles.info}>Prénom : {user.prenom}</p>
      <p style={styles.info}>Email : {user.email}</p>
      <button
        style={styles.button}
        onClick={logout}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        Déconnexion
      </button>
    </div>
  );
}

export default MonEspace;
