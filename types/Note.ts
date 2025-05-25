export interface Note {
  id: string;
  driver: string;
  noteTaker: string;
  note: string;
  timestamp: string;
  tags?: string[];
}

export interface Driver {
  id: string;
  name: string;
  active: boolean;
}

export interface NoteTaker {
  id: string;
  name: string;
  active: boolean;
} 