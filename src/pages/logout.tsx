import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";
import { Button } from "@/components/base/buttons/button";
import { useSupabase } from "@/providers/supabase-provider";

export function Logout() {
    const navigate = useNavigate();
    const { signOut } = useSupabase();
    const [isLoggingOut, setIsLoggingOut] = useState(true);
    const [logoutAttempted, setLogoutAttempted] = useState(false);

    // Ensure user is signed out when this page loads
    useEffect(() => {
        if (logoutAttempted) return;

        const performLogout = async () => {
            setLogoutAttempted(true);
            try {
                await signOut();
                // Give a moment for the auth state to update
                await new Promise((resolve) => setTimeout(resolve, 500));
            } catch (err) {
                console.error("Error during logout:", err);
            } finally {
                setIsLoggingOut(false);
            }
        };

        performLogout();
    }, [signOut, logoutAttempted]);

    const handleLoginClick = () => {
        navigate("/login");
    };

    // Show loading state while logging out
    if (isLoggingOut) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-[#1c78bf]">Logging out...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="Logout">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                {/* Main Content */}
                <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-4 sm:gap-[40px] sm:px-6 sm:py-8">
                    {/* Success Message */}
                    <h1 className="text-center text-2xl leading-[normal] font-bold whitespace-pre text-[#1c78bf] not-italic sm:text-[32px]">
                        You have successfully logged out of IPI Monitor!
                    </h1>

                    {/* Login Button */}
                    <Button
                        onClick={handleLoginClick}
                        className="box-border flex h-[48px] items-center justify-center gap-[10px] rounded-[12px] px-[16px] py-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:h-[52px]"
                        style={{
                            backgroundImage: "linear-gradient(90deg, rgb(255, 155, 0) 0%, rgb(255, 155, 0) 100%)",
                        }}
                    >
                        <span className="text-lg leading-[normal] font-bold whitespace-pre text-white not-italic sm:text-[20px]">Login</span>
                    </Button>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
}
