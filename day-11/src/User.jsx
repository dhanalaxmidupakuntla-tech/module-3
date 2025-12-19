import { Link, useParams } from "react-router-dom";
import "./index.css"

function User(){
    const {id} = useParams();

    return(
        <>
        <nav>
            <li>
                <Link to = "user/1">User 1</Link>
                <Link to = "user/2">User 2</Link>
                <Link to = "user/3">User 3</Link>
            </li>
        </nav>
        <h2>Welcomw to users dashboard</h2>
        <p>User ID from URL : {id} </p>
        </>
    )
}

export default User;