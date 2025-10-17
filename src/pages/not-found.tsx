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
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                {/* Main Content - takes up remaining space */}
                <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-4 sm:gap-8 sm:px-6 sm:py-8">
                    <div className="text-center">
                        <div className="mb-4">
                            <span className="text-lg font-bold text-[#ff9b00] not-italic sm:text-[24px]">404 Error</span>
                        </div>
                        <h1 className="text-2xl leading-[normal] font-bold text-[#1c78bf] not-italic sm:text-[32px]">Page Not Found</h1>
                        <p className="mx-auto mt-4 max-w-md text-xs text-gray-600 sm:text-sm">
                            Sorry, the page you are looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={handleGoHome}
                            className="relative box-border flex h-[48px] shrink-0 cursor-pointer content-stretch items-center justify-center gap-[10px] rounded-[12px] bg-gradient-to-r from-[#ff9b00] to-[#ff9b00] px-[16px] py-[10px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] transition-colors hover:from-[#e8890a] hover:to-[#e8890a] sm:h-[52px]"
                        >
                            <span className="relative shrink-0 text-lg leading-[normal] font-bold text-nowrap whitespace-pre text-white not-italic sm:text-[20px]">
                                Home
                            </span>
                        </button>
                    </div>

                    <div className="relative flex shrink-0 flex-col content-stretch items-center gap-[16px] text-sm leading-[normal] font-medium text-[#1c78bf] not-italic sm:text-[16px]">
                        <button onClick={handleGoBack} className="relative shrink-0 cursor-pointer text-center hover:underline">
                            Go Back
                        </button>
                    </div>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
}
