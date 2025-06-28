export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
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

export const hapticFeedback = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
};

export const extractTags = (text: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const matches = text.match(tagRegex) || [];
  return matches.map(tag => tag.substring(1).toLowerCase());
};

// Get faint color for driver avatar based on racing series
export const getDriverSeriesColor = (driverName: string): { bgColor: string; textColor: string } => {
  // Cup drivers - Faint red
  const cupDrivers = ['Kyle Larson', 'Alex Bowman', 'Ross Chastain', 'Daniel Suarez', 'Austin Dillon'];
  
  // Xfinity drivers - Faint blue  
  const xfinityDrivers = ['Connor Zilisch', 'Carson Kvapil', 'Austin Hill', 'Jesse Love', 'Nick Sanchez', 'Daniel Dye'];
  
  // Truck drivers - Faint green
  const truckDrivers = ['Grant Enfinger', 'Daniel Hemric', 'Connor Mosack', 'Kaden Honeycutt', 'Rajah Caruth', 'Andres Perez', 'Matt Mills', 'Dawson Sutton'];
  
  // Junior drivers - Faint white/gray
  const juniorDrivers = ['Tristan McKee', 'Helio Meza', 'Corey Day', 'Ben Maier', 'Tyler Reif', 'Brenden Queen'];

  if (cupDrivers.includes(driverName)) {
    return { bgColor: 'bg-red-100', textColor: 'text-red-700' };
  } else if (xfinityDrivers.includes(driverName)) {
    return { bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
  } else if (truckDrivers.includes(driverName)) {
    return { bgColor: 'bg-green-200', textColor: 'text-green-800' };
  } else if (juniorDrivers.includes(driverName)) {
    return { bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
  } else {
    // Default fallback
    return { bgColor: 'bg-gray-200', textColor: 'text-gray-600' };
  }
}; 