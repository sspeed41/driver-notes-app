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