import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useSupabase } from "@/providers/supabase-provider";

export function CreateAccount() {
    const { signUpWithProfile, loading, user } = useSupabase();
    const navigate = useNavigate();
    const location = useLocation();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number";
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return "Password must contain at least one special character";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Validate all fields
            if (!firstName.trim()) {
                setError("First name is required");
                return;
            }
            if (!lastName.trim()) {
                setError("Last name is required");
                return;
            }
            if (!email.trim()) {
                setError("Email address is required");
                return;
            }
            if (!password) {
                setError("Password is required");
                return;
            }

            // Validate password strength
            const passwordError = validatePassword(password);
            if (passwordError) {
                setError(passwordError);
                return;
            }

            // Check password confirmation
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            // Create account with profile
            const { error } = await signUpWithProfile(email, password, firstName, lastName);

            if (error) {
                setError(error.message);
            } else {
                // Account created successfully
                // Note: Supabase will send a confirmation email
                alert("Account created successfully! Please check your email to verify your account.");
                navigate("/login");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAlreadyHaveAccount = () => {
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-[#1c78bf]">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="CreateAccount">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-8 px-[20px] py-[15px] md:gap-[151px]">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[24px]" />

                {/* Main Content */}
                <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8">
                    {/* Title */}
                    <h1 className="text-[32px] leading-[normal] font-bold text-[#1c78bf] not-italic">Create your Account</h1>

                    {/* Create Account Form */}
                    <form onSubmit={handleSubmit} className="flex w-full max-w-lg flex-col gap-6">
                        {/* Error Message */}
                        {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                        {/* First Name Field */}
                        <Input
                            type="text"
                            label="First Name:"
                            value={firstName}
                            onChange={(value: string) => setFirstName(value)}
                            placeholder="Enter your first name"
                            className="w-full"
                            isRequired
                        />

                        {/* Last Name Field */}
                        <Input
                            type="text"
                            label="Last Name:"
                            value={lastName}
                            onChange={(value: string) => setLastName(value)}
                            placeholder="Enter your last name"
                            className="w-full"
                            isRequired
                        />

                        {/* Email Address Field */}
                        <Input
                            type="email"
                            label="Email Address:"
                            value={email}
                            onChange={(value: string) => setEmail(value)}
                            placeholder="Enter your email address"
                            className="w-full"
                            isRequired
                        />

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <Input
                                type="password"
                                label="Password:"
                                value={password}
                                onChange={(value: string) => setPassword(value)}
                                placeholder="Enter your password"
                                className="w-full"
                                isRequired
                            />
                            <p className="text-xs text-gray-600">
                                Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one number, and one special
                                character.
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <Input
                            type="password"
                            label="Confirm Password:"
                            value={confirmPassword}
                            onChange={(value: string) => setConfirmPassword(value)}
                            placeholder="Confirm your password"
                            className="w-full"
                            isRequired
                        />

                        {/* Create Account Button */}
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}
                            className="mt-4 flex h-[52px] items-center justify-center gap-[10px] rounded-[12px] px-[16px] py-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                            style={{
                                backgroundImage: "linear-gradient(90deg, rgb(255, 155, 0) 0%, rgb(255, 155, 0) 100%)",
                            }}
                        >
                            <span className="text-[20px] leading-[normal] font-bold whitespace-pre text-white not-italic">
                                {isSubmitting ? "Creating Account..." : "Create my account"}
                            </span>
                        </Button>

                        {/* Already Have Account Link */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleAlreadyHaveAccount}
                                className="text-[12px] leading-[normal] font-medium text-[#1c78bf] not-italic hover:underline"
                            >
                                I already have an account
                            </button>
                        </div>
                    </form>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[24px]" />
            </div>
        </div>
    );
}
