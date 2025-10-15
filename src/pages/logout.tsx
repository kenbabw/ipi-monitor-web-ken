import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";
import { Button } from "@/components/base/buttons/button";
import { useSupabase } from "@/providers/supabase-provider";

export function Logout() {
    const navigate = useNavigate();
    const { signOut } = useSupabase();

    // Ensure user is signed out when this page loads
    useEffect(() => {
        signOut().catch((err) => {
            console.error("Error during logout:", err);
        });
    }, [signOut]);

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="Logout">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                {/* Main Content */}
                <div className="flex flex-1 flex-col items-center justify-center gap-[40px] px-4 py-8">
                    {/* Success Message */}
                    <h1 className="text-center text-[32px] leading-[normal] font-bold whitespace-pre text-[#1c78bf] not-italic">
                        You have successfully logged out of IPI Monitor!
                    </h1>

                    {/* Login Button */}
                    <Button
                        onClick={handleLoginClick}
                        className="box-border flex h-[52px] items-center justify-center gap-[10px] rounded-[12px] px-[16px] py-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                        style={{
                            backgroundImage: "linear-gradient(90deg, rgb(255, 155, 0) 0%, rgb(255, 155, 0) 100%)",
                        }}
                    >
                        <span className="text-[20px] leading-[normal] font-bold whitespace-pre text-white not-italic">Login</span>
                    </Button>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
}
