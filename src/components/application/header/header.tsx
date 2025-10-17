// IPI logo and phone icon are now in public folder, accessed via public URLs

interface HeaderProps {
    className?: string;
}

export function Header({ className }: HeaderProps) {
    return (
        <header className={className} data-name="Header" data-node-id="89:212">
            <div className="relative flex w-full shrink-0 content-stretch items-end justify-between" data-name="Logo/Phone" data-node-id="I89:212;68:16">
                <a
                    href="https://www.infopowerapps.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex shrink-0 content-stretch items-end gap-[16px] transition-opacity hover:opacity-80"
                    data-name="Logo/Company Name"
                    data-node-id="I89:212;68:14"
                >
                    <div className="relative h-[105.607px] w-[100px] shrink-0" data-name="Logo" data-node-id="I89:212;24:14">
                        <img
                            alt="Info-Power International Logo"
                            className="absolute inset-0 size-full max-w-none object-cover object-[50%_50%]"
                            src="/ipi-logo.png"
                        />
                    </div>
                    <h2
                        className="relative hidden min-w-0 flex-1 text-[20px] leading-[normal] font-bold text-[#1c78bf] not-italic sm:block"
                        data-node-id="I89:212;24:28"
                    >
                        Info-Power International, Inc.
                    </h2>
                </a>

                <div className="flex shrink-0 content-stretch items-center justify-center gap-[54px]" data-name="Links" data-node-id="I89:212;69:29" />

                <div className="relative flex shrink-0 items-center gap-2" data-name="Phone/Icon" data-node-id="I89:212;68:15">
                    <div className="h-[20px] w-[21px] flex-shrink-0" data-name="phone-line" data-node-id="I89:212;24:29">
                        <img alt="Phone" className="block size-full max-w-none" src="/phone-icon.svg" />
                    </div>
                    <p className="hidden text-[20px] leading-[normal] font-bold text-[#1c78bf] not-italic sm:block" data-node-id="I89:212;24:27">
                        972-424-4447
                    </p>
                </div>
            </div>

            <div
                className="h-[5px] w-full shrink-0"
                data-name="Divider/Secondary Color"
                data-node-id="I89:212;30:10"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg, rgb(255, 155, 0) 0%, rgb(255, 155, 0) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(217, 217, 217) 0%, rgb(217, 217, 217) 100%)",
                }}
            />
        </header>
    );
}
