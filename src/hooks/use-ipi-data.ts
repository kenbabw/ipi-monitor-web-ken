// IPI Monitor specific database hooks
import { useEffect, useState } from 'react'
import { supabase, supabaseUntyped } from '@/lib/supabase'
import { useSupabase } from '@/providers/supabase-provider'
import type { 
  AppUser, 
  Device, 
  DeviceInsert, 
  DeviceUpdate, 
  MeasurementData, 
  MeasurementDataInsert 
} from '@/lib/types/database-ipi.types'
import type { PostgrestError } from '@supabase/supabase-js'

// Hook to get current user's app_user record
export function useCurrentAppUser() {
  const { user } = useSupabase()
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PostgrestError | null>(null)

  useEffect(() => {
    if (!user) {
      setAppUser(null)
      setLoading(false)
      return
    }

    const fetchAppUser = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('app_user')
        .select('*')
        .eq('auth_user', user.id)
        .single()

      if (error) {
        setError(error)
      } else {
        setAppUser(data)
      }
      setLoading(false)
    }

    fetchAppUser()
  }, [user])

  return { appUser, loading, error }
}

// Hook to get user's devices
export function useUserDevices() {
  const { appUser } = useCurrentAppUser()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PostgrestError | null>(null)

  useEffect(() => {
    if (!appUser) {
      setDevices([])
      setLoading(false)
      return
    }

    const fetchDevices = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('device')
        .select('*')
        .eq('user_id', appUser.user_id)
        .order('device_last_uploaded', { ascending: false })

      if (error) {
        setError(error)
      } else {
        setDevices(data || [])
      }
      setLoading(false)
    }

    fetchDevices()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`devices-${appUser.user_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'device',
          filter: `user_id=eq.${appUser.user_id}`
        },
        () => {
          fetchDevices() // Refetch on any change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [appUser])

  return { devices, loading, error }
}

// Hook to manage a specific device
export function useDevice(deviceId: string, userId?: number) {
  const [device, setDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PostgrestError | null>(null)

  useEffect(() => {
    if (!deviceId || !userId) {
      setDevice(null)
      setLoading(false)
      return
    }

    const fetchDevice = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('device')
        .select('*')
        .eq('device_id', deviceId)
        .eq('user_id', userId)
        .single()

      if (error) {
        setError(error)
      } else {
        setDevice(data)
      }
      setLoading(false)
    }

    fetchDevice()

    // Subscribe to real-time changes for this specific device
    const subscription = supabase
      .channel(`device-${deviceId}-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'device',
          filter: `device_id=eq.${deviceId}.and.user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setDevice(null)
          } else {
            setDevice(payload.new as Device)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [deviceId, userId])

  return { device, loading, error }
}

// Device management functions
export const deviceOperations = {
  // Add a new device
  addDevice: async (device: DeviceInsert) => {
    const { data, error } = await supabaseUntyped
      .from('device')
      .insert(device)
      .select()
      .single()

    return { data, error }
  },

  // Update a device
  updateDevice: async (deviceId: string, userId: number, updates: DeviceUpdate) => {
    const { data, error } = await supabaseUntyped
      .from('device')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('device_id', deviceId)
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  },

  // Delete a device
  deleteDevice: async (deviceId: string, userId: number) => {
    const { error } = await supabaseUntyped
      .from('device')
      .delete()
      .eq('device_id', deviceId)
      .eq('user_id', userId)

    return { error }
  },

  // Update device thresholds
  updateThresholds: async (
    deviceId: string, 
    userId: number, 
    thresholds: {
      device_low_temperature_threshhold?: number
      device_high_temperature_threshhold?: number
      device_low_humidity_threshhold?: number
      device_high_humidity_threshhold?: number
      device_high_dew_point?: number
      device_low_dew_point?: number
    }
  ) => {
    const { data, error } = await supabaseUntyped
      .from('device')
      .update({ ...thresholds, updated_at: new Date().toISOString() })
      .eq('device_id', deviceId)
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  },

  // Update device battery level
  updateBatteryLevel: async (deviceId: string, userId: number, batteryLevel: number) => {
    const { data, error } = await supabaseUntyped
      .from('device')
      .update({ 
        device_battery: batteryLevel,
        device_last_uploaded: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('device_id', deviceId)
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  },

  // Update last polled timestamp
  updateLastPolled: async (deviceId: string, userId: number) => {
    const { data, error } = await supabaseUntyped
      .from('device')
      .update({ 
        device_last_polled: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('device_id', deviceId)
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  }
}

// Hook to get measurement data for a device
export function useDeviceMeasurements(deviceId?: string, userId?: number, limit: number = 100) {
  const [measurements, setMeasurements] = useState<MeasurementData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PostgrestError | null>(null)

  useEffect(() => {
    if (!deviceId || !userId) {
      setMeasurements([])
      setLoading(false)
      return
    }

    const fetchMeasurements = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('measurement_data')
        .select('*')
        .eq('device_id', deviceId)
        .eq('user_id', userId)
        .order('measurement_date_time', { ascending: false })
        .limit(limit)

      if (error) {
        setError(error)
      } else {
        setMeasurements(data || [])
      }
      setLoading(false)
    }

    fetchMeasurements()

    // Subscribe to real-time changes for measurements
    const subscription = supabase
      .channel(`measurements-${deviceId}-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'measurement_data',
          filter: `device_id=eq.${deviceId}.and.user_id=eq.${userId}`
        },
        () => {
          fetchMeasurements() // Refetch on any change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [deviceId, userId, limit])

  return { measurements, loading, error }
}

// Hook to get recent measurements for all user devices
export function useRecentMeasurements(hoursBack: number = 24) {
  const { appUser } = useCurrentAppUser()
  const [measurements, setMeasurements] = useState<MeasurementData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PostgrestError | null>(null)

  useEffect(() => {
    if (!appUser) {
      setMeasurements([])
      setLoading(false)
      return
    }

    const fetchRecentMeasurements = async () => {
      setLoading(true)
      const cutoffTime = new Date()
      cutoffTime.setHours(cutoffTime.getHours() - hoursBack)

      const { data, error } = await supabase
        .from('measurement_data')
        .select('*')
        .eq('user_id', appUser.user_id)
        .gte('measurement_date_time', cutoffTime.toISOString())
        .order('measurement_date_time', { ascending: false })

      if (error) {
        setError(error)
      } else {
        setMeasurements(data || [])
      }
      setLoading(false)
    }

    fetchRecentMeasurements()
  }, [appUser, hoursBack])

  return { measurements, loading, error }
}

// App User operations
export const appUserOperations = {
  // Update user profile
  updateProfile: async (userId: number, updates: { user_first_name?: string; user_last_name?: string }) => {
    const { data, error } = await supabaseUntyped
      .from('app_user')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  },

  // Get user by auth_user UUID
  getUserByAuthId: async (authUserId: string) => {
    const { data, error } = await supabase
      .from('app_user')
      .select('*')
      .eq('auth_user', authUserId)
      .single()

    return { data, error }
  }
}

// Measurement data operations
export const measurementOperations = {
  // Add new measurement
  addMeasurement: async (measurement: MeasurementDataInsert) => {
    const { data, error } = await supabaseUntyped
      .from('measurement_data')
      .insert(measurement)
      .select()
      .single()

    return { data, error }
  },

  // Add multiple measurements (batch insert)
  addMeasurements: async (measurements: MeasurementDataInsert[]) => {
    const { data, error } = await supabaseUntyped
      .from('measurement_data')
      .insert(measurements)
      .select()

    return { data, error }
  },

  // Get measurements for device in date range
  getMeasurementsInRange: async (
    deviceId: string,
    userId: number,
    startDate: string,
    endDate: string
  ) => {
    const { data, error } = await supabase
      .from('measurement_data')
      .select('*')
      .eq('device_id', deviceId)
      .eq('user_id', userId)
      .gte('measurement_date_time', startDate)
      .lte('measurement_date_time', endDate)
      .order('measurement_date_time', { ascending: true })

    return { data, error }
  },

  // Get latest measurement for a device
  getLatestMeasurement: async (deviceId: string, userId: number) => {
    const { data, error } = await supabase
      .from('measurement_data')
      .select('*')
      .eq('device_id', deviceId)
      .eq('user_id', userId)
      .order('measurement_date_time', { ascending: false })
      .limit(1)
      .single()

    return { data, error }
  },

  // Delete old measurements (cleanup)
  deleteOldMeasurements: async (userId: number, daysToKeep: number = 30) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const { error } = await supabaseUntyped
      .from('measurement_data')
      .delete()
      .eq('user_id', userId)
      .lt('measurement_date_time', cutoffDate.toISOString())

    return { error }
  }
}