// Utility functions for handling dates and timestamps

export const parseTimestamp = (timestamp: string): Date => {
  // Handle various timestamp formats
  if (!timestamp || timestamp === 'Invalid Date') {
    return new Date(); // Return current date for invalid timestamps
  }

  // Try parsing as ISO string first
  if (timestamp.includes('T') && timestamp.includes('Z')) {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try parsing as locale string (e.g., "5/26/2025, 4:11:19 PM")
  if (timestamp.includes('/') && timestamp.includes(',')) {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try parsing as just date
  const date = new Date(timestamp);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Fallback to current date
  console.warn('Could not parse timestamp:', timestamp);
  return new Date();
};

export const formatTimestamp = (timestamp: string): string => {
  const date = parseTimestamp(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export const formatFullTimestamp = (timestamp: string): string => {
  const date = parseTimestamp(timestamp);
  return date.toLocaleString();
};

export const isValidTimestamp = (timestamp: string): boolean => {
  if (!timestamp || timestamp === 'Invalid Date') {
    return false;
  }
  const date = parseTimestamp(timestamp);
  return !isNaN(date.getTime());
}; 