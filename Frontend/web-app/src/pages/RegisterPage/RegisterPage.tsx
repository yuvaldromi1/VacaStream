import { useState, type FormEvent } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAppDispatch, login } from "../../store";
import { authService } from "../../services/auth.service";
import { notyf } from "../../utils/notyf";
import { getErrorMessage } from "../../utils/error-helper";
import "../LoginPage/LoginPage.css";
import "./RegisterPage.css";

function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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
        if (!firstName || !lastName || !email || !password) {
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
            const token = await authService.register({ firstName, lastName, email, password });
            dispatch(login(token));
            notyf.success("Registration successful!");
            navigate("/vacations");
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Registration failed. Please try again."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="RegisterPage">
            <form onSubmit={handleSubmit} className="AuthForm">
                <h2>Register</h2>

                {error && <div className="ErrorMessage">{error}</div>}

                <label>
                    First Name
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        autoFocus
                    />
                </label>

                <label>
                    Last Name
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 4 characters"
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="AuthLink">
                    Already have an account? <NavLink to="/login">Login here</NavLink>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;
