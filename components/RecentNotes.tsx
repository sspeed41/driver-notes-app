import React from 'react';
import { DriverNote } from '../types/interfaces';
import DriverLogo from './DriverLogo';
import { shouldShowNoteForUser, getRoleColor, getRoleDisplayName } from '../utils/roleMapping';

interface RecentNotesProps {
  recentNotes: DriverNote[];
  loadingRecentNotes: boolean;
  lastRefreshTime: Date | null;
  selectedNoteTaker: string;
  myViewEnabled?: boolean;
  onRefresh: () => void;
  onReplyToNote: (note: DriverNote) => void;
  onSetReminder: (note: DriverNote) => void;
  onDeleteNote: (note: DriverNote) => void;
  hasActiveReminder: (index: number) => boolean;
  hapticFeedback: () => void;
}

const RecentNotes: React.FC<RecentNotesProps> = ({
  recentNotes,
  loadingRecentNotes,
  lastRefreshTime,
  selectedNoteTaker,
  myViewEnabled = false,
  onRefresh,
  onReplyToNote,
  onSetReminder,
  onDeleteNote,
  hasActiveReminder,
  hapticFeedback
}) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Unknown time';
    }
  };

  const formatLastRefreshTime = () => {
    if (!lastRefreshTime) return '';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastRefreshTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Updated just now';
    if (diffInMinutes < 60) return `Updated ${diffInMinutes}m ago`;
    return `Updated ${Math.floor(diffInMinutes / 60)}h ago`;
  };

  // Filter notes based on My View setting
  const filteredNotes = recentNotes.filter(note => 
    shouldShowNoteForUser(note, selectedNoteTaker, myViewEnabled)
  );

  const getRoleColorClass = (noteTaker: string) => {
    const color = getRoleColor(noteTaker);
    switch (color) {
      case 'purple': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <i className="fas fa-clock text-blue-500 text-xl"></i>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Notes
              {myViewEnabled && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({getRoleDisplayName(selectedNoteTaker)} View)
                </span>
              )}
            </h2>
            {lastRefreshTime && (
              <p className="text-sm text-gray-500">{formatLastRefreshTime()}</p>
            )}
          </div>
        </div>
        <button 
          onClick={() => { onRefresh(); hapticFeedback(); }}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          disabled={loadingRecentNotes}
        >
          <i className={`fas fa-sync-alt text-sm ${loadingRecentNotes ? 'animate-spin' : ''}`}></i>
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {loadingRecentNotes ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading recent notes...</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-sticky-note text-gray-300 text-4xl mb-4"></i>
          <p className="text-gray-500">
            {myViewEnabled 
              ? `No ${getRoleDisplayName(selectedNoteTaker).toLowerCase()} notes found. Try switching to "All Notes" view.`
              : 'No recent notes found. Create your first note above!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note, index) => {
            // Add safety checks for note data
            if (!note || !note.Driver || !note.Note) {
              console.warn('Invalid note data:', note);
              return null;
            }

            const originalIndex = recentNotes.findIndex(originalNote => 
              originalNote.Driver === note.Driver && 
              originalNote.Timestamp === note.Timestamp &&
              originalNote.Note === note.Note
            );

            return (
              <div key={`${note.Driver}-${note.Timestamp}-${index}`} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-start space-x-4">
                  <DriverLogo driverName={note.Driver} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{note.Driver}</span>
                      {note.Type === 'Focus' && (
                        <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                          🎯 Focus
                        </span>
                      )}
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{note['Note Taker'] || 'Unknown'}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">
                        {note.Timestamp ? formatTimestamp(note.Timestamp) : 'Unknown time'}
                      </span>
                    </div>
                    {/* Note Content with Comments */}
                    <div className="text-gray-700 text-sm leading-relaxed mb-3">
                      {note.Note.split('\n').map((line, lineIndex) => {
                        // Check if this line is a comment (starts with "Comment by")
                        if (line.includes('Comment by ')) {
                          const parts = line.split('Comment by ');
                          return (
                            <div key={lineIndex} className="mt-2 pl-4 border-l-2 border-blue-200 bg-blue-50 p-2 rounded-r">
                              <div className="text-blue-600 text-xs font-medium mb-1">
                                💬 Comment by {parts[1]?.split(':')[0] || 'Unknown'}
                              </div>
                              <div className="text-gray-700">
                                {parts[1]?.substring(parts[1].indexOf(':') + 1)?.trim() || ''}
                              </div>
                            </div>
                          );
                        }
                        
                        // Regular note content with hashtag highlighting
                        return (
                          <div key={lineIndex}>
                            {line.split('#').map((textPart, j) => 
                              j === 0 ? textPart : (
                                <span key={j}>
                                  <span className="text-blue-500 font-medium">#{textPart.split(' ')[0]}</span>
                                  {textPart.substring(textPart.indexOf(' '))}
                                </span>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Tags */}
                    {note.Tags && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {note.Tags.split(',').map((tag: string, tagIndex: number) => (
                          <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => { onReplyToNote(note); hapticFeedback(); }}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <i className="fas fa-reply text-xs"></i>
                        <span>Reply</span>
                      </button>
                      <button 
                        onClick={() => { onSetReminder(note); hapticFeedback(); }}
                        className={`flex items-center space-x-1 text-sm ${
                          hasActiveReminder(originalIndex) 
                            ? 'text-orange-600 hover:text-orange-700' 
                            : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        <i className={`fas ${hasActiveReminder(originalIndex) ? 'fa-bell' : 'fa-bell-slash'} text-xs`}></i>
                        <span>{hasActiveReminder(originalIndex) ? 'Reminder Set' : 'Set Reminder'}</span>
                      </button>
                      <button 
                        onClick={() => { onDeleteNote(note); hapticFeedback(); }}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                      >
                        <i className="fas fa-trash text-xs"></i>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentNotes; 