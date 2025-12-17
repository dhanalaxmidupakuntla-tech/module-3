import { Link } from "react-router-dom";

function About(){
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
        <h2>My contact section</h2>
        </>
    )
}

export default About;