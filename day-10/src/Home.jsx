import { Link } from "react-router-dom";

function Home() {
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
        <h2>This is Home Page</h2>
        </>
    )
}

export default Home;