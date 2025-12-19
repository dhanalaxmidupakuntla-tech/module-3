import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    const loginUser = () => {
        localStorage.setItem("login", "false")
        navigate("./dashboard")
    }
    return(
        
        <>
        <h2>Login Page</h2>
        <button onClick={loginUser}>Login</button>
        </>
    )
}

export default Login;