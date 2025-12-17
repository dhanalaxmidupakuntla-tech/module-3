import { Link } from "react-router-dom";

function Contact(){
    return(
        <>
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/about">About</Link> |{" "}
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>
        </nav>
        
        <h2>My Contact Section</h2>
    </>
    )
}

export default Contact;