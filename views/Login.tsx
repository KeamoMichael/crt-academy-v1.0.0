import React, { useState } from "react";
import { signIn } from "../src/auth/login";
import { View } from "../types";

interface LoginProps {
    onNavigate?: (view: View) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            await signIn(email, password);
            // Auth state will update automatically, App.tsx will handle navigation
            window.location.reload(); // Simple reload to trigger auth check
        } catch (err: any) {
            setError(err.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 auth-bg relative overflow-hidden">
            <div className="flex justify-center mb-12 relative z-10">
                <img 
                    src="/logo.png" 
                    alt="CRT Academy Logo" 
                    className="h-12 w-auto object-contain"
                    style={{ maxHeight: '60px' }}
                />
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 relative z-10 border border-white/50">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                        Welcome
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Sign in to continue to CRT Academy
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 outline-none transition-all bg-gray-50/80 hover:bg-gray-50 placeholder:text-gray-400"
                            required
                            autoComplete="email"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 outline-none transition-all bg-gray-50/80 hover:bg-gray-50 placeholder:text-gray-400"
                                required
                                autoComplete="current-password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
                            <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="w-full px-6 py-3.5 text-white font-semibold rounded-xl transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: '#13b782',
                        }}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign in</span>
                        )}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">New to CRT Academy?</span>
                        </div>
                    </div>

                    {onNavigate && (
                        <button
                            type="button"
                            onClick={() => onNavigate(View.SIGNUP)}
                            className="w-full px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            disabled={loading}
                        >
                            Create an account
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

