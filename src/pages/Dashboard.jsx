import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { signOut } from "../auth/logout";

export default function Dashboard() {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div style={{ padding: 20 }}>
            <h1>Welcome to CRT Academy</h1>
            <p>You are logged in as: {user.email}</p>

            <button onClick={signOut}>Logout</button>
        </div>
    );
}
