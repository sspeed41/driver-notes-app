export interface UserRole {
  name: string;
  role: string;
  tags: string[];
  color: string;
}

export const userRoles: Record<string, UserRole> = {
  'Josh Wise': {
    name: 'Josh Wise',
    role: 'Psychology',
    tags: ['psychological'],
    color: 'purple'
  },
  'Scott Speed': {
    name: 'Scott Speed',
    role: 'Technical & Tactical',
    tags: ['technical', 'tactical'],
    color: 'blue'
  },
  'Dan Jansen': {
    name: 'Dan Jansen',
    role: 'Physical',
    tags: ['physical'],
    color: 'green'
  },
  'Dan Stratton': {
    name: 'Dan Stratton',
    role: 'General',
    tags: [], // No specific filtering for Dan Stratton
    color: 'gray'
  }
};

export const getUserRole = (noteTaker: string): UserRole | null => {
  return userRoles[noteTaker] || null;
};

export const shouldShowNoteForUser = (note: any, currentUser: string, myViewEnabled: boolean): boolean => {
  // TEMPORARY: Always show all notes to debug the issue
  console.log('🔍 shouldShowNoteForUser called:', { 
    noteDriver: note?.Driver, 
    noteTimestamp: note?.Timestamp,
    noteText: note?.Note?.substring(0, 50) + '...',
    currentUser, 
    myViewEnabled,
    noteValid: !!(note && note.Driver && note.Note && note.Timestamp)
  });
  return true;
  
  // Original logic (temporarily disabled)
  // if (!myViewEnabled) return true;
  // 
  // const userRole = getUserRole(currentUser);
  // if (!userRole || userRole.tags.length === 0) return true; // Show all for Dan Stratton or unknown users
  // 
  // // Check if note has any of the user's relevant tags
  // const noteTags = note.Tags ? note.Tags.toLowerCase().split(',').map((tag: string) => tag.trim()) : [];
  // const noteText = note.Note ? note.Note.toLowerCase() : '';
  // 
  // // Check if any of the user's tags appear in the note's tags or content
  // return userRole.tags.some(tag => 
  //   noteTags.includes(tag) || 
  //   noteText.includes(`#${tag}`) ||
  //   noteText.includes(tag)
  // );
};

export const getRoleColor = (noteTaker: string): string => {
  const role = getUserRole(noteTaker);
  return role ? role.color : 'gray';
};

export const getRoleDisplayName = (noteTaker: string): string => {
  const role = getUserRole(noteTaker);
  return role ? role.role : 'General';
}; 