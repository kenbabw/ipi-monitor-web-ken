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

    const handleLogout = async () => {
        const { error } = await signOut();
        if (error) {
            setError(error.message);
        } else {
            navigate("/login");
        }
    };

    const handleGraphs = () => {
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

                {/* Page Header Section */}
                <div className="flex w-full max-w-7xl flex-col items-start gap-[8px]">
                    <div className="box-border flex w-full flex-col items-end gap-[6px] px-[32px] py-0">
                        <div className="flex w-full flex-col items-start gap-[16px]">
                            <div className="flex w-full flex-wrap items-start justify-between gap-[16px]">
                                <div className="flex flex-col items-start">
                                    <p className="text-[20px] leading-[30px] font-semibold text-[#181d27]">Welcome back, {userName}</p>
                                </div>
                                <div className="flex items-start gap-[12px]">
                                    <Button
                                        className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] transition-colors duration-200 hover:border-[#1c78bf] hover:bg-blue-50 hover:text-[#1c78bf]"
                                        data-name="Device Info Button"
                                    >
                                        Device Info
                                    </Button>
                                    <Button
                                        onClick={handleGraphs}
                                        className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] transition-colors duration-200 hover:border-[#1c78bf] hover:bg-blue-50 hover:text-[#1c78bf]"
                                        data-name="Graph/Charts Button"
                                    >
                                        Graphs
                                    </Button>
                                    <Button
                                        onClick={handleLogout}
                                        className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] transition-colors duration-200 hover:border-[#1c78bf] hover:bg-blue-50 hover:text-[#1c78bf]"
                                        data-name="Logout Button"
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Device Selection */}
                    <div className="flex flex-col items-start gap-2">
                        <Select
                            label="Device:"
                            placeholder="Select Device"
                            selectedKey={selectedDevice?.device_id || null}
                            onSelectionChange={(key) => handleDeviceSelect(key as string)}
                            className="w-full max-w-[800px]"
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
                {error && <div className="w-full max-w-7xl rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

                {/* Device Information Form */}
                {selectedDevice ? (
                    <div className="flex w-full max-w-6xl flex-col items-start gap-[6px]">
                        <div className="flex w-full gap-[16px]">
                            {/* Left Column */}
                            <div className="flex flex-1 flex-col items-start gap-2">
                                <Input
                                    label="Device Name:"
                                    value={selectedDevice.user_device_name || selectedDevice.device_name}
                                    isReadOnly
                                    className="w-full"
                                />

                                <Input label="Device ID:" value={selectedDevice.device_id} isReadOnly className="w-full" />

                                <Input label="Device Interval:" value={`${selectedDevice.device_interval} minutes`} isReadOnly className="w-full" />

                                <Input
                                    label="Low Temp Threshold:"
                                    value={`${selectedDevice.device_low_temperature_threshhold}°${selectedDevice.device_temperature_unit}`}
                                    isReadOnly
                                    className="w-full"
                                />

                                <Input
                                    label="High Temp Threshold:"
                                    value={`${selectedDevice.device_high_temperature_threshhold}°${selectedDevice.device_temperature_unit}`}
                                    isReadOnly
                                    className="w-full"
                                />

                                <Input
                                    label="Low Humidity Threshold:"
                                    value={`${selectedDevice.device_low_humidity_threshhold}%`}
                                    isReadOnly
                                    className="w-full"
                                />

                                <Input
                                    label="High Humidity Threshold:"
                                    value={`${selectedDevice.device_high_humidity_threshhold}%`}
                                    isReadOnly
                                    className="w-full"
                                />
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-1 flex-col items-start gap-2">
                                <Input
                                    label="Low Dew Point Threshold:"
                                    value={`${selectedDevice.device_low_dew_point}°${selectedDevice.device_temperature_unit}`}
                                    isReadOnly
                                    className="w-full"
                                />

                                <Input
                                    label="High Dew Point Threshold:"
                                    value={`${selectedDevice.device_high_dew_point}°${selectedDevice.device_temperature_unit}`}
                                    isReadOnly
                                    className="w-full"
                                />

                                <Input label="Device Last Polled:" value={formatDate(selectedDevice.device_last_polled)} isReadOnly className="w-full" />

                                <Input label="Device Last Uploaded:" value={formatDate(selectedDevice.device_last_uploaded)} isReadOnly className="w-full" />

                                <Input label="Device Battery:" value={`${selectedDevice.device_battery}%`} isReadOnly className="w-full" />

                                <Input
                                    label="Set Temperature:"
                                    value={selectedDevice.device_temperature_unit === "C" ? "Celsius" : "Fahrenheit"}
                                    isReadOnly
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full max-w-2xl items-center justify-center p-8">
                        <p className="text-gray-600">{devices.length === 0 ? "No devices found for your account." : "Please select a device."}</p>
                    </div>
                )}

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
};
