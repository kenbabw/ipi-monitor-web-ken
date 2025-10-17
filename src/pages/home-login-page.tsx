import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useSupabase } from "@/providers/supabase-provider";

export function HomeLoginPage() {
    const { signIn, signUp, loading, user } = useSupabase();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp || false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || "/device-information";
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (!email || !password) {
                setError("Please enter both email and password");
                return;
            }

            const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);

            if (error) {
                setError(error.message);
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async () => {
        navigate("/reset-password");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-[#1c78bf]">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="Login">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                {/* Main Content */}
                <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-4 sm:gap-[40px] sm:px-6 sm:py-8">
                    {/* Welcome Title */}
                    <h1 className="whitespace-pre text-2xl font-bold not-italic leading-[normal] text-[#1c78bf] sm:text-[32px]" data-node-id="24:15">
                        Welcome to IPI Monitor!
                    </h1>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 sm:gap-[32px]">
                        <div className="flex w-full shrink-0 flex-col items-start gap-[8px] sm:w-[272px]" data-name="Login Input Fields" data-node-id="25:11">
                            {/* Error Message */}
                            {error && <div className="w-full rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:text-sm">{error}</div>}

                            {/* Username/Email Field */}
                            <Input
                                type="email"
                                label={isSignUp ? "Email" : "Username"}
                                value={String(email || "")}
                                onChange={(value: string) => setEmail(String(value || ""))}
                                placeholder={isSignUp ? "Enter your email" : "Enter your username or email"}
                                className="w-full"
                            />

                            {/* Password Field */}
                            <Input
                                type="password"
                                label="Password"
                                value={String(password || "")}
                                onChange={(value: string) => setPassword(String(value || ""))}
                                placeholder="Enter your password"
                                className="w-full"
                            />

                            {/* Forgot Password Link */}
                            {!isSignUp && (
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-[10px] font-medium not-italic leading-[normal] text-[#aeaeae] transition-colors hover:text-[#1c78bf] sm:text-[12px]"
                                    data-node-id="24:20"
                                >
                                    Forgot your password?
                                </button>
                            )}
                        </div>

                        {/* Login/Sign Up Button */}
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}
                            className="box-border flex h-[48px] items-center justify-center gap-[10px] rounded-[12px] px-[16px] py-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:h-[52px]"
                            style={{
                                backgroundImage: "linear-gradient(90deg, rgb(255, 155, 0) 0%, rgb(255, 155, 0) 100%)",
                            }}
                            data-name="Login Button"
                            data-node-id="69:22"
                        >
                            <span className="whitespace-pre text-lg font-bold not-italic leading-[normal] text-white sm:text-[20px]">
                                {isSubmitting ? (isSignUp ? "Creating Account..." : "Signing In...") : isSignUp ? "Create Account" : "Login"}
                            </span>
                        </Button>
                    </form>

                    {/* Account Actions */}
                    <div
                        className="flex w-full shrink-0 flex-col items-center gap-[16px] text-sm font-medium not-italic leading-[normal] text-[#1c78bf] sm:w-[140px] sm:items-start sm:text-[16px]"
                        data-name="Account/Guest"
                        data-node-id="25:10"
                    >
                        <button
                            type="button"
                            onClick={() => {
                                if (isSignUp) {
                                    setIsSignUp(false);
                                    setError(null);
                                } else {
                                    navigate("/create-account");
                                }
                            }}
                            className="hover:underline"
                            data-node-id="24:21"
                        >
                            {isSignUp ? "Already have an account? Sign in" : "Create an account"}
                        </button>
                        {/* <button
                            type="button"
                            onClick={() => {
                                // Handle guest access - you might want to navigate to a limited version
                                alert("Guest access functionality will be implemented");
                            }}
                            className="hover:underline"
                            data-node-id="24:22"
                        >
                            Continue as guest
                        </button> */}
                    </div>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
}
