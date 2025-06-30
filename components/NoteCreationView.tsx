import React from 'react';
import { drivers } from '../data/drivers';
import NoteTypeSelector from './NoteTypeSelector';
import NoteInputSection from './NoteInputSection';
import DiagnosticPanel from './DiagnosticPanel';
import { DriverNote } from '../types/interfaces';

interface NoteCreationViewProps {
  selectedDriver: string;
  noteText: string;
  isRecording: boolean;
  isSaving: boolean;
  selectedTags: string[];
  showTagDropdown: boolean;
  selectedNoteType: 'Note' | 'Focus';
  saveStatus: { success?: boolean; message?: string };
  recentNotes: DriverNote[];
  loadingRecentNotes: boolean;
  lastRefreshTime: Date | null;
  onDriverChange: (driver: string) => void;
  onNoteTextChange: (text: string) => void;
  onRecord: () => void;
  onSaveNote: () => void;
  onToggleTagDropdown: () => void;
  onTagSelect: (tag: string) => void;
  onNoteTypeChange: (type: 'Note' | 'Focus') => void;
  onRefreshNotes: () => void;
  hapticFeedback: () => void;
}

const NoteCreationView: React.FC<NoteCreationViewProps> = ({
  selectedDriver,
  noteText,
  isRecording,
  isSaving,
  selectedTags,
  showTagDropdown,
  selectedNoteType,
  saveStatus,
  recentNotes,
  loadingRecentNotes,
  lastRefreshTime,
  onDriverChange,
  onNoteTextChange,
  onRecord,
  onSaveNote,
  onToggleTagDropdown,
  onTagSelect,
  onNoteTypeChange,
  onRefreshNotes,
  hapticFeedback
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Driver Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <i className="fas fa-user-circle text-blue-500 text-xl"></i>
          <h2 className="text-lg font-semibold text-gray-900">Driver</h2>
        </div>
        <select 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg text-gray-900 bg-white"
          value={selectedDriver}
          onChange={(e) => onDriverChange(e.target.value)}
        >
          <option value="" className="text-gray-500">Select driver...</option>
          {drivers.map(driver => (
            <option key={driver} value={driver} className="text-gray-900">{driver}</option>
          ))}
        </select>
      </div>

      {/* Note Type Selection */}
      <NoteTypeSelector
        selectedType={selectedNoteType}
        onTypeChange={onNoteTypeChange}
        hapticFeedback={hapticFeedback}
      />

      {/* Note Input Section */}
      <NoteInputSection
        selectedDriver={selectedDriver}
        noteText={noteText}
        isRecording={isRecording}
        isSaving={isSaving}
        selectedTags={selectedTags}
        showTagDropdown={showTagDropdown}
        saveStatus={saveStatus}
        onNoteTextChange={onNoteTextChange}
        onRecord={onRecord}
        onSaveNote={onSaveNote}
        onToggleTagDropdown={onToggleTagDropdown}
        onTagSelect={onTagSelect}
        hapticFeedback={hapticFeedback}
      />

      {/* Diagnostic Panel - Development Only */}
      <DiagnosticPanel
        recentNotes={recentNotes}
        loadingRecentNotes={loadingRecentNotes}
        lastRefreshTime={lastRefreshTime}
        onRefresh={onRefreshNotes}
      />
    </div>
  );
};

export default NoteCreationView; 