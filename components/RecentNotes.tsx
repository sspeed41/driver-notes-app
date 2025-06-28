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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
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
        <div className="divide-y divide-gray-100">
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
              <div key={`${note.Driver}-${note.Timestamp}-${index}`} className="py-3 hover:bg-gray-50 transition-colors">
                {/* X-Style Compact Layout */}
                <div className="flex items-start space-x-3">
                  {/* Smaller Avatar */}
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gray-600">
                      {note.Driver ? note.Driver.split(' ').map(n => n[0]).join('').substring(0, 2) : '??'}
                    </span>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-1 min-w-0">
                    {/* X-Style Inline Header */}
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{note['Note Taker'] || 'Unknown'}</span>
                      <span className="text-gray-400 text-sm">@{note.Driver?.toLowerCase().replace(' ', '')}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">
                        {note.Timestamp ? formatTimestamp(note.Timestamp) : '?'}
                      </span>
                      {note.Type === 'Focus' && (
                        <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-medium ml-2">
                          🎯
                        </span>
                      )}
                    </div>
                    
                    {/* X-Style Tweet Content */}
                    <div className="text-gray-900 text-sm leading-relaxed mb-2">
                      {note.Note.split('\n').map((line, lineIndex) => {
                        // Check if this line is a comment
                        if (line.includes('Comment by ')) {
                          const parts = line.split('Comment by ');
                          return (
                            <div key={lineIndex} className="mt-2 pl-3 border-l-2 border-gray-300 bg-gray-50 p-2 rounded">
                              <div className="text-gray-600 text-xs font-medium mb-1">
                                💬 {parts[1]?.split(':')[0] || 'Unknown'}
                              </div>
                              <div className="text-gray-800 text-sm">
                                {parts[1]?.substring(parts[1].indexOf(':') + 1)?.trim() || ''}
                              </div>
                            </div>
                          );
                        }
                        
                        // Regular content with hashtag highlighting
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

                    {/* X-Style Action Buttons - More Compact */}
                    <div className="flex items-center space-x-6 text-gray-400 text-xs">
                      <button 
                        onClick={() => { onReplyToNote(note); hapticFeedback(); }}
                        className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                      >
                        <i className="fas fa-comment text-xs"></i>
                        <span>Reply</span>
                      </button>
                      <button 
                        onClick={() => { onSetReminder(note); hapticFeedback(); }}
                        className={`flex items-center space-x-1 transition-colors ${
                          hasActiveReminder(originalIndex) 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'hover:text-orange-500'
                        }`}
                      >
                        <i className={`fas ${hasActiveReminder(originalIndex) ? 'fa-bell' : 'fa-bell-slash'} text-xs`}></i>
                        <span>Remind</span>
                      </button>
                      <button 
                        onClick={() => { onDeleteNote(note); hapticFeedback(); }}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
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