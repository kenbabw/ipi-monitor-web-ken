import React, { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { useSupabase } from "@/providers/supabase-provider";

export function AuthExample() {
    const { user, signIn, signUp, signOut, loading } = useSupabase();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);

            if (error) {
                setError(error.message);
            }
        } catch (err) {
            setError("An unexpected error occurred");
        }
    };

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center p-8">Loading...</div>;
    }

    if (user) {
        return (
            <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-bold">Welcome!</h2>
                <p className="mb-4">You are signed in as: {user.email}</p>
                <Button onClick={handleSignOut} color="secondary">
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">{isSignUp ? "Sign Up" : "Sign In"}</h2>

            {error && <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="relative mt-1">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 transition-colors hover:text-gray-700"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => setIsPasswordVisible((previous) => !previous)}
                            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                            aria-pressed={isPasswordVisible}
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                {isPasswordVisible ? (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </>
                                ) : (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.58 10.58a2 2 0 0 0 2.84 2.84M9.36 5.37A9.77 9.77 0 0 1 12 5c6.5 0 10 7 10 7a18.4 18.4 0 0 1-3.64 4.83M6.23 6.23C3.75 7.88 2 12 2 12a18.6 18.6 0 0 0 6.77 6.77"
                                        />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
            </form>

            <div className="mt-4 text-center">
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-indigo-600 hover:text-indigo-500">
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
            </div>
        </div>
    );
}
