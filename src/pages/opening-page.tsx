import { useNavigate } from "react-router";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";

function ServerIcon() {
    return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="12" width="48" height="14" rx="2" stroke="#1c78bf" strokeWidth="4" fill="none" />
            <rect x="8" y="32" width="48" height="14" rx="2" stroke="#1c78bf" strokeWidth="4" fill="none" />
            <rect x="8" y="52" width="48" height="4" rx="1" stroke="#1c78bf" strokeWidth="2" fill="none" />
            <circle cx="16" cy="19" r="2.5" fill="#1c78bf" />
            <circle cx="24" cy="19" r="2.5" fill="#1c78bf" />
            <circle cx="16" cy="39" r="2.5" fill="#1c78bf" />
            <circle cx="24" cy="39" r="2.5" fill="#1c78bf" />
        </svg>
    );
}

function MonitorIcon() {
    return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="56" height="38" rx="4" stroke="#1c78bf" strokeWidth="4" fill="none" />
            <line x1="24" y1="54" x2="40" y2="54" stroke="#1c78bf" strokeWidth="4" strokeLinecap="round" />
            <line x1="32" y1="46" x2="32" y2="54" stroke="#1c78bf" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

function DatabaseIcon() {
    return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="16" rx="24" ry="8" stroke="#1c78bf" strokeWidth="4" fill="none" />
            <path d="M8 16v10c0 4.4 10.7 8 24 8s24-3.6 24-8V16" stroke="#1c78bf" strokeWidth="4" fill="none" />
            <path d="M8 26v10c0 4.4 10.7 8 24 8s24-3.6 24-8V26" stroke="#1c78bf" strokeWidth="4" fill="none" />
            <path d="M8 36v10c0 4.4 10.7 8 24 8s24-3.6 24-8V36" stroke="#1c78bf" strokeWidth="4" fill="none" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="40" height="56" rx="6" stroke="#1c78bf" strokeWidth="4" fill="none" />
            <circle cx="24" cy="52" r="3" fill="#1c78bf" />
            <line x1="18" y1="12" x2="30" y2="12" stroke="#1c78bf" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function BluetoothIcon() {
    return (
        <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="14,16 34,48 24,40 24,24 34,16 14,48" stroke="#1c78bf" strokeWidth="4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

function WifiIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="20" r="2.5" fill="#1c78bf" />
            <path d="M7.5 15.5a9 9 0 0 1 13 0" stroke="#1c78bf" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M3 11a15 15 0 0 1 22 0" stroke="#1c78bf" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
    );
}

function OrangeArrow() {
    return (
        <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <line x1="5" y1="10" x2="35" y2="10" stroke="#FF9B00" strokeWidth="3" />
            <polyline points="28,4 35,10 28,16" stroke="#FF9B00" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
            <polyline points="12,4 5,10 12,16" stroke="#FF9B00" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

function VercelLogo() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="16,4 30,28 2,28" fill="black" />
        </svg>
    );
}

function SupabaseLogo() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="18,2 10,18 16,18 14,30 22,14 16,14" fill="#3ECF8E" />
        </svg>
    );
}

export function OpeningPage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="Opening">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                {/* Main Content */}
                <div className="flex w-full max-w-4xl flex-1 flex-col items-center gap-8 px-4 py-8 sm:px-6 sm:py-10">
                    {/* Welcome Title */}
                    <h1 className="text-2xl leading-normal font-bold text-[#1c78bf] not-italic sm:text-[32px]" data-node-id="910:1549">
                        Welcome to IPI Monitor!
                    </h1>

                    {/* Description */}
                    <div className="flex max-w-2xl flex-col gap-4 text-center">
                        <p className="text-[16px] leading-snug font-bold text-[#1c78bf]">
                            So, what is IPI Monitor? The IPI Monitor portal is for your users to retrieve and display data collected by your mobile device and
                            multiple Bluetooth sensors.
                        </p>
                        <p className="text-[16px] leading-snug font-bold text-[#1c78bf]">
                            The website was designed in Figma, the data is stored in Supabase, and Vercel hosts the site.
                        </p>
                        <p className="text-[16px] leading-snug font-bold text-[#1c78bf]">
                            The Figma design was submitted to Claude to generate the initial React and TypeScript code.
                        </p>
                    </div>

                    {/* Architecture Diagram */}
                    <div className="flex w-full flex-wrap items-center justify-center gap-3 py-4 sm:gap-4">
                        {/* Vercel */}
                        <div className="flex flex-col items-center gap-1">
                            <ServerIcon />
                            <span className="text-[14px] font-bold text-black">Vercel</span>
                            <VercelLogo />
                        </div>

                        <OrangeArrow />

                        {/* Supabase */}
                        <div className="flex flex-col items-center gap-1">
                            <DatabaseIcon />
                            <span className="text-[14px] font-bold text-black">Supabase</span>
                            <SupabaseLogo />
                        </div>

                        <OrangeArrow />

                        {/* Website / Mobile Device */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <MonitorIcon />
                                <PhoneIcon />
                            </div>
                            <span className="text-center text-[14px] leading-tight font-bold text-black">
                                Website Browser
                                <br />
                                Mobile Device
                                <br />
                                iOS/Android
                            </span>
                        </div>

                        <OrangeArrow />

                        {/* Bluetooth */}
                        <div className="flex flex-col items-center gap-1">
                            <BluetoothIcon />
                            <span className="text-[14px] font-bold text-black">Bluetooth</span>
                        </div>

                        <OrangeArrow />

                        {/* Unlimited Sensors */}
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2">
                                <WifiIcon />
                                <span className="text-[14px] text-black">Living Room</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <WifiIcon />
                                <span className="text-[14px] text-black">Master Bedroom</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <WifiIcon />
                                <span className="text-[14px] text-black">Wine Cellar</span>
                            </div>
                            <span className="pl-1 text-[14px] font-bold text-black">Unlimited Sensors</span>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={() => navigate("/login")}
                        className="rounded-[3px] bg-[#FF9B00] px-10 py-3 text-[16px] font-bold text-white transition-colors hover:bg-[#e68900] active:bg-[#cc7a00]"
                    >
                        Login
                    </button>
                </div>

                <Footer className="mt-auto w-full px-[8px] py-[6px]" />
            </div>
        </div>
    );
}
