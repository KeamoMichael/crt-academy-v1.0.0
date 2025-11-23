import { useState } from "react";
import { signUp } from "../auth/signup";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [symbol, setSymbol] = useState("XAUUSD");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSignup(e) {
        e.preventDefault();
        try {
            await signUp(email, password, username, symbol);
            setSuccess("Account created! Check your email to verify.");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Create Account</h1>

            <form onSubmit={handleSignup}>
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

                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /><br />

                <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                    <option value="XAUUSD">XAUUSD</option>
                    <option value="USTEC">USTEC</option>
                    <option value="NAS100">NAS100</option>
                </select><br />

                <button type="submit">Sign Up</button>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
            </form>
        </div>
    );
}
