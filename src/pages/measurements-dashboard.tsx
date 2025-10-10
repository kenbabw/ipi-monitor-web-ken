import React, { useState } from "react";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Button } from "@/components/base/buttons/button";
import { measurementOperations, useDeviceMeasurements, useRecentMeasurements } from "@/hooks/use-ipi-data";

interface MeasurementCardProps {
    measurement: {
        measurement_sk: number;
        measurement_date_time: string;
        measurement_temperature: number;
        measurement_humidity: number;
        measurement_dew_point: number;
        device_temperature_unit: string;
    };
}

function MeasurementCard({ measurement }: MeasurementCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getTemperatureColor = (temp: number, unit: string) => {
        const celsius = unit === "Fahrenheit" ? ((temp - 32) * 5) / 9 : temp;
        if (celsius > 25) return "text-red-600";
        if (celsius < 15) return "text-blue-600";
        return "text-green-600";
    };

    const getHumidityColor = (humidity: number) => {
        if (humidity > 70) return "text-orange-600";
        if (humidity < 30) return "text-yellow-600";
        return "text-green-600";
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
                <div className="text-sm text-gray-500">{formatDate(measurement.measurement_date_time)}</div>
                <div className="text-xs text-gray-400">#{measurement.measurement_sk}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className={`text-2xl font-bold ${getTemperatureColor(measurement.measurement_temperature, measurement.device_temperature_unit)}`}>
                        {measurement.measurement_temperature.toFixed(1)}°
                    </div>
                    <div className="text-xs text-gray-500">Temperature</div>
                    <div className="text-xs text-gray-400">{measurement.device_temperature_unit}</div>
                </div>

                <div className="text-center">
                    <div className={`text-2xl font-bold ${getHumidityColor(measurement.measurement_humidity)}`}>
                        {measurement.measurement_humidity.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Humidity</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{measurement.measurement_dew_point.toFixed(1)}°</div>
                    <div className="text-xs text-gray-500">Dew Point</div>
                </div>
            </div>
        </div>
    );
}

interface DeviceMeasurementsProps {
    deviceId: string;
    userId: number;
    deviceName: string;
}

export function DeviceMeasurements({ deviceId, userId, deviceName }: DeviceMeasurementsProps) {
    const [limit, setLimit] = useState(20);
    const { measurements, loading, error } = useDeviceMeasurements(deviceId, userId, limit);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingIndicator />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="mb-4 text-red-600">Error loading measurements: {error.message}</div>
            </div>
        );
    }

    const latestMeasurement = measurements[0];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Measurements for {deviceName}</h2>
                    <p className="text-sm text-gray-600">Showing latest {measurements.length} readings</p>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={() => setLimit(limit === 20 ? 50 : 20)} size="sm" color="secondary">
                        Show {limit === 20 ? "50" : "20"}
                    </Button>
                </div>
            </div>

            {latestMeasurement && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-3 text-lg font-medium text-blue-900">Latest Reading</h3>
                    <MeasurementCard measurement={latestMeasurement} />
                </div>
            )}

            {measurements.length === 0 ? (
                <div className="py-8 text-center">
                    <div className="mb-4 text-gray-500">No measurements found for this device</div>
                    <Button color="primary">Add Test Data</Button>
                </div>
            ) : (
                <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900">Historical Readings ({measurements.length})</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {measurements.slice(1).map((measurement) => (
                            <MeasurementCard key={measurement.measurement_sk} measurement={measurement} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function RecentMeasurementsDashboard() {
    const [hoursBack, setHoursBack] = useState(24);
    const { measurements, loading, error } = useRecentMeasurements(hoursBack);
    const [isAddingTest, setIsAddingTest] = useState(false);

    const addTestMeasurement = async () => {
        setIsAddingTest(true);

        // Generate random test data
        const testMeasurement = {
            user_id: 1, // You'll need to get this from your actual user
            device_id: "00:1B:44:11:3A:B7", // Use a real device ID
            measurement_date_time: new Date().toISOString(),
            measurement_temperature: 20 + Math.random() * 10, // 20-30°C
            measurement_humidity: 40 + Math.random() * 20, // 40-60%
            measurement_dew_point: 10 + Math.random() * 5, // 10-15°C
            device_temperature_unit: "Celsius",
        };

        const { error } = await measurementOperations.addMeasurement(testMeasurement);

        if (error) {
            console.error("Failed to add test measurement:", error);
        }

        setIsAddingTest(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingIndicator />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="mb-4 text-red-600">Error loading measurements: {error.message}</div>
            </div>
        );
    }

    // Group measurements by device
    const measurementsByDevice = measurements.reduce(
        (acc, measurement) => {
            const key = `${measurement.device_id}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(measurement);
            return acc;
        },
        {} as Record<string, typeof measurements>,
    );

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recent Measurements</h1>
                    <p className="text-gray-600">
                        Last {hoursBack} hours • {measurements.length} total readings
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={() => setHoursBack(hoursBack === 24 ? 48 : 24)} size="sm" color="secondary">
                        {hoursBack === 24 ? "48h" : "24h"}
                    </Button>
                    <Button onClick={addTestMeasurement} disabled={isAddingTest} size="sm" color="primary">
                        {isAddingTest ? "Adding..." : "Add Test Data"}
                    </Button>
                </div>
            </div>

            {measurements.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="mb-4 text-gray-500">No measurements found in the last {hoursBack} hours</div>
                    <Button onClick={addTestMeasurement} color="primary">
                        Add Test Measurement
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(measurementsByDevice).map(([deviceId, deviceMeasurements]) => (
                        <div key={deviceId} className="rounded-lg bg-gray-50 p-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Device: {deviceId} ({deviceMeasurements.length} readings)
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {deviceMeasurements.slice(0, 6).map((measurement) => (
                                    <MeasurementCard key={measurement.measurement_sk} measurement={measurement} />
                                ))}
                            </div>
                            {deviceMeasurements.length > 6 && (
                                <div className="mt-4 text-center">
                                    <div className="text-sm text-gray-500">+{deviceMeasurements.length - 6} more readings</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">Measurement Statistics</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{measurements.length}</div>
                        <div className="text-sm text-gray-500">Total Readings</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{Object.keys(measurementsByDevice).length}</div>
                        <div className="text-sm text-gray-500">Active Devices</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {measurements.length > 0
                                ? (measurements.reduce((sum, m) => sum + m.measurement_temperature, 0) / measurements.length).toFixed(1)
                                : "0"}
                            °
                        </div>
                        <div className="text-sm text-gray-500">Avg Temperature</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {measurements.length > 0
                                ? (measurements.reduce((sum, m) => sum + m.measurement_humidity, 0) / measurements.length).toFixed(1)
                                : "0"}
                            %
                        </div>
                        <div className="text-sm text-gray-500">Avg Humidity</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
