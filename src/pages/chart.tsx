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
import { supabase } from "@/lib/supabase";
import type { Device, MeasurementData } from "@/lib/types/database-ipi.types";
import { useSupabase } from "@/providers/supabase-provider";

interface ChartDataPoint {
    time: string;
    temperature: number;
    humidity: number;
    dewPoint: number;
}

interface ChartStats {
    average: number;
    high: number;
    low: number;
}

interface HumidityStats {
    average: number;
    high: number;
    low: number;
}

interface DewPointStats {
    average: number;
    high: number;
    low: number;
}

// Helper function to calculate Y-axis domain with 5 unit padding and round to nearest multiple of 5
const calculateYAxisDomain = (low: number, high: number): [number, number] => {
    const paddedLow = low - 5;
    const paddedHigh = high + 5;

    // Round down to nearest multiple of 5 for min
    const roundedMin = Math.floor(paddedLow / 5) * 5;

    // Round up to nearest multiple of 5 for max
    const roundedMax = Math.ceil(paddedHigh / 5) * 5;

    return [roundedMin, roundedMax];
};

const Chart = () => {
    const navigate = useNavigate();
    const { user, signOut } = useSupabase();
    const { devices } = useUserDevices();
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [temperatureStats, setTemperatureStats] = useState<ChartStats>({ average: 0, high: 0, low: 0 });
    const [humidityStats, setHumidityStats] = useState<HumidityStats>({ average: 0, high: 0, low: 0 });
    const [dewPointStats, setDewPointStats] = useState<DewPointStats>({ average: 0, high: 0, low: 0 });
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState<string>("");

    // Chart display options
    const [showTemperature, setShowTemperature] = useState(false);
    const [showHumidity, setShowHumidity] = useState(false);
    const [showDewPoint, setShowDewPoint] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // Date range for filtering
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

    // Check if both device and date range are selected to enable checkboxes
    const canSelectCharts = selectedDevice !== null && dateRange !== null;

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

    // Fetch user data for welcome message
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

    // Initialize user data on component mount
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

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
                .select("measurement_date_time, measurement_temperature, measurement_humidity, measurement_dew_point")
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
            setTemperatureStats({ average: 0, high: 0, low: 0 });
            setHumidityStats({ average: 0, high: 0, low: 0 });
            setDewPointStats({ average: 0, high: 0, low: 0 });
            return;
        }

        const processedData: ChartDataPoint[] = measurements.map((measurement) => {
            const date = new Date(measurement.measurement_date_time);
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            return {
                time: `${month}/${day} ${hours}:${minutes}`,
                temperature: measurement.measurement_temperature,
                humidity: measurement.measurement_humidity || 0,
                dewPoint: measurement.measurement_dew_point || 0,
            };
        });

        // Calculate statistics
        const temperatures = measurements.map((m) => m.measurement_temperature);
        const tempAverage = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
        const tempHigh = Math.max(...temperatures);
        const tempLow = Math.min(...temperatures);

        const humidities = measurements.map((m) => m.measurement_humidity || 0).filter((h) => h > 0);
        const humidityAverage = humidities.length > 0 ? humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length : 0;
        const humidityHigh = humidities.length > 0 ? Math.max(...humidities) : 0;
        const humidityLow = humidities.length > 0 ? Math.min(...humidities) : 0;

        const dewPoints = measurements.map((m) => m.measurement_dew_point || 0).filter((d) => d !== 0);
        const dewPointAverage = dewPoints.length > 0 ? dewPoints.reduce((sum, dew) => sum + dew, 0) / dewPoints.length : 0;
        const dewPointHigh = dewPoints.length > 0 ? Math.max(...dewPoints) : 0;
        const dewPointLow = dewPoints.length > 0 ? Math.min(...dewPoints) : 0;

        setChartData(processedData);
        setTemperatureStats({ average: tempAverage, high: tempHigh, low: tempLow });
        setHumidityStats({ average: humidityAverage, high: humidityHigh, low: humidityLow });
        setDewPointStats({ average: dewPointAverage, high: dewPointHigh, low: dewPointLow });
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
        // Navigate immediately and let the logout page handle the signOut
        navigate("/logout", { replace: true });
        // Call signOut asynchronously without waiting
        signOut().catch((err) => {
            console.error("Error during logout:", err);
        });
    };

    // Handle date range application
    const handleDateRangeApply = () => {
        loadMeasurements();
    };

    const formatTooltipValue = (value: number, name: string) => {
        return [`${value.toFixed(1)}°`, name];
    };

    return (
        <div className="relative min-h-screen border border-solid border-black bg-white" data-name="Charts">
            <div className="relative box-border flex min-h-screen flex-col content-stretch items-center gap-1 px-[20px] py-[4px] md:gap-2">
                <Header className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between bg-white px-[8px] py-[8px]" />

                {/* Main Content */}
                <div className="flex w-full flex-1 flex-col px-8 py-8">
                    {/* Page header section */}
                    <div className="w-full">
                        <div className="mb-6">
                            {/* Welcome and action buttons */}
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex flex-col items-start">
                                    <p className="text-[20px] leading-[30px] font-semibold text-[#181d27]">Welcome back, {userName}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button color="secondary" onClick={() => navigate("/device-information")} className="px-4 py-2 text-sm font-semibold">
                                        Device Info
                                    </Button>
                                    <Button color="secondary" className="px-4 py-2 text-sm font-semibold">
                                        Charts
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
                                    className="w-full max-w-[300px]"
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

                        {/* Date picker */}
                        <div className="mb-6 flex items-center justify-start">
                            <div className="flex items-center gap-4">
                                {/* Date Range Picker */}
                                <DateRangePicker value={dateRange} onChange={setDateRange} onApply={handleDateRangeApply} isDisabled={!selectedDevice} />
                                {!selectedDevice && <span className="text-sm text-gray-500 italic">Select a device to enable date filtering</span>}
                            </div>
                        </div>

                        {/* Chart Type Selections */}
                        <div className="mb-6 flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    isSelected={showTemperature}
                                    onChange={(checked) => handleIndividualCheck("temperature", checked)}
                                    isDisabled={!canSelectCharts}
                                />
                                <span className={`text-sm font-bold ${!canSelectCharts ? "opacity-50" : ""}`} style={{ color: "#ef4444" }}>
                                    Temperature
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    isSelected={showHumidity}
                                    onChange={(checked) => handleIndividualCheck("humidity", checked)}
                                    isDisabled={!canSelectCharts}
                                />
                                <span className={`text-sm font-bold ${!canSelectCharts ? "opacity-50" : ""}`} style={{ color: "#1c78bf" }}>
                                    Humidity
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    isSelected={showDewPoint}
                                    onChange={(checked) => handleIndividualCheck("dewPoint", checked)}
                                    isDisabled={!canSelectCharts}
                                />
                                <span className={`text-sm font-bold ${!canSelectCharts ? "opacity-50" : ""}`} style={{ color: "#f59e0b" }}>
                                    Dew Point
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox isSelected={showAll} onChange={handleShowAll} isDisabled={!canSelectCharts} />
                                <span className={`text-sm font-bold text-[#000000] ${!canSelectCharts ? "opacity-50" : ""}`}>All</span>
                            </div>
                        </div>

                        {/* Message when checkboxes are disabled */}
                        {!canSelectCharts && (
                            <div className="mb-4 text-sm text-gray-500 italic">
                                {!selectedDevice && !dateRange
                                    ? "Select a device and date range to enable chart options"
                                    : !selectedDevice
                                      ? "Select a device to enable chart options"
                                      : "Select a date range to enable chart options"}
                            </div>
                        )}

                        {/* Chart Section */}
                        {showTemperature && (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                                <div className="mb-4">
                                    <h2 className="text-sm font-semibold text-gray-900">Temperature</h2>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-5">
                                    {loading ? (
                                        <div className="flex h-80 items-center justify-center">
                                            <div className="text-gray-500">Loading chart data...</div>
                                        </div>
                                    ) : chartData.length === 0 ? (
                                        <div className="flex h-80 items-center justify-center">
                                            <div className="text-gray-500">No Temperature data available for the selected time period</div>
                                        </div>
                                    ) : (
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                                                    <YAxis
                                                        stroke="#6b7280"
                                                        fontSize={12}
                                                        domain={calculateYAxisDomain(temperatureStats.low, temperatureStats.high)}
                                                    />
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
                                                    <Line
                                                        type="monotone"
                                                        dataKey="temperature"
                                                        stroke="#ef4444"
                                                        strokeWidth={2}
                                                        dot={false}
                                                        activeDot={{ r: 4, stroke: "#ef4444", strokeWidth: 2, fill: "white" }}
                                                    />

                                                    {/* Statistical reference lines */}
                                                    {temperatureStats.average > 0 && (
                                                        <>
                                                            <ReferenceLine
                                                                y={temperatureStats.average}
                                                                stroke="#000000"
                                                                strokeDasharray="5 5"
                                                                strokeWidth={2}
                                                                label={{
                                                                    value: `Avg: ${temperatureStats.average.toFixed(1)}°`,
                                                                    position: "top",
                                                                    style: { fontWeight: "bold" },
                                                                }}
                                                            />
                                                            <ReferenceLine
                                                                y={temperatureStats.high}
                                                                stroke="#000000"
                                                                strokeDasharray="5 5"
                                                                strokeWidth={2}
                                                                label={{
                                                                    value: `High: ${temperatureStats.high.toFixed(1)}°`,
                                                                    position: "top",
                                                                    style: { fontWeight: "bold" },
                                                                }}
                                                            />
                                                            <ReferenceLine
                                                                y={temperatureStats.low}
                                                                stroke="#000000"
                                                                strokeDasharray="5 5"
                                                                strokeWidth={2}
                                                                label={{
                                                                    value: `Low: ${temperatureStats.low.toFixed(1)}°`,
                                                                    position: "bottom",
                                                                    style: { fontWeight: "bold" },
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Humidity Chart Section */}
                        {showHumidity && (
                            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
                                <div className="mb-4">
                                    <h2 className="text-sm font-semibold text-gray-900">Humidity</h2>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-5">
                                    {loading ? (
                                        <div className="flex h-80 items-center justify-center">
                                            <div className="text-gray-500">Loading humidity data...</div>
                                        </div>
                                    ) : chartData.length === 0 ? (
                                        <div className="flex h-80 items-center justify-center">
                                            <div className="text-gray-500">No Humidity data available for the selected time period</div>
                                        </div>
                                    ) : (
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                                                    <YAxis
                                                        stroke="#6b7280"
                                                        fontSize={12}
                                                        domain={calculateYAxisDomain(humidityStats.low, humidityStats.high)}
                                                    />
                                                    <Tooltip
                                                        formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                                                        contentStyle={{
                                                            backgroundColor: "white",
                                                            border: "1px solid #e5e7eb",
                                                            borderRadius: "8px",
                                                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                    />

                                                    {/* Humidity line */}
                                                    <Line
                                                        type="monotone"
                                                        dataKey="humidity"
                                                        stroke="#1c78bf"
                                                        strokeWidth={2}
                                                        dot={false}
                                                        activeDot={{ r: 4, stroke: "#1c78bf", strokeWidth: 2, fill: "white" }}
                                                    />

                                                    {/* Statistical reference lines */}
                                                    {humidityStats.average > 0 && (
                                                        <>
                                                            <ReferenceLine
                                                                y={humidityStats.average}
                                                                stroke="#000000"
                                                                strokeDasharray="5 5"
                                                                strokeWidth={2}
                                                                label={{
                                                                    value: `Avg: ${humidityStats.average.toFixed(1)}%`,
                                                                    position: "top",
                                                                    style: { fontWeight: "bold" },
                                                                }}
                                                            />
                                                            <ReferenceLine
                                                                y={humidityStats.high}
                                                                stroke="#000000"
                                                                strokeDasharray="5 5"
                                                                strokeWidth={2}
                                                                label={{
                                                                    value: `High: ${humidityStats.high.toFixed(1)}%`,
                                                                    position: "top",
                                                                    style: { fontWeight: "bold" },
                                                                }}
                                                            />
                                                            <ReferenceLine
                                                                y={humidityStats.low}
                                                                stroke="#000000"
                                                                strokeDasharray="5 5"
                                                                strokeWidth={2}
                                                                label={{
                                                                    value: `Low: ${humidityStats.low.toFixed(1)}%`,
                                                                    position: "bottom",
                                                                    style: { fontWeight: "bold" },
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Dew Point Chart Section */}
                        {showDewPoint && (
                            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
                                <div className="mb-4">
                                    <h2 className="text-sm font-semibold text-gray-900">Dew Point</h2>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-5">
                                    {loading ? (
                                        <div className="flex h-80 items-center justify-center">
                                            <div className="text-gray-500">Loading dew point data...</div>
                                        </div>
                                    ) : chartData.length === 0 ? (
                                        <div className="flex h-80 items-center justify-center">
                                            <div className="text-gray-500">No Dew Point data available for the selected time period</div>
                                        </div>
                                    ) : (
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                                                    <YAxis
                                                        stroke="#6b7280"
                                                        fontSize={12}
                                                        domain={calculateYAxisDomain(dewPointStats.low, dewPointStats.high)}
                                                    />
                                                    <Tooltip
                                                        formatter={(value: number, name: string) => [`${value.toFixed(1)}°`, name]}
                                                        contentStyle={{
                                                            backgroundColor: "white",
                                                            border: "1px solid #e5e7eb",
                                                            borderRadius: "8px",
                                                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                    />

                                                    {/* Dew Point line */}
                                                    <Line
                                                        type="monotone"
                                                        dataKey="dewPoint"
                                                        stroke="#f59e0b"
                                                        strokeWidth={2}
                                                        dot={false}
                                                        activeDot={{ r: 4, stroke: "#f59e0b", strokeWidth: 2, fill: "white" }}
                                                    />

                                                    {/* Statistical reference lines */}
                                                    {dewPointStats.average !== 0 && (
                                                        <>
                                                            <ReferenceLine
                                                                y={dewPointStats.average}
                                                                stroke="#000000"
                                                                strokeDasharray="5 5"
                                                                strokeWidth={2}
                                                                label={{
                                                                    value: `Avg: ${dewPointStats.average.toFixed(1)}°`,
                                                                    position: "top",
                                                                    style: { fontWeight: "bold" },
                                                                }}
                                                            />
                                                            <ReferenceLine
                                                                y={dewPointStats.high}
                                                                stroke="#000000"
                                                                strokeDasharray="5 5"
                                                                strokeWidth={2}
                                                                label={{
                                                                    value: `High: ${dewPointStats.high.toFixed(1)}°`,
                                                                    position: "top",
                                                                    style: { fontWeight: "bold" },
                                                                }}
                                                            />
                                                            <ReferenceLine
                                                                y={dewPointStats.low}
                                                                stroke="#000000"
                                                                strokeDasharray="5 5"
                                                                strokeWidth={2}
                                                                label={{
                                                                    value: `Low: ${dewPointStats.low.toFixed(1)}°`,
                                                                    position: "bottom",
                                                                    style: { fontWeight: "bold" },
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Footer className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-between px-[8px] py-[6px]" />
            </div>
        </div>
    );
};

export default Chart;
