import { useState } from "react";
import { signIn } from "../auth/login";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        try {
            await signIn(email, password);
            window.location.href = "/dashboard"; // redirect
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /><br />

                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />

                <button type="submit">Login</button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}
