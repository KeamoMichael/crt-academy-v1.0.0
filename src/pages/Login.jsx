import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../auth/login";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate("/dashboard"); // redirect after login
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />

                <button type="submit">Login</button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}
