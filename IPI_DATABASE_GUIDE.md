# IPI Monitor Database Integration Guide

This guide explains how to work with your IPI Monitor specific database tables in your React application.

## 📊 Database Schema Overview

Your application uses three main tables:

### `app_user` Table

Links Supabase authentication users to your application users.

- `user_id`: Primary key (auto-generated)
- `user_first_name`, `user_last_name`: User's name
- `auth_user`: Foreign key to Supabase auth.users table
- `created_at`, `updated_at`: Timestamps

### `device` Table

Stores IoT device information for monitoring.

- `device_id`: MAC address of the device (primary key with user_id)
- `user_id`: Foreign key to app_user table
- `device_name`: Manufacturer device name
- `user_device_name`: Custom name set by user
- `device_interval`: Polling interval in seconds
- `device_temperature_unit`: Temperature unit (Celsius/Fahrenheit)
- `device_battery`: Battery level (0-100)
- Threshold settings for temperature, humidity, and dew point
- `device_last_polled`, `device_last_uploaded`: Timestamps

### `measurement_data` Table

Stores actual sensor readings from devices.

- `measurement_sk`: Primary key (auto-generated)
- `user_id`, `device_id`: Composite foreign key to device table
- `measurement_date_time`: When the measurement was taken
- `measurement_temperature`: Temperature reading
- `measurement_humidity`: Humidity reading (percentage)
- `measurement_dew_point`: Dew point calculation
- `device_temperature_unit`: Unit for temperature reading
- `created_at`: When record was inserted

## 🚀 Setup and Migration

### 1. Apply the Migration

```bash
# If using local Supabase
npm run supabase:start
npm run supabase:reset

# If using remote Supabase
npx supabase link --project-ref your-project-id
npm run supabase:migrate
```

### 2. Generate Types (Optional)

```bash
# Generate types from your actual database
npm run supabase:generate-types
```

### 3. Add Seed Data (Optional)

```bash
# Edit supabase/seed.sql with your test data first
npm run supabase:seed
```

## 💻 Using in Your React Components

### Basic Usage Examples

#### Getting Current User's Profile

```tsx
import { useCurrentAppUser } from "@/hooks/use-ipi-data";

function UserProfile() {
    const { appUser, loading, error } = useCurrentAppUser();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Welcome, {appUser?.user_first_name}!</h1>
            <p>User ID: {appUser?.user_id}</p>
        </div>
    );
}
```

#### Displaying User's Devices

```tsx
import { useUserDevices } from "@/hooks/use-ipi-data";

function DevicesList() {
    const { devices, loading, error } = useUserDevices();

    if (loading) return <div>Loading devices...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Your Devices ({devices.length})</h2>
            {devices.map((device) => (
                <div key={`${device.user_id}-${device.device_id}`}>
                    <h3>{device.user_device_name || device.device_name}</h3>
                    <p>Battery: {device.device_battery}%</p>
                    <p>Last Updated: {new Date(device.device_last_uploaded).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}
```

#### Managing Device Settings

```tsx
import { deviceOperations } from "@/hooks/use-ipi-data";

function DeviceSettings({ device, onUpdate }) {
    const updateThresholds = async () => {
        const { data, error } = await deviceOperations.updateThresholds(device.device_id, device.user_id, {
            device_low_temperature_threshhold: 15.0,
            device_high_temperature_threshhold: 30.0,
        });

        if (!error) {
            onUpdate(); // Refresh the data
        }
    };

    return (
        <div>
            <button onClick={updateThresholds}>Update Temperature Thresholds</button>
        </div>
    );
}
```

## 🔧 Available Hooks and Operations

### Hooks

- `useCurrentAppUser()` - Gets current user's profile
- `useUserDevices()` - Gets all devices for current user with real-time updates
- `useDevice(deviceId, userId)` - Gets specific device with real-time updates
- `useDeviceMeasurements(deviceId, userId, limit)` - Gets measurement data for a device
- `useRecentMeasurements(hoursBack)` - Gets recent measurements for all user devices

### Device Operations

