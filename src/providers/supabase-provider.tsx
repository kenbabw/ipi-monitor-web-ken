import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface SupabaseContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUpWithProfile: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
    updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabase() {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error("useSupabase must be used within a SupabaseProvider");
    }
    return context;
}

interface SupabaseProviderProps {
    children: React.ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { error };
    };

    const signUpWithProfile = async (email: string, password: string, firstName: string, lastName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { error };
        }

        // If user was created successfully, create their profile
        if (data.user) {
            // Import the untyped client for profile creation
            const { supabaseUntyped } = await import("@/lib/supabase");
            const { error: profileError } = await supabaseUntyped.from("app_user").insert({
                auth_user: data.user.id,
                user_first_name: firstName,
                user_last_name: lastName,
            });

            if (profileError) {
                // Note: User was created in auth but profile creation failed
                console.error("Profile creation failed:", profileError);
            }
        }

        return { error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/change-password`,
        });
        return { error };
    };

    const updatePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        return { error };
    };

    const value: SupabaseContextType = {
        user,
        session,
        loading,
        signIn,
        signUp,
        signUpWithProfile,
        signOut,
        resetPassword,
        updatePassword,
    };

    return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}
