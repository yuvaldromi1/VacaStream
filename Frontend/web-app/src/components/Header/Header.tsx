import { useNavigate, NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch, logout } from "../../store";
import "./Header.css";

function Header() {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logout());
        navigate("/login");
    }

    return (
        <header className="Header">
            <div className="HeaderContent">
                <NavLink to="/" className="Logo">🌴 VacaStream</NavLink>

                <nav className="Nav">
                    {!user && (
                        <>
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/register">Register</NavLink>
                        </>
                    )}

                    {user && user.role === "user" && (
                        <NavLink to="/vacations">Vacations</NavLink>
                    )}

                    {user && user.role === "admin" && (
                        <>
                            <NavLink to="/admin/vacations">Vacations</NavLink>
                            <NavLink to="/admin/vacations/add">Add Vacation</NavLink>
                            <NavLink to="/admin/reports">Reports</NavLink>
                        </>
                    )}

                    {user && (
                        <div className="UserSection">
                            <span className="Welcome">Hello, {user.firstName} {user.lastName}</span>
                            <button onClick={handleLogout} className="LogoutBtn">Logout</button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
