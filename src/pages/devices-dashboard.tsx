import React, { useState } from "react";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Button } from "@/components/base/buttons/button";
import { deviceOperations, useCurrentAppUser, useUserDevices } from "@/hooks/use-ipi-data";

interface DeviceCardProps {
    device: {
        device_id: string;
        device_name: string;
        user_device_name: string | null;
        device_battery: number;
        device_temperature_unit: string;
        device_last_polled: string;
        device_last_uploaded: string;
    };
    onUpdateDevice: () => void;
}

function DeviceCard({ device, onUpdateDevice }: DeviceCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateBattery = async () => {
        setIsUpdating(true);
        // Simulate battery update with a random value
        const newBatteryLevel = Math.floor(Math.random() * 100);

        const { error } = await deviceOperations.updateBatteryLevel(
            device.device_id,
            1, // You'll need to get the actual user_id
            newBatteryLevel,
        );

        if (!error) {
            onUpdateDevice();
        }
        setIsUpdating(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getBatteryColor = (battery: number) => {
        if (battery > 60) return "text-green-600";
        if (battery > 30) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{device.user_device_name || device.device_name}</h3>
                    <p className="text-sm text-gray-500">ID: {device.device_id}</p>
                </div>
                <div className={`text-right ${getBatteryColor(device.device_battery)}`}>
                    <div className="text-2xl font-bold">{device.device_battery}%</div>
                    <div className="text-xs">Battery</div>
                </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-500">Temperature Unit</div>
                    <div className="font-medium">{device.device_temperature_unit}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Last Polled</div>
                    <div className="text-sm font-medium">{formatDate(device.device_last_polled)}</div>
                </div>
            </div>

            <div className="mb-4">
                <div className="text-sm text-gray-500">Last Uploaded</div>
                <div className="text-sm font-medium">{formatDate(device.device_last_uploaded)}</div>
            </div>

            <div className="flex space-x-2">
                <Button onClick={handleUpdateBattery} disabled={isUpdating} size="sm" color="primary">
                    {isUpdating ? "Updating..." : "Update Battery"}
                </Button>
                <Button onClick={() => deviceOperations.updateLastPolled(device.device_id, 1)} size="sm" color="secondary">
                    Poll Now
                </Button>
            </div>
        </div>
    );
}

export function DevicesDashboard() {
    const { appUser, loading: userLoading } = useCurrentAppUser();
    const { devices, loading: devicesLoading, error } = useUserDevices();

    const handleRefresh = () => {
        window.location.reload();
    };

    if (userLoading || devicesLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingIndicator />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="mb-4 text-red-600">Error loading devices: {error.message}</div>
                <Button onClick={handleRefresh} color="primary">
                    Retry
                </Button>
            </div>
        );
    }

    if (!appUser) {
        return (
            <div className="p-8 text-center">
                <div className="mb-4 text-gray-600">No user profile found. Please complete your profile setup.</div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome, {appUser.user_first_name || "User"}!</h1>
                    <p className="text-gray-600">Manage your IPI monitoring devices</p>
                </div>
                <Button onClick={handleRefresh} color="secondary">
                    Refresh
                </Button>
            </div>

            {devices.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="mb-4 text-gray-500">No devices found</div>
                    <Button color="primary">Add Your First Device</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {devices.map((device) => (
                        <DeviceCard key={`${device.user_id}-${device.device_id}`} device={device} onUpdateDevice={handleRefresh} />
                    ))}
                </div>
            )}

            <div className="mt-8 rounded-lg bg-gray-50 p-6">
                <h2 className="mb-4 text-lg font-semibold">Quick Stats</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{devices.length}</div>
                        <div className="text-sm text-gray-500">Total Devices</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{devices.filter((d) => d.device_battery > 30).length}</div>
                        <div className="text-sm text-gray-500">Healthy Battery</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{devices.filter((d) => d.device_battery <= 30).length}</div>
                        <div className="text-sm text-gray-500">Low Battery</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
