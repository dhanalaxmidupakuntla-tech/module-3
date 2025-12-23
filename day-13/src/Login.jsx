import { useState, useReducer } from "react";

const initialState = {
  loading : false,
  success : false,
  error : ""
};

function reducer(state, action){
  switch (action.type) {
    case "LOGIN":
      return {loading: true, success:true, error:""};
    
    case "SUCCESS":
      return {loading: false, success: true, error:""};
    
    case"FAIL" :
    return {loading:false, success:false, error:"wrong username or password"}
  
    default:
      return state;
  }
}

function Login() {
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //useReducer
    const [state, dispatch] = useReducer(reducer, initialState);


    const handleLogin = () => {
        //credentials
      dispatch({type:"LOGIN"});

        
      setTimeout(() => {
        if(userName ==="admin" && password==="1234"){
          dispatch({type:"SUCCESS"})
        }
        else{
          dispatch({type:"FAIL"})
        }
      }, 1000)
    }
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login</h2>
                <input type="text" placeholder="Enter Username" style={styles.input} value={userName}
                onChange={(e) => setUsername(e.target.value)} /><br />
                <input type="password" placeholder="Enter Password" style={styles.input} value={password}
                 onChange={(e) => setPassword(e.target.value)} />
                <button style={styles.button} onClick={handleLogin}>Login</button>
                {state.loading && <p>Loading...</p>}
                {state.success && <p>Login successful</p>}
                {state.error && <p style={styles.error}>{state.error}</p>}
            </div>
        </div>
    );
}

const styles = {
  container: {
    height: "100vh",
    width:"100vw",
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

  title: {
    marginBottom: "20px"
  },

  input :{
    width:"100%",
    padding:"10px",
    marginBottom:"15px",
    borderRadius:"5px",
    border:"1px solid #ccc"
  },

  button :{
    width:"100%",
    padding:"10px",
    backgroundColor: "#6c63ff",
    color: "white",
    border:"none",
    borderRadius:"5px",
    cursor:"pointer"
  },

  error: {
    color:"Red",
    marginBottom:"10px"
  },

  hint:{
    marginTop:"15px",
    fontSize: "12px",
    color: "#509"
  }
};

export default Login;
