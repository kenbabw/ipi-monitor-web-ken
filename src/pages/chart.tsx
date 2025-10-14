import { useCallback, useEffect, useState } from "react";
import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "react-aria-components";
import { useNavigate } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { Footer } from "@/components/application/footer/footer";
import { Header } from "@/components/application/header/header";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Select } from "@/components/base/select/select";
import { useUserDevices } from "@/hooks/use-ipi-data";
import { measurementOperations } from "@/hooks/use-ipi-data";
import { supabase } from "@/lib/supabase";
import type { Device, MeasurementData, MeasurementDataInsert } from "@/lib/types/database-ipi.types";

interface ChartDataPoint {
    time: string;
    temperature: number;
    humidity?: number;
    dewPoint?: number;
}

interface ChartStats {
    average: number;
    high: number;
    low: number;
}

const Chart = () => {
    const navigate = useNavigate();
    const { devices } = useUserDevices();
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [stats, setStats] = useState<ChartStats>({ average: 0, high: 0, low: 0 });
    const [loading, setLoading] = useState(false);

    // Chart display options
    const [showTemperature, setShowTemperature] = useState(true);
    const [showHumidity, setShowHumidity] = useState(false);
    const [showDewPoint, setShowDewPoint] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // Date range for filtering
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

    // Synchronize "All" checkbox with individual checkboxes
    useEffect(() => {
        const allChecked = showTemperature && showHumidity && showDewPoint;
        setShowAll(allChecked);
    }, [showTemperature, showHumidity, showDewPoint]);

    // Initialize selected device from localStorage on component mount
    useEffect(() => {
        const savedDeviceId = localStorage.getItem("selectedDeviceId");
        if (savedDeviceId && devices.length > 0) {
            const device = devices.find((d) => d.device_id === savedDeviceId);
            if (device) {
                setSelectedDevice(device);
            }
        }
    }, [devices]);

    // Handle device selection
    const handleDeviceSelect = (deviceId: string) => {
        const device = devices.find((d) => d.device_id === deviceId);
        setSelectedDevice(device || null);
        localStorage.setItem("selectedDeviceId", deviceId);
    };

    // Load measurement data
    const loadMeasurements = useCallback(async () => {
        if (!selectedDevice) return;

        setLoading(true);
        try {
            let query = supabase
                .from("measurement_data")
                .select("*")
                .eq("device_id", selectedDevice.device_id)
                .order("measurement_date_time", { ascending: true });

            // Apply date range filter if selected
            if (dateRange?.start && dateRange?.end) {
                const startDate = dateRange.start.toDate("UTC");
                const endDate = dateRange.end.toDate("UTC");
                query = query.gte("measurement_date_time", startDate.toISOString()).lte("measurement_date_time", endDate.toISOString());
            } else {
                // Default to last 100 measurements if no date range
                query = query.limit(100);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error loading measurements:", error);
                return;
            }

            setMeasurements(data || []);
        } catch (error) {
            console.error("Error loading measurements:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedDevice, dateRange]);

    // Process measurements into chart data
    useEffect(() => {
        if (!measurements.length) {
            setChartData([]);
            setStats({ average: 0, high: 0, low: 0 });
            return;
        }

        const processedData: ChartDataPoint[] = measurements.map((measurement) => ({
            time: new Date(measurement.measurement_date_time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "numeric",
            }),
            temperature: measurement.measurement_temperature,
            // Add humidity and dew point when available in the data
            humidity: undefined, // These would come from additional columns if available
            dewPoint: undefined,
        }));

        // Calculate statistics
        const temperatures = measurements.map((m) => m.measurement_temperature);
        const average = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
        const high = Math.max(...temperatures);
        const low = Math.min(...temperatures);

        setChartData(processedData);
        setStats({ average, high, low });
    }, [measurements]);

    // Load data on component mount and when device changes
    useEffect(() => {
        loadMeasurements();
    }, [selectedDevice, loadMeasurements]);

    // Handle "All" checkbox
    const handleShowAll = (checked: boolean) => {
        setShowAll(checked);
        setShowTemperature(checked);
        setShowHumidity(checked);
        setShowDewPoint(checked);
    };

    // Handle individual checkboxes
    const handleIndividualCheck = (type: "temperature" | "humidity" | "dewPoint", checked: boolean) => {
        switch (type) {
            case "temperature":
                setShowTemperature(checked);
                break;
            case "humidity":
                setShowHumidity(checked);
                break;
            case "dewPoint":
                setShowDewPoint(checked);
                break;
        }

        // The useEffect will handle synchronizing the "All" checkbox automatically
    };

    const handleLogout = () => {
        localStorage.removeItem("selectedDeviceId");
        navigate("/");
    };

    // Handle date range application
    const handleDateRangeApply = () => {
        loadMeasurements();
    };

    // Generate sample measurement data for testing
    const generateSampleData = async () => {
        if (!selectedDevice) {
            alert("Please select a device first from Device Information page");
            return;
        }

        setLoading(true);
        try {
            const sampleMeasurements: MeasurementDataInsert[] = [];
            const now = new Date();

            // Generate 50 temperature readings over the last 24 hours
            for (let i = 0; i < 50; i++) {
                const timeOffset = ((24 * 60 * 60 * 1000) / 50) * i; // Spread over 24 hours
                const measurementTime = new Date(now.getTime() - timeOffset);

                // Generate realistic temperature data (15-30°C with some variation)
                const baseTemp = 22; // Base temperature
                const variation = Math.sin(i * 0.1) * 5; // Sine wave variation
                const noise = (Math.random() - 0.5) * 2; // Random noise
                const temperature = Math.round((baseTemp + variation + noise) * 10) / 10;

                sampleMeasurements.push({
                    device_id: selectedDevice.device_id,
                    user_id: 1, // Default user ID - in real app this would come from current user
                    measurement_date_time: measurementTime.toISOString(),
                    measurement_temperature: temperature,
                    measurement_humidity: 45 + Math.random() * 10, // Random humidity 45-55%
                    measurement_dew_point: temperature - 5 + Math.random() * 3, // Reasonable dew point
                    device_temperature_unit: "C",
                });
            }

            const { error } = await measurementOperations.addMeasurements(sampleMeasurements);

            if (error) {
                console.error("Error adding sample measurements:", error);
                alert("Failed to generate sample data");
            } else {
                alert("Sample data generated successfully!");
                loadMeasurements(); // Reload the chart
            }
        } catch (error) {
            console.error("Error generating sample data:", error);
            alert("Failed to generate sample data");
        } finally {
            setLoading(false);
        }
    };

    const formatTooltipValue = (value: number, name: string) => {
        return [`${value.toFixed(1)}°`, name];
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />

            <div className="flex-1 px-8 pt-8 pb-12">
                {/* Page header section */}
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        {/* Welcome and action buttons */}
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex-1">
                                <h1 className="text-xl font-semibold text-gray-900">Welcome back, Olivia</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button color="secondary" onClick={() => navigate("/device-information")} className="px-4 py-2 text-sm font-semibold">
                                    Device Info
                                </Button>
                                <Button color="secondary" className="px-4 py-2 text-sm font-semibold">
                                    Graphs
                                </Button>
                                <Button color="secondary" onClick={handleLogout} className="px-4 py-2 text-sm font-semibold">
                                    Logout
                                </Button>
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

                    {/* Date picker and action buttons */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Date Range Picker */}
                            <DateRangePicker value={dateRange} onChange={setDateRange} onApply={handleDateRangeApply} />
                        </div>
                        <div className="flex gap-2">
                            <Button color="secondary" onClick={loadMeasurements} className="px-4 py-2 text-sm font-semibold">
                                Refresh Data
                            </Button>
                            <Button color="primary" onClick={generateSampleData} className="px-4 py-2 text-sm font-semibold" disabled={loading}>
                                Generate Sample Data
                            </Button>
                        </div>
                    </div>

                    {/* Graph Type Selections */}
                    <div className="mb-6 flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Checkbox isSelected={showTemperature} onChange={(checked) => handleIndividualCheck("temperature", checked)} />
                            <span className="text-sm font-bold text-brand-600">Temperature</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox isSelected={showHumidity} onChange={(checked) => handleIndividualCheck("humidity", checked)} />
                            <span className="text-sm font-bold text-brand-600">Humidity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox isSelected={showDewPoint} onChange={(checked) => handleIndividualCheck("dewPoint", checked)} />
                            <span className="text-sm font-bold text-brand-600">Dew Point</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox isSelected={showAll} onChange={handleShowAll} />
                            <span className="text-sm font-bold text-brand-600">All</span>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <div className="mb-4">
                            <h2 className="text-sm font-semibold text-gray-900">
                                Temperature{selectedDevice ? ` - ${selectedDevice.user_device_name || selectedDevice.device_name}` : ""}
                            </h2>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5">
                            {loading ? (
                                <div className="flex h-64 items-center justify-center">
                                    <div className="text-gray-500">Loading chart data...</div>
                                </div>
                            ) : chartData.length === 0 ? (
                                <div className="flex h-64 items-center justify-center">
                                    <div className="text-gray-500">No data available for the selected time period</div>
                                </div>
                            ) : (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                                            <YAxis stroke="#6b7280" fontSize={12} />
                                            <Tooltip
                                                formatter={formatTooltipValue}
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                }}
                                            />

                                            {/* Temperature line */}
                                            {showTemperature && (
                                                <Line
                                                    type="monotone"
                                                    dataKey="temperature"
                                                    stroke="#1c78bf"
                                                    strokeWidth={2}
                                                    dot={false}
                                                    activeDot={{ r: 4, stroke: "#1c78bf", strokeWidth: 2, fill: "white" }}
                                                />
                                            )}

                                            {/* Statistical reference lines */}
                                            {showTemperature && stats.average > 0 && (
                                                <>
                                                    <ReferenceLine
                                                        y={stats.average}
                                                        stroke="#9e77ed"
                                                        strokeDasharray="5 5"
                                                        strokeWidth={2}
                                                        label={`Avg: ${stats.average.toFixed(1)}°`}
                                                    />
                                                    <ReferenceLine
                                                        y={stats.high}
                                                        stroke="#ef4444"
                                                        strokeDasharray="5 5"
                                                        strokeWidth={2}
                                                        label={`High: ${stats.high.toFixed(1)}°`}
                                                    />
                                                    <ReferenceLine
                                                        y={stats.low}
                                                        stroke="#22c55e"
                                                        strokeDasharray="5 5"
                                                        strokeWidth={2}
                                                        label={`Low: ${stats.low.toFixed(1)}°`}
                                                    />
                                                </>
                                            )}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Chart;
