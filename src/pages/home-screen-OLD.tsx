import { useNavigate } from "react-router";
import { Footer } from "../components/application/footer/footer";
import { Header } from "../components/application/header/header";

export const HomeScreen = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleCreateAccount = () => {
        navigate("/create-account");
    };

    const handleGuestAccess = () => {
        // For now, just show an alert. You can implement guest functionality later
        alert("Guest access functionality will be implemented");
    };

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="Home" data-node-id="89:201">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-8 px-[20px] py-[15px] md:gap-[151px]">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[24px]" />

                <div className="text-center">
                    <h1 className="relative shrink-0 text-[32px] leading-[normal] font-bold text-nowrap whitespace-pre text-[#1c78bf] not-italic">
                        Welcome to IPI Monitor!
                    </h1>
                    <p className="mt-4 text-gray-600">Monitor and manage your IoT devices with real-time data insights</p>
                </div>

                <button
                    onClick={handleLogin}
                    className="relative box-border flex h-[52px] shrink-0 cursor-pointer content-stretch items-center justify-center gap-[10px] rounded-[12px] bg-gradient-to-r from-[#ff9b00] to-[#ff9b00] px-[16px] py-[10px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] transition-colors hover:from-[#e8890a] hover:to-[#e8890a]"
                    data-name="Login Button"
                    data-node-id="89:213"
                >
                    <span className="relative shrink-0 text-[20px] leading-[normal] font-bold text-nowrap whitespace-pre text-white not-italic">Login</span>
                </button>

                <div
                    className="relative flex w-[109px] shrink-0 flex-col content-stretch items-start gap-[16px] text-[12px] leading-[normal] font-medium text-[#1c78bf] not-italic"
                    data-name="Account/Guest"
                    data-node-id="89:209"
                >
                    <button onClick={handleCreateAccount} className="relative w-full shrink-0 cursor-pointer text-left hover:underline">
                        Create an account
                    </button>
                    <button onClick={handleGuestAccess} className="relative w-full shrink-0 cursor-pointer text-left hover:underline">
                        Continue as guest
                    </button>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[24px]" />
            </div>
        </div>
    );
};
