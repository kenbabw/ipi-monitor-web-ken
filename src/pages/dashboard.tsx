import React from "react";
import { useNavigate } from "react-router";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";
import { Button } from "@/components/base/buttons/button";
import { useSupabase } from "@/providers/supabase-provider";

export function Dashboard() {
    const { user, signOut } = useSupabase();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (!error) {
            navigate("/");
        }
    };

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="Dashboard">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-8 px-[20px] py-[15px] md:gap-[151px]">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[24px]" />

                {/* Navigation Buttons Section */}
                <div className="flex w-full max-w-7xl justify-end px-[32px] pt-[8px]">
                    <div className="flex items-start gap-[12px]">
                        <Button
                            onClick={() => navigate("/device-information")}
                            className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] transition-colors duration-200 hover:border-[#1c78bf] hover:bg-blue-50 hover:text-[#1c78bf]"
                        >
                            Device Info
                        </Button>
                        <Button 
                            onClick={() => navigate("/chart")}
                            className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] transition-colors duration-200 hover:border-[#1c78bf] hover:bg-blue-50 hover:text-[#1c78bf]"
                        >
                            Graphs
                        </Button>
                        <Button
                            onClick={handleSignOut}
                            className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] transition-colors duration-200 hover:border-[#1c78bf] hover:bg-blue-50 hover:text-[#1c78bf]"
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8">
                    <h1 className="text-[32px] leading-[normal] font-bold text-[#1c78bf] not-italic">IPI Monitor Dashboard</h1>

                    <div className="text-center">
                        <p className="mb-4 text-lg text-gray-700">Welcome, {user?.email}!</p>
                        <p className="text-gray-600">You have successfully logged in to IPI Monitor.</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <p className="text-sm text-gray-500">Your dashboard will display device monitoring data and controls here.</p>
                    </div>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[24px]" />
            </div>
        </div>
    );
}