```tsx
import { deviceOperations } from "@/hooks/use-ipi-data";

// Add new device
await deviceOperations.addDevice({
    device_id: "00:1B:44:11:3A:B7",
    user_id: 1,
    device_name: "IPI-TEMP-001",
    // ... other required fields
});

// Update device settings
await deviceOperations.updateDevice(deviceId, userId, {
    user_device_name: "Living Room Sensor",
    device_interval: 300,
});

// Update battery level
await deviceOperations.updateBatteryLevel(deviceId, userId, 85.5);

// Update thresholds
await deviceOperations.updateThresholds(deviceId, userId, {
    device_low_temperature_threshhold: 10.0,
    device_high_temperature_threshhold: 30.0,
});

// Delete device
await deviceOperations.deleteDevice(deviceId, userId);
```

### App User Operations

```tsx
import { appUserOperations } from "@/hooks/use-ipi-data";

// Update user profile
await appUserOperations.updateProfile(userId, {
    user_first_name: "John",
    user_last_name: "Doe",
});

// Get user by auth ID
const { data: user } = await appUserOperations.getUserByAuthId(authUserId);
```

### Measurement Data Operations

```tsx
import { measurementOperations } from "@/hooks/use-ipi-data";

// Add new measurement
await measurementOperations.addMeasurement({
    user_id: 1,
    device_id: "00:1B:44:11:3A:B7",
    measurement_date_time: new Date().toISOString(),
    measurement_temperature: 23.5,
    measurement_humidity: 65.2,
    measurement_dew_point: 17.8,
    device_temperature_unit: "Celsius",
});

// Add multiple measurements (batch)
await measurementOperations.addMeasurements([
    {
        /* measurement 1 */
    },
    {
        /* measurement 2 */
    },
]);

// Get measurements in date range
const { data } = await measurementOperations.getMeasurementsInRange(deviceId, userId, "2023-01-01T00:00:00Z", "2023-01-02T00:00:00Z");

// Get latest measurement
const { data: latest } = await measurementOperations.getLatestMeasurement(deviceId, userId);

// Clean up old measurements (keep last 30 days)
await measurementOperations.deleteOldMeasurements(userId, 30);
```

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:

- Users can only see their own data
- Users can only modify their own records
- Automatic user creation on signup

### Authentication Integration

- Automatic `app_user` record creation when users sign up
- Seamless integration with Supabase Auth
- Protected API endpoints

## 🔄 Real-time Updates

The hooks automatically subscribe to real-time changes:

```tsx
// This component will automatically update when devices change
function RealtimeDevices() {
    const { devices } = useUserDevices(); // Real-time updates included!

    return (
        <div>
            {devices.map((device) => (
                <DeviceCard key={device.device_id} device={device} />
            ))}
        </div>
    );
}
```

## 📱 Example Implementation

Check out the complete example in `src/components/ipi/devices-dashboard.tsx` which demonstrates:

- Loading states
- Error handling
- Real-time updates
- Device management
- Battery status monitoring

## 🛠️ Testing Your Implementation

### 1. Create Test Users

```tsx
// Use your auth example component or create users through Supabase Auth
```

### 2. Add Test Devices

```tsx
// Use the deviceOperations.addDevice() function
// Or add them directly through Supabase Studio
```

### 3. Monitor Real-time Updates

- Open multiple browser tabs
- Make changes in one tab
- Watch updates appear in other tabs automatically

## 🚨 Common Gotchas

1. **MAC Address Format**: Device IDs should be valid MAC addresses
2. **User ID Relationships**: Always ensure the user_id exists in app_user table
3. **Timestamp Formats**: Use ISO string format for timestamps
4. **Battery Values**: Battery should be 0-100 (real/float type)
5. **RLS Policies**: Make sure users are authenticated before accessing data

## 📚 Next Steps

1. Customize the device threshold ranges for your specific use case
2. Add more device properties as needed
3. Implement data visualization for device readings
4. Add push notifications for threshold alerts
5. Create device grouping/rooms functionality

This integration provides a solid foundation for your IPI monitoring application with real-time capabilities, security, and TypeScript support!
