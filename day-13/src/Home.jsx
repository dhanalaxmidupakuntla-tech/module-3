import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate()
    const handleLogout =() => {
        navigate("/");
    }
    return(        
        <>
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Welcome</h2>
                <p>You are in logged in</p>
                <button style={styles.button} onClick={handleLogout}>Logout</button>
            </div>
        </div>
        </>
    )
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #74ebd5, #9face6)"
  },

  card :{
    background: "#ffffff",
    padding: "30px",
    width:"320px",
    borderRadius:"10px",
    textAlign:"center"
  },

  button :{
    marginTop : "20px",
    padding:"10px 20px",
    background:"#ccc",
    color:"Black",
    borderRadius:"5px",
    cursor:"pointer"
  }
}

export default Home;