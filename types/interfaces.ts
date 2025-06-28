export interface DriverNote {
  // Google Sheets format (legacy)
  Driver: string;
  'Note Taker': string;
  Note: string;
  Timestamp: string;
  Type?: 'Note' | 'Focus';
  Tags?: string;
  
  // Supabase format (new) - optional for backwards compatibility
  id?: string;
  driver?: string;
  note_taker?: string;
  note?: string;
  timestamp?: string;
  type?: 'Note' | 'Focus';
  tags?: string;
  created_at?: string;
  updated_at?: string;
  
  // Additional fields for reminders
  originalNote?: string;
  reminderMessage?: string;
  reminderDateTime?: string;
  createdBy?: string;
  isCompleted?: boolean;
  isDismissed?: boolean;
}

export interface Reminder {
  id: string;
  noteId: string;
  driver: string;
  originalNote: string;
  reminderMessage: string;
  reminderDateTime: string;
  createdBy: string;
  isCompleted: boolean;
  isDismissed?: boolean;
} 