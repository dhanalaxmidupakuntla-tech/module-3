function Login(){
    return(
        <>
        <div style={styles.container}>
            <div style={styles.card}></div>
        </div>
        </>
    )
}
const styles ={
    container:{
        height: "100vh",
        display:"flex",
        justifyContent: "center",
        aligenItems: "center",
        background:"linear-gradient(to right, #74ebd5, #9face6 )"
    }

    card: {
        background:"#ffffff",
        padding: "30px",
        width:"320px",
        borderRadius:"10px",
        textAlign:"center"
    }
}


export default Login;