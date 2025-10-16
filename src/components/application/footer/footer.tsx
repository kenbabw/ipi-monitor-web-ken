// LinkedIn logo is now in public folder, accessed via public URL
import { APP_VERSION } from "@/config/version";

interface FooterProps {
    className?: string;
}

export function Footer({ className }: FooterProps) {
    return (
        <footer className={className} data-name="Footer" data-node-id="84:78">
            <div
                className="h-[5px] w-full shrink-0"
                data-name="Secondary Color Border"
                data-node-id="30:11"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg, rgb(255, 155, 0) 0%, rgb(255, 155, 0) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(217, 217, 217) 0%, rgb(217, 217, 217) 100%)",
                }}
            />

            <div
                className="relative flex w-full shrink-0 flex-col content-stretch items-center gap-4 px-2 py-4 sm:flex-row sm:gap-8"
                data-name="Footer Content"
                data-node-id="84:76"
            >
                <div
                    className="relative flex flex-1 flex-col content-stretch items-center gap-[12px] text-[14px] leading-[normal] font-bold text-[#1c78bf] not-italic sm:items-start md:text-[16px]"
                    data-name="IPI Address"
                    data-node-id="84:71"
                >
                    <p className="relative w-full shrink-0 text-center sm:text-left" data-node-id="84:67">
                        Info-Power International, Inc.
                    </p>
                    <p className="relative w-full shrink-0 text-center sm:text-left" data-node-id="84:68">
                        3213 Monette Lane
                    </p>
                    <p className="relative w-full shrink-0 text-center sm:text-left" data-node-id="84:69">
                        Plano TX, 75025
                    </p>
                </div>

                <div
                    className="relative flex flex-1 flex-col content-stretch items-center gap-[14px] leading-[normal] not-italic"
                    data-name="IPI apps/Copyright"
                    data-node-id="84:74"
                >
                    <p className="relative w-full shrink-0 text-center text-[16px] font-bold text-[#1c78bf] md:text-[20px]" data-node-id="84:41">
                        <a
                            href="https://www.infopowerapps.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-opacity hover:underline hover:opacity-80"
                        >
                            www.infopowerapps.com
                        </a>
                    </p>
                    <p
                        className="relative w-full shrink-0 text-center text-[12px] font-normal whitespace-pre-wrap text-black md:text-[14px]"
                        data-node-id="69:1769"
                    >
                        Copyright 2025 Info-Power International, Inc. All Rights Reserved | Version {APP_VERSION}
                    </p>
                </div>

                <div className="relative flex flex-1 items-center justify-center sm:justify-end" data-name="Linkedin Container">
                    <a
                        href="https://www.linkedin.com/company/info-power-international-inc/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-[32px] cursor-pointer items-center justify-center overflow-hidden rounded bg-[#e5e0e0] transition-colors hover:bg-[#d0cbcb]"
                        data-name="Linkedin"
                        data-node-id="69:1764"
                        aria-label="Visit Info-Power International on LinkedIn"
                    >
                        <img alt="LinkedIn" className="h-[20px] w-[20px] object-contain" src="/linkedin-logo.svg" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
