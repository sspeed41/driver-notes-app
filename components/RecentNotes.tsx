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
      
      if (diffInMinutes < 1) return 'now';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
      return date.toLocaleDateString();
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <i className="fas fa-clock text-blue-500 text-lg"></i>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Notes
              {myViewEnabled && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({getRoleDisplayName(selectedNoteTaker)} View)
                </span>
              )}
            </h2>
            {lastRefreshTime && (
              <p className="text-xs text-gray-500">{formatLastRefreshTime()}</p>
            )}
          </div>
        </div>
        <button 
          onClick={() => { onRefresh(); hapticFeedback(); }}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          disabled={loadingRecentNotes}
        >
          <i className={`fas fa-sync-alt text-sm ${loadingRecentNotes ? 'animate-spin' : ''}`}></i>
        </button>
      </div>

      {loadingRecentNotes ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12 px-4">
          <i className="fas fa-sticky-note text-gray-300 text-4xl mb-4"></i>
          <p className="text-gray-500">
            {myViewEnabled 
              ? `No ${getRoleDisplayName(selectedNoteTaker).toLowerCase()} notes found.`
              : 'No recent notes found. Create your first note!'
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
              <div key={`${note.Driver}-${note.Timestamp}-${index}`} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <DriverLogo driverName={note.Driver} size="sm" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm">{note.Driver}</span>
                      <span className="text-gray-500 text-sm">@{note['Note Taker']?.replace(' ', '').toLowerCase() || 'unknown'}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500 text-sm">
                        {note.Timestamp ? formatTimestamp(note.Timestamp) : '?'}
                      </span>
                      {note.Type === 'Focus' && (
                        <>
                          <span className="text-gray-400">·</span>
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            🎯 Focus
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Note Content */}
                    <div className="text-gray-900 text-sm leading-normal mb-2">
                      {note.Note.split('\n').map((line, lineIndex) => {
                        // Check if this line is a comment
                        if (line.includes('commented:') || line.includes('Comment by')) {
                          return (
                            <div key={lineIndex} className="mt-2 pl-3 border-l-2 border-blue-200 bg-blue-50 p-2 rounded-r text-xs">
                              <div className="text-blue-600 font-medium mb-1">
                                💬 {line.split(':')[0]}
                              </div>
                              <div className="text-gray-700">
                                {line.substring(line.indexOf(':') + 1)?.trim()}
                              </div>
                            </div>
                          );
                        }
                        
                        // Regular note content with hashtag highlighting
                        return (
                          <div key={lineIndex} className="mb-1">
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
                      <div className="flex flex-wrap gap-1 mb-2">
                        {note.Tags.split(',').map((tag: string, tagIndex: number) => (
                          <span key={tagIndex} className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons - Twitter style */}
                    <div className="flex items-center space-x-6 mt-2">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onReplyToNote(note); 
                          hapticFeedback(); 
                        }}
                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors group"
                      >
                        <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                          <i className="fas fa-comment text-xs"></i>
                        </div>
                        <span className="text-xs">Reply</span>
                      </button>
                      
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onSetReminder(note); 
                          hapticFeedback(); 
                        }}
                        className={`flex items-center space-x-1 transition-colors group ${
                          hasActiveReminder(originalIndex) 
                            ? 'text-orange-500' 
                            : 'text-gray-500 hover:text-orange-500'
                        }`}
                      >
                        <div className="p-2 rounded-full group-hover:bg-orange-50 transition-colors">
                          <i className={`fas ${hasActiveReminder(originalIndex) ? 'fa-bell' : 'fa-bell-slash'} text-xs`}></i>
                        </div>
                        <span className="text-xs">
                          {hasActiveReminder(originalIndex) ? 'Set' : 'Remind'}
                        </span>
                      </button>
                      
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onDeleteNote(note); 
                          hapticFeedback(); 
                        }}
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors group"
                      >
                        <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                          <i className="fas fa-trash text-xs"></i>
                        </div>
                        <span className="text-xs">Delete</span>
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