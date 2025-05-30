import React from 'react';
import { DriverNote } from '../types/interfaces';
import { formatTimestamp } from '../utils/dateHelpers';
import DriverLogo from './DriverLogo';

interface RecentNotesProps {
  recentNotes: DriverNote[];
  loadingRecentNotes: boolean;
  lastRefreshTime: Date | null;
  onRefresh: () => void;
  onReplyToNote: (note: DriverNote) => void;
  onSetReminder: (note: DriverNote) => void;
  hasActiveReminder: (index: number) => boolean;
  hapticFeedback: () => void;
}

const RecentNotes: React.FC<RecentNotesProps> = ({
  recentNotes,
  loadingRecentNotes,
  lastRefreshTime,
  onRefresh,
  onReplyToNote,
  onSetReminder,
  hasActiveReminder,
  hapticFeedback
}) => {
  const getTimeSinceRefresh = () => {
    if (!lastRefreshTime) return null;
    const now = new Date();
    const diffMs = now.getTime() - lastRefreshTime.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'just now';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins === 1) return '1 minute ago';
    return `${diffMins} minutes ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Recent Notes</h3>
          {lastRefreshTime && (
            <p className="text-xs text-gray-500">
              Updated {getTimeSinceRefresh()} • Auto-refresh every 30s
            </p>
          )}
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-red-500">
              Debug: {recentNotes.length} notes loaded
            </p>
          )}
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all" 
          onClick={() => { 
            console.log('🔄 Manual refresh triggered');
            onRefresh(); 
            hapticFeedback(); 
          }}
          disabled={loadingRecentNotes}
        >
          <i className={`fas fa-sync-alt ${loadingRecentNotes ? 'animate-spin' : ''}`}></i>
        </button>
      </div>
      
      {/* Recent Notes Content */}
      {loadingRecentNotes ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading recent notes...</span>
          </div>
        </div>
      ) : recentNotes.length > 0 ? (
        recentNotes.map((note, index) => {
          // Add safety checks for note data
          if (!note || !note.Driver || !note.Note) {
            console.warn('⚠️ Skipping malformed note at index', index, note);
            return null;
          }

          return (
            <div key={`${note.Driver}-${note.Timestamp}-${index}`} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-colors">
              <div className="flex items-start space-x-4">
                <DriverLogo driverName={note.Driver} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{note.Driver}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">{note['Note Taker'] || 'Unknown'}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">
                      {note.Timestamp ? formatTimestamp(note.Timestamp) : 'Unknown time'}
                    </span>
                    {note.Type === 'Focus' && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center space-x-1">
                          <i className="fas fa-bullseye text-xs"></i>
                          <span>Focus</span>
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {note.Note.split('\n\n💬').map((part, i) => {
                      if (i === 0) {
                        // Original note content
                        return (
                          <span key={i}>
                            {part.split('#').map((textPart, j) => 
                              j === 0 ? textPart : <span key={j}><span className="text-blue-500">#{textPart.split(' ')[0]}</span>{textPart.substring(textPart.indexOf(' '))}</span>
                            )}
                          </span>
                        );
                      } else {
                        // Comment content - parse the comment and timestamp
                        let commentText = part;
                        let commentTimestamp = null;
                        
                        if (part.includes('\n📅 ')) {
                          // New format with calendar emoji
                          const commentParts = part.split('\n📅 ');
                          commentText = commentParts[0];
                          commentTimestamp = commentParts[1];
                        } else if (part.includes(' commented (') && part.includes('): ')) {
                          // Old format with full timestamp in parentheses
                          const match = part.match(/^(.+) commented \((.+)\): (.+)$/);
                          if (match) {
                            const [, author, timestamp, message] = match;
                            commentText = `${author} commented: ${message}`;
                            commentTimestamp = timestamp;
                          }
                        } else if (part.includes(' commented: ')) {
                          // Handle format like "Scott Speed 5/26/2025, 4:11:19 PM commented: message"
                          const match = part.match(/^(.+?) (\d+\/\d+\/\d+, \d+:\d+:\d+ [AP]M) commented: (.+)$/);
                          if (match) {
                            const [, author, timestamp, message] = match;
                            commentText = `${author} commented: ${message}`;
                            commentTimestamp = timestamp;
                          }
                        }
                        
                        return (
                          <div key={i} className="mt-3 pl-4 border-l-2 border-gray-200 bg-gray-50 rounded-r-lg p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start space-x-2">
                                  <i className="fas fa-comment text-gray-400 text-xs mt-1 flex-shrink-0"></i>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">
                                      {commentText}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {commentTimestamp && (
                                <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                                  {commentTimestamp.includes('T') ? formatTimestamp(commentTimestamp) : 
                                   commentTimestamp.includes('/') ? formatTimestamp(new Date(commentTimestamp).toISOString()) : 
                                   commentTimestamp}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </p>
                  {note.Tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.Tags.split(',').map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center space-x-6 text-gray-500">
                    <button 
                      className="flex items-center space-x-2 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      onClick={() => onReplyToNote(note)}
                    >
                      <i className="fas fa-comment text-sm"></i>
                      <span className="text-sm">Comment</span>
                    </button>
                    <button 
                      className={`flex items-center space-x-2 transition-colors p-2 rounded-lg hover:bg-gray-100 ${
                        hasActiveReminder(index)
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'hover:text-yellow-400'
                      }`}
                      onClick={() => onSetReminder(note)}
                    >
                      <i className={`fas fa-bell text-sm ${hasActiveReminder(index) ? 'text-yellow-400' : ''}`}></i>
                      {!hasActiveReminder(index) && <span className="text-sm">Remind</span>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }).filter(Boolean) // Remove null entries from malformed notes
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <i className="fas fa-clipboard-list text-gray-400 text-4xl mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Recent Notes
          </h3>
          <p className="text-gray-500 text-sm">
            Start by creating your first driver note above.
          </p>
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-red-500 mt-2">
              Debug: Check browser console for loading errors
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentNotes; 