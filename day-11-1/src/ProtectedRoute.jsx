import { Navigate } from "react-router-dom";
import { isAuthenticted } from "./Auth";


function ProtectedRoute({children}){

    if(!isAuthenticted()){
        return <Navigate to="/login/" />
    }

    return children;
}

export default ProtectedRoute