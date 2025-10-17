import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Footer } from "../components/application/footer/footer";
import { Header } from "../components/application/header/header";
import { Button } from "../components/base/buttons/button";
import { Input } from "../components/base/input/input";
import { Select } from "../components/base/select/select";
import { supabase } from "../lib/supabase";
import { Database } from "../lib/types/database-ipi.types";
import { useSupabase } from "../providers/supabase-provider";

type Device = Database["public"]["Tables"]["device"]["Row"];

export const DeviceInformation = () => {
    const { user, signOut } = useSupabase();
    const navigate = useNavigate();
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    const fetchDevices = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);

            // First get the user_id from app_user table
            const { data: userData, error: userError } = await supabase.from("app_user").select("user_id").eq("auth_user", user.id).single();

            if (userError) throw userError;

            // Then fetch devices for this user
            const { data: deviceData, error: deviceError } = await supabase
                .from("device")
                .select("*")
                .eq("user_id", (userData as any).user_id);

            if (deviceError) throw deviceError;

            setDevices(deviceData || []);

            // Select the first device by default if available
            if (deviceData && deviceData.length > 0) {
                setSelectedDevice(deviceData[0]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchUserData();
        fetchDevices();
    }, [user, navigate, fetchUserData, fetchDevices]);

    const handleLogout = () => {
        // Navigate immediately and let the logout page handle the signOut
        navigate("/logout", { replace: true });
        // Call signOut asynchronously without waiting
        signOut().catch((err) => {
            console.error("Error during logout:", err);
        });
    };

    const handleCharts = () => {
        navigate("/chart");
    };

    const handleDeviceSelect = (deviceId: string) => {
        const device = devices.find((d) => d.device_id === deviceId);
        setSelectedDevice(device || null);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-[#1c78bf]">Loading device information...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="Device Information">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                {/* Main Content */}
                <div className="flex w-full flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Page header section */}
                    <div className="w-full">
                        <div className="mb-4 sm:mb-6">
                            {/* Welcome and action buttons */}
                            <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                                <div className="flex flex-col items-start">
                                    <p className="text-lg font-semibold leading-[30px] text-[#181d27] sm:text-xl">Welcome back, {userName}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <Button color="secondary" className="px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm">
                                        Device Info
                                    </Button>
                                    <Button color="secondary" onClick={handleCharts} className="px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm">
                                        Charts
                                    </Button>
                                    <Button color="secondary" onClick={handleLogout} className="px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm">
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Device Selection */}
                    <div className="flex flex-col items-start gap-1 [&_label]:!text-[#1c78bf]">
                        <Select
                            label="Device:"
                            placeholder="Select Device"
                            selectedKey={selectedDevice?.device_id || null}
                            onSelectionChange={(key) => handleDeviceSelect(key as string)}
                            className="w-full sm:max-w-[300px]"
                            items={devices.map((device) => ({
                                id: device.device_id,
                                label: device.user_device_name || device.device_name,
                            }))}
                        >
                            {(item) => (
                                <Select.Item key={item.id} id={item.id}>
                                    {item.label}
                                </Select.Item>
                            )}
                        </Select>
                    </div>
                </div>

                {/* Error Message */}
                {error && <div className="w-full max-w-7xl rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:p-4 sm:text-sm">{error}</div>}

                {/* Device Information Form */}
                {selectedDevice ? (
                    <div className="flex w-full max-w-6xl flex-col items-start gap-[1px] [&_label]:!text-[#1c78bf]">
                        <div className="flex w-full flex-col gap-4 lg:flex-row lg:gap-[16px]">
                            {/* First Column - 4 fields */}
                            <div className="flex flex-1 flex-col items-start gap-2">
                                <Input
                                    label="Device Name:"
                                    value={selectedDevice.user_device_name || selectedDevice.device_name}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />

                                <Input label="Device ID:" value={selectedDevice.device_id} isReadOnly isDisabled className="w-full" />

                                <Input label="Device Interval:" value={`${selectedDevice.device_interval} minutes`} isReadOnly isDisabled className="w-full" />

                                <Input label="Device Battery:" value={`${selectedDevice.device_battery}%`} isReadOnly isDisabled className="w-full" />
                            </div>

                            {/* Second Column - 6 fields */}
                            <div className="flex flex-1 flex-col items-start gap-2">
                                <Input
                                    label="Low Temp Threshold:"
                                    value={`${selectedDevice.device_low_temperature_threshhold}°${selectedDevice.device_temperature_unit}`}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />

                                <Input
                                    label="High Temp Threshold:"
                                    value={`${selectedDevice.device_high_temperature_threshhold}°${selectedDevice.device_temperature_unit}`}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />

                                <Input
                                    label="Low Humidity Threshold:"
                                    value={`${selectedDevice.device_low_humidity_threshhold}%`}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />

                                <Input
                                    label="High Humidity Threshold:"
                                    value={`${selectedDevice.device_high_humidity_threshhold}%`}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />

                                <Input
                                    label="Low Dew Point Threshold:"
                                    value={`${selectedDevice.device_low_dew_point}°${selectedDevice.device_temperature_unit}`}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />

                                <Input
                                    label="High Dew Point Threshold:"
                                    value={`${selectedDevice.device_high_dew_point}°${selectedDevice.device_temperature_unit}`}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />
                            </div>

                            {/* Third Column - 3 fields */}
                            <div className="flex flex-1 flex-col items-start gap-2">
                                <Input
                                    label="Temperature Unit:"
                                    value={selectedDevice.device_temperature_unit === "Celsius" ? "Celsius" : "Fahrenheit"}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />

                                <Input
                                    label="Device Last Polled:"
                                    value={formatDate(selectedDevice.device_last_polled)}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />

                                <Input
                                    label="Device Last Uploaded:"
                                    value={formatDate(selectedDevice.device_last_uploaded)}
                                    isReadOnly
                                    isDisabled
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full max-w-2xl items-center justify-center p-4 sm:p-8">
                        <p className="text-xs text-gray-600 sm:text-sm">{devices.length === 0 ? "No devices found for your account." : "Please select a device."}</p>
                    </div>
                )}

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
};
