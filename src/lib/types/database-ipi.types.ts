// TypeScript definitions for IPI Monitor Supabase database
// Generate updated types using: npm run supabase:generate-types

export interface Database {
  public: {
    Tables: {
      app_user: {
        Row: {
          user_id: number
          user_first_name: string | null
          user_last_name: string | null
          auth_user: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id?: number
          user_first_name?: string | null
          user_last_name?: string | null
          auth_user?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: number
          user_first_name?: string | null
          user_last_name?: string | null
          auth_user?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      device: {
        Row: {
          device_id: string
          user_id: number
          device_name: string
          user_device_name: string | null
          device_interval: number
          device_temperature_unit: string
          device_battery: number
          device_low_temperature_threshhold: number
          device_high_temperature_threshhold: number
          device_low_humidity_threshhold: number
          device_high_humidity_threshhold: number
          device_high_dew_point: number
          device_low_dew_point: number
          device_last_polled: string
          device_last_uploaded: string
          created_at: string
          updated_at: string
        }
        Insert: {
          device_id: string
          user_id: number
          device_name: string
          user_device_name?: string | null
          device_interval: number
          device_temperature_unit: string
          device_battery: number
          device_low_temperature_threshhold: number
          device_high_temperature_threshhold: number
          device_low_humidity_threshhold: number
          device_high_humidity_threshhold: number
          device_high_dew_point: number
          device_low_dew_point: number
          device_last_polled: string
          device_last_uploaded: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          device_id?: string
          user_id?: number
          device_name?: string
          user_device_name?: string | null
          device_interval?: number
          device_temperature_unit?: string
          device_battery?: number
          device_low_temperature_threshhold?: number
          device_high_temperature_threshhold?: number
          device_low_humidity_threshhold?: number
          device_high_humidity_threshhold?: number
          device_high_dew_point?: number
          device_low_dew_point?: number
          device_last_polled?: string
          device_last_uploaded?: string
          created_at?: string
          updated_at?: string
        }
      }
      measurement_data: {
        Row: {
          measurement_sk: number
          user_id: number
          device_id: string
          measurement_date_time: string
          measurement_temperature: number
          measurement_humidity: number
          measurement_dew_point: number
          device_temperature_unit: string
          created_at: string
        }
        Insert: {
          measurement_sk?: number
          user_id: number
          device_id: string
          measurement_date_time: string
          measurement_temperature: number
          measurement_humidity: number
          measurement_dew_point: number
          device_temperature_unit: string
          created_at?: string
        }
        Update: {
          measurement_sk?: number
          user_id?: number
          device_id?: string
          measurement_date_time?: string
          measurement_temperature?: number
          measurement_humidity?: number
          measurement_dew_point?: number
          device_temperature_unit?: string
          created_at?: string
        }
      }
    }
    Views: {
      // Add your view definitions here
    }
    Functions: {
      // Add your function definitions here
    }
    Enums: {
      // Add your enum definitions here
    }
  }
}

// Helper types for easier usage
export type AppUser = Database['public']['Tables']['app_user']['Row']
export type AppUserInsert = Database['public']['Tables']['app_user']['Insert']
export type AppUserUpdate = Database['public']['Tables']['app_user']['Update']

export type Device = Database['public']['Tables']['device']['Row']
export type DeviceInsert = Database['public']['Tables']['device']['Insert']
export type DeviceUpdate = Database['public']['Tables']['device']['Update']

export type MeasurementData = Database['public']['Tables']['measurement_data']['Row']
export type MeasurementDataInsert = Database['public']['Tables']['measurement_data']['Insert']
export type MeasurementDataUpdate = Database['public']['Tables']['measurement_data']['Update']