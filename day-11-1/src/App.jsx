import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

function App(){


    return(
        <>
        <BrowserRouter>
        <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
        </nav>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            {/* Protected Route*/}
            <Route path="/dashboard" element ={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }
            />
        </Routes>
        </BrowserRouter>
        </>
    )
}

export default App;