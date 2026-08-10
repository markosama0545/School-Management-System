import { useState } from "react";
import { login } from "../api/studentApi";
import logo from "../assets/logo.jpg";

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        try {
            const user = await login(username, password);
            onLogin(user);
        } catch (error) {
            setError("Invalid username or password");
        }
    }

    return (
        <main className="login-page">
            {/* ── Brand panel (left) ── */}
            <div className="login-brand">
                <img
                    src={logo}
                    alt="INNUVA IT Solutions"
                    className="login-brand-logo"
                />
                <div className="login-brand-divider" />
                <p className="login-brand-name">
                    <span>INNUVA</span> School Management System
                </p>
                <p className="login-brand-subtitle">
                    Smart school management in one place.
                </p>
            </div>

            {/* ── Login panel (right) ── */}
            <div className="login-panel">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div>
                        <h1 className="login-form-heading">Welcome Back</h1>
                        <p className="login-form-subheading">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <div className="login-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            autoComplete="username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <button type="submit" className="login-submit-button">
                        Sign In
                    </button>
                </form>
            </div>
        </main>
    );
}

export default LoginPage;