import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../auth/login";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signIn(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 auth-bg relative overflow-hidden">
            {/* Glassmorphism Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-white/50">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <span className="text-sm font-medium text-gray-500">Log in or sign up</span>
                    <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
                    Welcome to CRT Academy
                </h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Email address</label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50/50"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Reset password</a>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50/50"
                            required
                        />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start space-x-3">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                        </div>
                        <label htmlFor="terms" className="text-sm text-gray-600">
                            By logging in, I agree and accept the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                        </label>
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center space-x-3">
                        <input
                            id="remember"
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-600">
                            Remember this device for 30 days
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
                        >
                            Create an account
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Not sure about your choice? Try the <a href="#" className="text-blue-600 hover:underline">Help Center</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
