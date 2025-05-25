import React from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';

interface ActionButtonsProps {
  handleSaveNote: () => void;
  handleExportCSV: () => void;
  handleExportToSheets: () => void;
  clearAllNotes: () => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  hasNotes: boolean;
  noteText: string;
  selectedDriver: string;
  isSaving?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleSaveNote,
  noteText,
  selectedDriver,
  isSaving = false,
}) => {
  const canSave = noteText.trim() !== '' && selectedDriver !== '' && !isSaving;

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <button
        onClick={handleSaveNote}
        disabled={!canSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors text-lg font-medium ${
          canSave
            ? 'bg-[#7cff00] hover:bg-[#6be600] text-black'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSaving ? (
          <>
            <FaSpinner className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FaSave />
            Save Note to Google Sheets
          </>
        )}
      </button>

      <div className="text-sm text-gray-400">
        <p>Notes are automatically saved to your Google Sheet for real-time access and analysis.</p>
      </div>
    </div>
  );
};

export default ActionButtons; 