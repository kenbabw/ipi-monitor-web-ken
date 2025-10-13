import { useNavigate } from "react-router";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";

export function NotFound() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="NotFound">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-8 px-[20px] py-[15px] md:gap-[151px]">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[24px]" />

                <div className="px-4 text-center">
                    <div className="mb-4">
                        <span className="text-[24px] font-bold text-[#ff9b00] not-italic">404 Error</span>
                    </div>
                    <h1 className="text-[32px] leading-[normal] font-bold text-[#1c78bf] not-italic sm:text-[32px]">Page Not Found</h1>
                    <p className="mx-auto mt-4 max-w-md text-gray-600">Sorry, the page you are looking for doesn't exist or has been moved.</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleGoHome}
                        className="relative box-border flex h-[52px] shrink-0 cursor-pointer content-stretch items-center justify-center gap-[10px] rounded-[12px] bg-gradient-to-r from-[#ff9b00] to-[#ff9b00] px-[16px] py-[10px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] transition-colors hover:from-[#e8890a] hover:to-[#e8890a]"
                    >
                        <span className="relative shrink-0 text-[20px] leading-[normal] font-bold text-nowrap whitespace-pre text-white not-italic">
                            Take me home
                        </span>
                    </button>
                </div>

                <div className="relative flex w-[109px] shrink-0 flex-col content-stretch items-start gap-[16px] text-[16px] leading-[normal] font-medium text-[#1c78bf] not-italic">
                    <button onClick={handleGoBack} className="relative w-full shrink-0 cursor-pointer text-left hover:underline">
                        Go back
                    </button>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[24px]" />
            </div>
        </div>
    );
}
