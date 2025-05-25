import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DriverSelect from '@/components/DriverSelect';
import NoteTakerSelect from '@/components/NoteTakerSelect';
import NoteInput from '@/components/NoteInput';
import ActionButtons from '@/components/ActionButtons';
import { Note } from '@/types/Note';

const Index = () => {
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedNoteTaker, setSelectedNoteTaker] = useState<string>('');
  const [noteText, setNoteText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sheetsStatus, setSheetsStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // Reset status message after 5 seconds
  useEffect(() => {
    if (sheetsStatus.message) {
      const timer = setTimeout(() => {
        setSheetsStatus({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sheetsStatus]);

  const extractTags = (text: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = text.match(tagRegex);
    return matches ? matches.map((tag) => tag.slice(1)) : [];
  };

  const handleSaveNote = async () => {
    if (!selectedDriver || !selectedNoteTaker || !noteText.trim()) return;

    setIsSaving(true);

    const newNote: Note = {
      id: uuidv4(),
      driver: selectedDriver,
      noteTaker: selectedNoteTaker,
      note: noteText.trim(),
      timestamp: new Date().toISOString(),
      tags: extractTags(noteText),
    };

    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: [newNote] }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSheetsStatus({
          success: false,
          message: `Error: ${data.message || 'Failed to save note'}`,
        });
        return;
      }

      setSheetsStatus({
        success: true,
        message: 'Note saved successfully to Google Sheets!',
      });

      // Clear the note text after successful save
      setNoteText('');
    } catch (error) {
      console.error('Error saving note:', error);
      setSheetsStatus({
        success: false,
        message: 'Network error. Please check your connection.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCSV = () => {
    setSheetsStatus({
      success: false,
      message: 'CSV export is no longer available. All notes are saved directly to Google Sheets.',
    });
  };

  const clearAllNotes = () => {
    setSheetsStatus({
      success: false,
      message: 'To clear notes, please delete them directly from your Google Sheet.',
    });
  };

  const canSaveNote = selectedDriver !== '' && selectedNoteTaker !== '' && noteText.trim() !== '';

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#7cff00]">Driver Notes App</h1>
          <p className="text-gray-300">Record and save driver notes directly to Google Sheets</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-900 rounded-lg shadow p-4 border border-[#7cff00]/30">
            <h2 className="text-xl font-semibold text-[#7cff00] mb-4">Select Driver</h2>
            <DriverSelect selectedDriver={selectedDriver} setSelectedDriver={setSelectedDriver} />
          </div>

          <div className="md:col-span-1 bg-gray-900 rounded-lg shadow p-4 border border-[#7cff00]/30">
            <h2 className="text-xl font-semibold text-[#7cff00] mb-4">Select Note Taker</h2>
            <NoteTakerSelect selectedNoteTaker={selectedNoteTaker} setSelectedNoteTaker={setSelectedNoteTaker} />
          </div>

          <div className="md:col-span-1 bg-gray-900 rounded-lg shadow p-4 border border-[#7cff00]/30">
            <h2 className="text-xl font-semibold text-[#7cff00] mb-4">Note Input</h2>
            <NoteInput
              noteText={noteText}
              setNoteText={setNoteText}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          </div>

          <div className="md:col-span-3 bg-gray-900 rounded-lg shadow p-4 border border-[#7cff00]/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#7cff00]">Actions</h2>
              <span className="text-gray-400">
                Notes save directly to Google Sheets
              </span>
            </div>
            <ActionButtons
              handleSaveNote={handleSaveNote}
              handleExportCSV={handleExportCSV}
              handleExportToSheets={handleSaveNote}
              clearAllNotes={clearAllNotes}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              hasNotes={false}
              noteText={noteText}
              selectedDriver={selectedDriver}
              isSaving={isSaving}
            />

            {sheetsStatus.message && (
              <div
                className={`mt-4 p-3 rounded ${
                  sheetsStatus.success ? 'bg-green-800/50 text-green-200' : 'bg-red-800/50 text-red-200'
                }`}
              >
                {sheetsStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index; 