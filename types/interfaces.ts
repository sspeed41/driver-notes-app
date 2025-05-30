export interface DriverNote {
  Driver: string;
  'Note Taker': string;
  Note: string;
  Timestamp: string;
  Type?: 'Note' | 'Focus';
  Tags?: string;
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