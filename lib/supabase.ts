import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      driver_notes: {
        Row: {
          id: string
          driver: string
          note_taker: string
          note: string
          timestamp: string
          type: 'Note' | 'Focus' | null
          tags: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver: string
          note_taker: string
          note: string
          timestamp: string
          type?: 'Note' | 'Focus' | null
          tags?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver?: string
          note_taker?: string
          note?: string
          timestamp?: string
          type?: 'Note' | 'Focus' | null
          tags?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          note_id: string
          driver: string
          original_note: string
          reminder_message: string
          reminder_datetime: string
          created_by: string
          is_completed: boolean
          is_dismissed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          note_id: string
          driver: string
          original_note: string
          reminder_message: string
          reminder_datetime: string
          created_by: string
          is_completed?: boolean
          is_dismissed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          note_id?: string
          driver?: string
          original_note?: string
          reminder_message?: string
          reminder_datetime?: string
          created_by?: string
          is_completed?: boolean
          is_dismissed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 