import { useState } from "react";
import { login } from "../api/studentApi";

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
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>School Management System</h1>
                <h2>Login</h2>

                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    value={username}
                    onChange={(event) =>
                        setUsername(event.target.value)
                    }
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit">Login</button>
            </form>
        </main>
    );
}

export default LoginPage;