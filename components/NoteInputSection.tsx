import React from 'react';

interface NoteInputSectionProps {
  selectedDriver: string;
  noteText: string;
  isRecording: boolean;
  isSaving: boolean;
  selectedTags: string[];
  showTagDropdown: boolean;
  saveStatus: { success?: boolean; message?: string };
  onNoteTextChange: (text: string) => void;
  onRecord: () => void;
  onSaveNote: () => void;
  onToggleTagDropdown: () => void;
  onTagSelect: (tag: string) => void;
  hapticFeedback: () => void;
}

const tagOptions = ['physical', 'psychological', 'tactical', 'technical'];

const NoteInputSection: React.FC<NoteInputSectionProps> = ({
  selectedDriver,
  noteText,
  isRecording,
  isSaving,
  selectedTags,
  showTagDropdown,
  saveStatus,
  onNoteTextChange,
  onRecord,
  onSaveNote,
  onToggleTagDropdown,
  onTagSelect,
  hapticFeedback
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 note-input-section">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <i className="fas fa-microphone text-blue-500 text-xl"></i>
          <h2 className="text-lg font-semibold text-gray-900">Voice Notes</h2>
        </div>
        <button 
          onClick={() => { onRecord(); hapticFeedback(); }}
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-colors ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} text-sm`}></i>
          <span className="text-sm">{isRecording ? 'Stop' : 'Record'}</span>
        </button>
      </div>
      
      <div className="relative mb-4">
        <textarea 
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors text-lg text-gray-900 bg-white placeholder-gray-500"
          placeholder="What's happening with the driver? Tap the microphone to start voice recording or type directly..."
          value={noteText}
          onChange={(e) => onNoteTextChange(e.target.value)}
          style={{ minHeight: '128px', maxHeight: '200px' }}
        />
        
        {/* Character count */}
        <div className={`absolute bottom-3 right-3 text-sm ${
          noteText.length > 280 ? 'text-red-500' : 'text-gray-500'
        }`}>
          {noteText.length} / 280
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative tag-dropdown-container">
            <button 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              onClick={onToggleTagDropdown}
            >
              <i className="fas fa-hashtag"></i>
              <span className="text-sm">Tags</span>
              {selectedTags.length > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                  {selectedTags.length}
                </span>
              )}
            </button>
            
            {/* Tag Dropdown */}
            {showTagDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-48">
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Select Tags:</p>
                  <div className="space-y-2">
                    {tagOptions.map((tag) => (
                      <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => onTagSelect(tag)}
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">#{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
            onClick={hapticFeedback}
          >
            <i className="fas fa-clock"></i>
            <span className="text-sm">Time</span>
          </button>
        </div>
        
        <button 
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-lg"
          onClick={() => { onSaveNote(); hapticFeedback(); }}
          disabled={isSaving || !selectedDriver || !noteText.trim()}
        >
          {isSaving ? 'Saving...' : 'Save Note'}
        </button>
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span 
              key={tag} 
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              #{tag}
              <button
                onClick={() => onTagSelect(tag)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Save Status */}
      {saveStatus.message && (
        <div
          className={`mt-4 p-3 rounded-xl ${
            saveStatus.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {saveStatus.message}
        </div>
      )}
    </div>
  );
};

export default NoteInputSection; 