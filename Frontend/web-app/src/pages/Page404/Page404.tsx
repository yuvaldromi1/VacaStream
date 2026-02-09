import { NavLink } from "react-router-dom";
import "./Page404.css";

function Page404() {
    return (
        <div className="Page404">
            <h2>404</h2>
            <p>Page not found</p>
            <NavLink to="/">Go Home</NavLink>
        </div>
    );
}

export default Page404;
