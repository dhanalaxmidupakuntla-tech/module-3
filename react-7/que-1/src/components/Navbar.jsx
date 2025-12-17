import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/home" className="link">Home</NavLink>
      <NavLink to="/aboutus" className="link">About Us</NavLink>
      <NavLink to="/todos" className="link">Todos</NavLink>
    </nav>
  );
}

export default Navbar;
