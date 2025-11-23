import { useAuth } from "../auth/useAuth";
import { signOut } from "../auth/logout";

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Welcome to CRT Academy</h1>
            <p>Your email: {user.email}</p>

            <button onClick={signOut}>Logout</button>
        </div>
    );
}
