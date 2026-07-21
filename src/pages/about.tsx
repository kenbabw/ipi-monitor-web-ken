import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Footer } from "../components/application/footer/footer";
import { Header } from "../components/application/header/header";
import { Button } from "../components/base/buttons/button";
import { supabase } from "../lib/supabase";
import { useSupabase } from "../providers/supabase-provider";

export function About() {
    const navigate = useNavigate();
    const { user, signOut } = useSupabase();
    const [userName, setUserName] = useState<string>("");

    const fetchUserData = useCallback(async () => {
        if (!user) return;

        try {
            const { data: userData, error: userError } = await supabase.from("app_user").select("user_first_name").eq("auth_user", user.id).single();

            if (userError) throw userError;

            setUserName((userData as any)?.user_first_name || user.email || "User");
        } catch (err) {
            console.error("Error fetching user data:", err);
            setUserName(user.email || "User");
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchUserData();
    }, [user, navigate, fetchUserData]);

    const handleLogout = () => {
        localStorage.removeItem("selectedDeviceId");
        navigate("/logout", { replace: true });
        signOut().catch((err) => {
            console.error("Error during logout:", err);
        });
    };

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="About">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                <div className="flex w-full flex-1 flex-col px-4 pt-2 pb-4 sm:px-6 sm:pt-2 sm:pb-6 lg:px-8 lg:pt-2 lg:pb-8">
                    <div className="mb-4 sm:mb-6">
                        <div className="mb-4 flex flex-col gap-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col items-start">
                                <p className="text-lg font-semibold text-[#181d27] sm:text-xl">Welcome back, {userName}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <Button
                                    onClick={() => navigate("/device-information")}
                                    className="!bg-[rgb(255,155,0)] px-3 py-2 text-sm font-semibold text-white hover:!bg-[#1c78bf] sm:px-4"
                                >
                                    Device Info
                                </Button>
                                <Button
                                    onClick={() => navigate("/chart")}
                                    className="!bg-[rgb(255,155,0)] px-3 py-2 text-sm font-semibold text-white hover:!bg-[#1c78bf] sm:px-4"
                                >
                                    Charts
                                </Button>
                                <Button className="!bg-[rgb(156,163,175)] px-3 py-2 text-sm font-semibold text-white sm:px-4">About</Button>
                                <Button
                                    onClick={handleLogout}
                                    className="!bg-[rgb(255,155,0)] px-3 py-2 text-sm font-semibold text-white hover:!bg-[#1c78bf] sm:px-4"
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto w-full max-w-6xl rounded-xl border border-gray-200 bg-white p-6 text-[#222] sm:p-10">
                        <h1 className="mb-2 text-3xl font-bold text-[#181d27]">Privacy Policy - IPIMonitor</h1>
                        <p className="mb-8 text-sm text-[#666]">
                            Info-Power International, Inc.
                            <br />
                            Effective date: July 1, 2026
                        </p>

                        <p className="mb-6 leading-8">
                            This Privacy Policy describes how Info-Power International, Inc. ("we," "us," or "our") collects, uses, and protects information
                            when you use the IPIMonitor mobile application (the "App"). IPIMonitor displays sensor device information and temperature, humidity,
                            and dew point readings gathered from your local sensor devices, presents this data in graphs for trend analysis, and displays high
                            and low temperature thresholds.
                        </p>

                        <h2 className="mt-7 mb-3 border-b border-gray-200 pb-2 text-xl font-semibold text-[#181d27]">1. Information We Collect</h2>
                        <p className="mb-3 leading-8">
                            <strong>Account Information.</strong> When you create an account, we collect information such as your name, email address, and login
                            credentials. Passwords are stored in encrypted form.
                        </p>
                        <p className="mb-3 leading-8">
                            <strong>Sensor Data.</strong> The App displays sensor device information and environmental readings (temperature, humidity, and dew
                            point) that you gather from your own local sensor devices. This data is associated with your account and stored on our cloud backend
                            so it can be displayed and graphed in the App.
                        </p>
                        <p className="mb-6 leading-8">
                            <strong>We do not collect:</strong> your device's location, contacts, photos, browsing history, or advertising identifiers. The App
                            contains no advertising.
                        </p>

                        <h2 className="mt-7 mb-3 border-b border-gray-200 pb-2 text-xl font-semibold text-[#181d27]">2. How We Use Your Information</h2>
                        <ul className="mb-4 list-disc space-y-2 pl-6 leading-8">
                            <li>To create and manage your account and authenticate you when you sign in.</li>
                            <li>To store, display, and graph your sensor data, including trend analysis and high/low temperature thresholds.</li>
                            <li>To operate, maintain, secure, and improve the App and our services.</li>
                            <li>To respond to your support requests.</li>
                        </ul>
                        <p className="mb-6 leading-8">We do not use your information for advertising, and we do not sell your personal information.</p>

                        <h2 className="mt-7 mb-3 border-b border-gray-200 pb-2 text-xl font-semibold text-[#181d27]">3. Data Storage and Sharing</h2>
                        <p className="mb-3 leading-8">
                            Your account information and sensor data are stored on our cloud servers. We may use trusted third-party hosting and infrastructure
                            providers to operate these servers; such providers process data only on our behalf and are not permitted to use it for their own
                            purposes.
                        </p>
                        <p className="mb-6 leading-8">
                            We do not share your personal information with third parties except: (a) with service providers who help us operate the App as
                            described above; (b) when required by law or legal process; or (c) to protect the rights, safety, or property of our users or the
                            public.
                        </p>

                        <h2 className="mt-7 mb-3 border-b border-gray-200 pb-2 text-xl font-semibold text-[#181d27]">4. Data Security</h2>
                        <p className="mb-6 leading-8">
                            We use reasonable administrative, technical, and physical safeguards to protect your information, including encryption of data in
                            transit. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.
                        </p>

                        <h2 className="mt-7 mb-3 border-b border-gray-200 pb-2 text-xl font-semibold text-[#181d27]">5. Data Retention and Deletion</h2>
                        <p className="mb-6 leading-8">
                            We retain your account information and sensor data for as long as your account is active. You may request deletion of your account
                            and associated data at any time by contacting us at the email address below. Upon a verified request, we will delete your personal
                            data unless we are required by law to retain it.
                        </p>

                        <h2 className="mt-7 mb-3 border-b border-gray-200 pb-2 text-xl font-semibold text-[#181d27]">6. Your Rights</h2>
                        <p className="mb-6 leading-8">
                            Depending on where you live, you may have the right to access, correct, export, or delete your personal information, or to object to
                            or restrict certain processing. To exercise these rights, contact us at the email address below. We will respond within the
                            timeframe required by applicable law (including, where applicable, the EU/UK General Data Protection Regulation and the California
                            Consumer Privacy Act).
                        </p>

                        <h2 className="mt-7 mb-3 border-b border-gray-200 pb-2 text-xl font-semibold text-[#181d27]">7. Children's Privacy</h2>
                        <p className="mb-6 leading-8">
                            The App is not directed at children under 13 (or the equivalent minimum age in your jurisdiction), and we do not knowingly collect
                            personal information from children. If you believe a child has provided us personal information, contact us and we will delete it.
                        </p>

                        <h2 className="mt-7 mb-3 border-b border-gray-200 pb-2 text-xl font-semibold text-[#181d27]">8. Changes to This Policy</h2>
                        <p className="mb-6 leading-8">
                            We may update this Privacy Policy from time to time. When we do, we will revise the effective date above and, for material changes,
                            provide notice within the App. Your continued use of the App after changes take effect constitutes acceptance of the updated policy.
                        </p>

                        <h2 className="mt-7 mb-3 border-b border-gray-200 pb-2 text-xl font-semibold text-[#181d27]">9. Contact Us</h2>
                        <p className="mb-2 leading-8">If you have questions about this Privacy Policy or your data, contact:</p>
                        <p className="leading-8">
                            Info-Power International, Inc.
                            <br />
                            Email:{" "}
                            <a href="mailto:privacy@abw.com" className="text-[#0a58ca] hover:underline">
                                privacy@abw.com
                            </a>
                        </p>

                        <footer className="mt-10 border-t border-gray-200 pt-4 text-sm text-[#666]">
                            Copyright 2026 Info-Power International, Inc. All rights reserved.
                        </footer>
                    </div>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
}
