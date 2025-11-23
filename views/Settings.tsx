import React, { useState, useEffect } from 'react';
import { useAuth } from './../src/auth/useAuth';
import { updateEmail } from './../src/auth/updateEmail';
import { updatePassword } from './../src/auth/updatePassword';
import { updateUsername, uploadProfileIcon } from './../src/auth/updateProfile';
import { supabase } from './../src/lib/supabaseClient';
import { View } from '../types';

interface SettingsProps {
    onNavigate: (view: View) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [profileIcon, setProfileIcon] = useState<string | null>(null);
    const [profileIconPreview, setProfileIconPreview] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailLoading, setEmailLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [iconLoading, setIconLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [iconError, setIconError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (user) {
            supabase
                .from('user_profile')
                .select('username, profile_icon')
                .eq('user_id', user.id)
                .single()
                .then(({ data, error }) => {
                    if (!error && data) {
                        setUsername(data.username || "");
                        setNewUsername(data.username || "");
                        setProfileIcon(data.profile_icon);
                        setProfileIconPreview(data.profile_icon);
                    }
                    setEmail(user.email || "");
                    setNewEmail(user.email || "");
                    setLoading(false);
                });
        }
    }, [user]);

    const handleEmailUpdate = async (e: React.FormEvent) => {
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
        } catch (err: any) {
            setEmailError(err.message || "Failed to update email");
        } finally {
            setEmailLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
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
            setNewPassword("");
            setConfirmPassword("");
            setSuccessMessage("Password updated successfully!");
        } catch (err: any) {
            setPasswordError(err.message || "Failed to update password");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleUsernameUpdate = async (e: React.FormEvent) => {
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
            if (!user) return;
            await updateUsername(user.id, newUsername.trim());
            setUsername(newUsername.trim());
            setSuccessMessage("Username updated successfully!");
        } catch (err: any) {
            if (err.code === '23505') {
                setUsernameError("Username already taken. Please choose another.");
            } else {
                setUsernameError(err.message || "Failed to update username");
            }
        } finally {
            setUsernameLoading(false);
        }
    };

    const handleIconUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setIconLoading(true);
        setIconError("");
        setSuccessMessage("");

        const fileInput = document.getElementById('profile-icon-input') as HTMLInputElement;
        const file = fileInput?.files?.[0];

        if (!file) {
            setIconError("Please select an image file");
            setIconLoading(false);
            return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setIconError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
            setIconLoading(false);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setIconError("Image size must be less than 5MB");
            setIconLoading(false);
            return;
        }

        try {
            if (!user) return;
            const iconUrl = await uploadProfileIcon(user.id, file);
            setProfileIconPreview(iconUrl);
            setProfileIcon(iconUrl);
            setSuccessMessage("Profile icon updated successfully!");
            fileInput.value = '';
        } catch (err: any) {
            setIconError(err.message || "Failed to upload profile icon");
        } finally {
            setIconLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileIconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <button
                    onClick={() => onNavigate(View.DASHBOARD)}
                    className="text-slate-600 hover:text-slate-900"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
                    <svg className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-emerald-700 text-sm font-medium">{successMessage}</p>
                </div>
            )}

            {/* Profile Icon */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Profile Icon</h2>
                <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 border-4 border-slate-300 flex items-center justify-center">
                            {profileIconPreview ? (
                                <img src={profileIconPreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600">
                                    <span className="text-4xl font-bold text-white">
                                        {username ? username.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <form onSubmit={handleIconUpload} className="space-y-4">
                            <input
                                id="profile-icon-input"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleFileSelect}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                disabled={iconLoading}
                            />
                            {iconError && <p className="text-red-600 text-sm">{iconError}</p>}
                            <button
                                type="submit"
                                disabled={iconLoading}
                                className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {iconLoading ? "Uploading..." : "Upload Icon"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Username */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Username</h2>
                <form onSubmit={handleUsernameUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">New Username</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => {
                                setNewUsername(e.target.value);
                                setUsernameError("");
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            disabled={usernameLoading}
                        />
                    </div>
                    {usernameError && <p className="text-red-600 text-sm">{usernameError}</p>}
                    <button
                        type="submit"
                        disabled={usernameLoading || !newUsername || newUsername === username}
                        className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {usernameLoading ? "Updating..." : "Update Username"}
                    </button>
                </form>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Email Address</h2>
                <form onSubmit={handleEmailUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">New Email</label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => {
                                setNewEmail(e.target.value);
                                setEmailError("");
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            disabled={emailLoading}
                        />
                    </div>
                    {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
                    <button
                        type="submit"
                        disabled={emailLoading || !newEmail || newEmail === email}
                        className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {emailLoading ? "Updating..." : "Update Email"}
                    </button>
                </form>
            </div>

            {/* Password */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Password</h2>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setPasswordError("");
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            disabled={passwordLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordError("");
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            disabled={passwordLoading}
                        />
                    </div>
                    {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
                    <button
                        type="submit"
                        disabled={passwordLoading || !newPassword || !confirmPassword}
                        className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {passwordLoading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

