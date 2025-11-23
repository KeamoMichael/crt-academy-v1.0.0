import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../auth/login";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            await signIn(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 auth-bg relative overflow-hidden">
            {/* Logo Section - Above the card */}
            <div className="flex justify-center mb-8 relative z-10">
                <img 
                    src="/logo.jpg" 
                    alt="CRT Academy Logo" 
                    className="h-20 w-auto object-contain"
                    style={{ maxHeight: '100px' }}
                />
            </div>

            {/* Glassmorphism Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 relative z-10 border border-white/50 transform transition-all hover:shadow-3xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#13b782' }}></div>
                        <span className="text-sm font-medium text-gray-500">Secure Login</span>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                        Welcome
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Sign in to continue to CRT Academy
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 outline-none transition-all bg-gray-50/80 hover:bg-gray-50 placeholder:text-gray-400"
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#13b782';
                                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(19, 183, 130, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                                required
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    // TODO: Implement forgot password functionality
                                    alert("Forgot password feature coming soon!");
                                }}
                                className="text-sm font-medium transition-colors"
                                style={{ color: '#13b782' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#10a372'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#13b782'}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 outline-none transition-all bg-gray-50/80 hover:bg-gray-50 placeholder:text-gray-400"
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#13b782';
                                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(19, 183, 130, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                                required
                                autoComplete="current-password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.29 3.29L12 12m-3.59-3.59l3.29 3.29M12 12l3.29 3.29m0 0a9.97 9.97 0 011.563-3.029M15.71 15.71L12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center space-x-3">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 focus:ring-2 cursor-pointer"
                            style={{ accentColor: '#13b782' }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = '0 0 0 2px rgba(19, 183, 130, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = '';
                            }}
                            disabled={loading}
                        />
                        <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                            Remember me for 30 days
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 animate-shake">
                            <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="w-full px-6 py-3.5 text-white font-semibold rounded-xl transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                            backgroundColor: '#13b782',
                            boxShadow: '0 10px 15px -3px rgba(19, 183, 130, 0.3), 0 4px 6px -2px rgba(19, 183, 130, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading && email && password) {
                                e.currentTarget.style.backgroundColor = '#10a372';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading && email && password) {
                                e.currentTarget.style.backgroundColor = '#13b782';
                            }
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
                            <>
                                <span>Sign in</span>
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">New to CRT Academy?</span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="w-full px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#13b782';
                            e.currentTarget.style.backgroundColor = 'rgba(19, 183, 130, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '';
                            e.currentTarget.style.backgroundColor = '';
                        }}
                        disabled={loading}
                    >
                        Create an account
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-500">
                        By signing in, you agree to our{" "}
                        <a href="#" className="font-medium underline" style={{ color: '#13b782' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#10a372'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#13b782'}>
                            Terms of Service
                        </a>
                        {" "}and{" "}
                        <a href="#" className="font-medium underline" style={{ color: '#13b782' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#10a372'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#13b782'}>
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
            `}</style>
        </div>
    );
}
