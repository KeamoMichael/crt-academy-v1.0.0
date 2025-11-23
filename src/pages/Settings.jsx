import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { updateEmail } from "../auth/updateEmail";
import { updatePassword } from "../auth/updatePassword";
import { updateUsername, uploadProfileIcon } from "../auth/updateProfile";
import { supabase } from "../lib/supabaseClient";

export default function Settings() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Form states
    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [profileIcon, setProfileIcon] = useState(null);
    const [profileIconPreview, setProfileIconPreview] = useState(null);

    // Loading and error states
    const [emailLoading, setEmailLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [iconLoading, setIconLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [iconError, setIconError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (user) {
            // Fetch user profile data
            supabase
                .from('user_profile')
                .select('username, profile_icon')
                .eq('user_id', user.id)
                .single()
                .then(({ data, error }) => {
                    if (!error && data) {
                        setUsername(data.username || "");
                        setNewUsername(data.username || "");
                        setProfileIconPreview(data.profile_icon || null);
                    }
                    setEmail(user.email || "");
                    setNewEmail(user.email || "");
                    setProfileLoading(false);
                });
        }
    }, [user]);

    // Handle email update
    async function handleEmailUpdate(e) {
        e.preventDefault();
        setEmailLoading(true);
        setEmailError("");
        setSuccessMessage("");

        if (!newEmail || newEmail === email) {
            setEmailError("Please enter a new email address");
            setEmailLoading(false);
            return;
        }

        try {
            await updateEmail(newEmail);
            setEmail(newEmail);
            setSuccessMessage("Email updated successfully! Please check your new email for verification.");
        } catch (err) {
            setEmailError(err.message || "Failed to update email");
        } finally {
            setEmailLoading(false);
        }
    }

    // Handle password update
    async function handlePasswordUpdate(e) {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError("");
        setSuccessMessage("");

        if (!newPassword || !confirmPassword) {
            setPasswordError("Please fill in all password fields");
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            setPasswordLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            setPasswordLoading(false);
            return;
        }

        try {
            await updatePassword(newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setSuccessMessage("Password updated successfully!");
        } catch (err) {
            setPasswordError(err.message || "Failed to update password");
        } finally {
            setPasswordLoading(false);
        }
    }

    // Handle username update
    async function handleUsernameUpdate(e) {
        e.preventDefault();
        setUsernameLoading(true);
        setUsernameError("");
        setSuccessMessage("");

        if (!newUsername || newUsername.trim() === "") {
            setUsernameError("Username cannot be empty");
            setUsernameLoading(false);
            return;
        }

        if (newUsername === username) {
            setUsernameError("Please enter a new username");
            setUsernameLoading(false);
            return;
        }

        try {
            await updateUsername(user.id, newUsername.trim());
            setUsername(newUsername.trim());
            setSuccessMessage("Username updated successfully!");
        } catch (err) {
            if (err.code === '23505') {
                setUsernameError("Username already taken. Please choose another.");
            } else {
                setUsernameError(err.message || "Failed to update username");
            }
        } finally {
            setUsernameLoading(false);
        }
    }

    // Handle profile icon upload
    async function handleIconUpload(e) {
        e.preventDefault();
        setIconLoading(true);
        setIconError("");
        setSuccessMessage("");

        if (!profileIcon) {
            setIconError("Please select an image file");
            setIconLoading(false);
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(profileIcon.type)) {
            setIconError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
            setIconLoading(false);
            return;
        }

        // Validate file size (max 5MB)
        if (profileIcon.size > 5 * 1024 * 1024) {
            setIconError("Image size must be less than 5MB");
            setIconLoading(false);
            return;
        }

        try {
            const iconUrl = await uploadProfileIcon(user.id, profileIcon);
            setProfileIconPreview(iconUrl);
            setProfileIcon(null);
            setSuccessMessage("Profile icon updated successfully!");
        } catch (err) {
            setIconError(err.message || "Failed to upload profile icon");
        } finally {
            setIconLoading(false);
        }
    }

    // Handle file selection
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            setProfileIcon(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileIconPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    if (authLoading || profileLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
                        <svg className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-emerald-700 text-sm font-medium">{successMessage}</p>
                    </div>
                )}

                {/* Profile Icon Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile Icon</h2>
                    <div className="flex items-start space-x-6">
                        {/* Current/Preview Icon */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                                    {profileIconPreview ? (
                                        <img
                                            src={profileIconPreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600">
                                            <span className="text-4xl font-bold text-white">
                                                {username ? username.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Upload Form */}
                        <div className="flex-1">
                            <form onSubmit={handleIconUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Upload New Icon
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleFileSelect}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                        disabled={iconLoading}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
                                    </p>
                                </div>

                                {iconError && (
                                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2">
                                        <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-600 text-sm">{iconError}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={iconLoading || !profileIcon}
                                    className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {iconLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <span>Upload Icon</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Username Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Username</h2>
                    <form onSubmit={handleUsernameUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username || "Not set"}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="newUsername" className="block text-sm font-semibold text-gray-700 mb-2">
                                New Username
                            </label>
                            <input
                                type="text"
                                id="newUsername"
                                value={newUsername}
                                onChange={(e) => {
                                    setNewUsername(e.target.value);
                                    setUsernameError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="Enter new username"
                                disabled={usernameLoading}
                            />
                        </div>
                        {usernameError && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2">
                                <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-600 text-sm">{usernameError}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={usernameLoading || !newUsername || newUsername === username}
                            className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {usernameLoading ? "Updating..." : "Update Username"}
                        </button>
                    </form>
                </div>

                {/* Email Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Email Address</h2>
                    <form onSubmit={handleEmailUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="currentEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Email
                            </label>
                            <input
                                type="email"
                                id="currentEmail"
                                value={email}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="newEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                                New Email
                            </label>
                            <input
                                type="email"
                                id="newEmail"
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value);
                                    setEmailError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="Enter new email address"
                                disabled={emailLoading}
                            />
                        </div>
                        {emailError && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2">
                                <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-600 text-sm">{emailError}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={emailLoading || !newEmail || newEmail === email}
                            className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {emailLoading ? "Updating..." : "Update Email"}
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Password</h2>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setPasswordError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="Enter new password"
                                disabled={passwordLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setPasswordError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="Confirm new password"
                                disabled={passwordLoading}
                            />
                        </div>
                        {passwordError && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2">
                                <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-600 text-sm">{passwordError}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={passwordLoading || !newPassword || !confirmPassword}
                            className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {passwordLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

