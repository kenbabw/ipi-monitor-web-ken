import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { supabase } from "@/lib/supabase";
import { useSupabase } from "@/providers/supabase-provider";

export function ChangePassword() {
    const { updatePassword } = useSupabase();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [hasValidSession, setHasValidSession] = useState(false);

    // Handle password reset token from URL and establish session
    useEffect(() => {
        const establishSession = async () => {
            try {
                console.log('=== Password Reset Debug Info ===');
                console.log('Full URL:', window.location.href);
                console.log('URL Hash:', window.location.hash);
                console.log('URL Search:', window.location.search);
                
                // Try to parse from hash first (most common for Supabase)
                let hashParams = new URLSearchParams(window.location.hash.substring(1));
                let accessToken = hashParams.get('access_token');
                let refreshToken = hashParams.get('refresh_token');
                let type = hashParams.get('type');

                // If not in hash, try query parameters
                if (!accessToken) {
                    console.log('No tokens in hash, checking query parameters...');
                    const searchParams = new URLSearchParams(window.location.search);
                    accessToken = searchParams.get('access_token');
                    refreshToken = searchParams.get('refresh_token');
                    type = searchParams.get('type');
                }

                console.log('Token type:', type);
                console.log('Has access token:', !!accessToken);
                console.log('Has refresh token:', !!refreshToken);
                console.log('Access token (first 20 chars):', accessToken?.substring(0, 20));

                // First check if Supabase has already established a session
                const { data: sessionData } = await supabase.auth.getSession();
                console.log('Existing session check:', !!sessionData.session);

                if (sessionData.session) {
                    console.log('Session already exists from Supabase auto-detection');
                    setHasValidSession(true);
                    // Clear the hash/query from URL for security
                    window.history.replaceState(null, '', window.location.pathname);
                    setIsCheckingSession(false);
                    return;
                }

                if (type === 'recovery' && accessToken && refreshToken) {
                    console.log('Attempting to manually set session...');
                    
                    // Manually set the session using the tokens from the URL
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (error) {
                        console.error('Error setting session:', error);
                        setError("Invalid or expired password reset link. Please request a new one.");
                        setHasValidSession(false);
                    } else if (data.session) {
                        console.log('Session established successfully!');
                        console.log('User:', data.session.user.email);
                        setHasValidSession(true);
                        // Clear the hash/query from URL for security
                        window.history.replaceState(null, '', window.location.pathname);
                    } else {
                        console.error('No session returned from setSession');
                        setError("Failed to establish session. Please request a new password reset link.");
                        setHasValidSession(false);
                    }
                } else {
                    console.log('Missing required parameters:');
                    console.log('- type === "recovery":', type === 'recovery');
                    console.log('- has accessToken:', !!accessToken);
                    console.log('- has refreshToken:', !!refreshToken);
                    setError("Invalid password reset link. Please request a new one.");
                    setHasValidSession(false);
                }
            } catch (err) {
                console.error('Error establishing session:', err);
                setError("An error occurred. Please try requesting a new password reset link.");
                setHasValidSession(false);
            } finally {
                setIsCheckingSession(false);
            }
        };

        establishSession();
    }, []);

    const validatePassword = (pwd: string): boolean => {
        // Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one number, and one special character
        const minLength = pwd.length >= 8;
        const hasUppercase = /[A-Z]/.test(pwd);
        const hasLowercase = /[a-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

        return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);

        try {
            if (!password || !confirmPassword) {
                setError("Please fill in all fields");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            if (!validatePassword(password)) {
                setError("Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one number, and one special character.");
                return;
            }

            const { error } = await updatePassword(password);

            if (error) {
                console.error('Update password error:', error);
                setError(error.message || "Failed to update password. Please try again.");
            } else {
                setSuccess(true);
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="ChangePassword">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                {/* Main Content */}
                <div className="flex flex-1 flex-col items-center justify-center gap-[40px] px-4 py-8">
                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-8 border-gray-50">
                        <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>

                    {/* Title and Description */}
                    <div className="text-center">
                        <h1 className="mb-3 text-[32px] leading-[normal] font-bold text-black not-italic">Set new password</h1>
                        <p className="text-gray-600">Your new password must be different to previously used passwords.</p>
                    </div>

                    {/* Loading State */}
                    {isCheckingSession ? (
                        <div className="flex w-full max-w-[360px] flex-col items-center gap-4">
                            <div className="text-gray-600">Verifying reset link...</div>
                        </div>
                    ) : !hasValidSession && error ? (
                        <div className="flex w-full max-w-[360px] flex-col items-center gap-6 text-center">
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
                            <button
                                type="button"
                                onClick={() => navigate("/reset-password")}
                                className="flex items-center gap-2 text-[14px] font-semibold text-gray-600 transition-colors hover:text-gray-900"
                            >
                                Request new reset link
                            </button>
                        </div>
                    ) : !success ? (
                        <form onSubmit={handleSubmit} className="flex w-full max-w-[360px] flex-col items-center gap-6">
                            <div className="flex w-full flex-col gap-5">
                                {/* Error Message */}
                                {error && <div className="w-full rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                                {/* Password Field */}
                                <div className="flex flex-col gap-1.5">
                                    <Input
                                        type="password"
                                        label="Password"
                                        value={password}
                                        onChange={(value: string) => setPassword(value)}
                                        placeholder="Enter your password"
                                        className="w-full"
                                    />
                                    <p className="text-xs text-gray-600">
                                        Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one number, and one special
                                        character.
                                    </p>
                                </div>

                                {/* Confirm Password Field */}
                                <Input
                                    type="password"
                                    label="Confirm password"
                                    value={confirmPassword}
                                    onChange={(value: string) => setConfirmPassword(value)}
                                    placeholder="Confirm your password"
                                    className="w-full"
                                />
                            </div>

                            {/* Reset Password Button */}
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                isDisabled={isSubmitting}
                                className="box-border flex h-[52px] w-full items-center justify-center gap-[10px] rounded-[12px] px-[16px] py-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                                style={{
                                    backgroundImage: "linear-gradient(90deg, rgb(255, 155, 0) 0%, rgb(255, 155, 0) 100%)",
                                }}
                            >
                                <span className="text-[20px] leading-[normal] font-bold whitespace-pre text-white not-italic">
                                    {isSubmitting ? "Updating..." : "Reset password"}
                                </span>
                            </Button>

                            {/* Back to Login Link */}
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                className="flex items-center gap-2 text-[14px] font-semibold text-gray-600 transition-colors hover:text-gray-900"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to log in
                            </button>
                        </form>
                    ) : (
                        <div className="flex w-full max-w-[360px] flex-col items-center gap-6 text-center">
                            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                                Your password has been successfully updated! Redirecting to login...
                            </div>
                        </div>
                    )}
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
}
