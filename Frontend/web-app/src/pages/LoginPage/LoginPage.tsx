import { useState, type FormEvent } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAppDispatch, login } from "../../store";
import { authService } from "../../services/auth.service";
import { notyf } from "../../utils/notyf";
import { getErrorMessage } from "../../utils/error-helper";
import "./LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        // Client-side validation:
        if (!email || !password) {
            setError("All fields are required.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (password.length < 4) {
            setError("Password must be at least 4 characters.");
            return;
        }

        try {
            setLoading(true);
            const token = await authService.login({ email, password });
            dispatch(login(token));
            notyf.success("Welcome back!");
            navigate("/vacations");
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Login failed. Please try again."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="LoginPage">
            <form onSubmit={handleSubmit} className="AuthForm">
                <h2>Login</h2>

                {error && <div className="ErrorMessage">{error}</div>}

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoFocus
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="AuthLink">
                    Don't have an account? <NavLink to="/register">Register here</NavLink>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
