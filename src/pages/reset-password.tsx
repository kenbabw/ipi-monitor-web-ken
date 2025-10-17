import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useSupabase } from "@/providers/supabase-provider";

export function ResetPassword() {
    const { resetPassword } = useSupabase();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);

        try {
            if (!email) {
                setError("Please enter your email");
                return;
            }

            const { error } = await resetPassword(email);

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="ResetPassword">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                {/* Main Content */}
                <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-4 sm:gap-[40px] sm:px-6 sm:py-8">
                    {/* Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-gray-50 sm:h-12 sm:w-12 sm:border-8">
                        <svg className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Title and Description */}
                    <div className="text-center">
                        <h1 className="mb-3 text-2xl leading-[normal] font-bold text-[#1c78bf] text-black not-italic sm:text-[32px]">Forgot password?</h1>
                        <p className="text-xs text-gray-600 sm:text-sm">No worries, we'll send you reset instructions.</p>
                    </div>

                    {/* Form */}
                    {!success ? (
                        <form onSubmit={handleSubmit} className="flex w-full max-w-[360px] flex-col items-center gap-4 sm:gap-6">
                            <div className="flex w-full flex-col gap-4">
                                {/* Error Message */}
                                {error && <div className="w-full rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:text-sm">{error}</div>}

                                {/* Email Field */}
                                <Input
                                    type="email"
                                    label="Email"
                                    value={email}
                                    onChange={(value: string) => setEmail(value)}
                                    placeholder="Enter your email"
                                    className="w-full"
                                />
                            </div>

                            {/* Reset Password Button */}
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                isDisabled={isSubmitting}
                                className="box-border flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[12px] px-[16px] py-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:h-[52px]"
                                style={{
                                    backgroundImage: "linear-gradient(90deg, rgb(255, 155, 0) 0%, rgb(255, 155, 0) 100%)",
                                }}
                            >
                                <span className="text-lg leading-[normal] font-bold whitespace-pre text-white not-italic sm:text-[20px]">
                                    {isSubmitting ? "Sending..." : "Reset password"}
                                </span>
                            </Button>

                            {/* Back to Login Link */}
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                className="flex items-center gap-2 text-xs font-semibold text-gray-600 transition-colors hover:text-gray-900 sm:text-[14px]"
                            >
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to log in
                            </button>
                        </form>
                    ) : (
                        <div className="flex w-full max-w-[360px] flex-col items-center gap-4 text-center sm:gap-6">
                            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-700 sm:p-4 sm:text-sm">
                                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                            </div>

                            {/* Back to Login Button */}
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                className="flex items-center gap-2 text-xs font-semibold text-gray-600 transition-colors hover:text-gray-900 sm:text-[14px]"
                            >
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to log in
                            </button>
                        </div>
                    )}
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
}
