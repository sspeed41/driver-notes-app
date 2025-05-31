import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import UserSelection from '../components/UserSelection';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import Reminders from '../components/Reminders';
import NoteInputSection from '../components/NoteInputSection';
import NoteTypeSelector from '../components/NoteTypeSelector';
import RecentNotes from '../components/RecentNotes';
import AthleteDashboard from '../components/AthleteDashboard';
import DiagnosticPanel from '../components/DiagnosticPanel';
import { ReminderModal, ReminderDetailModal } from '../components/ReminderModal';
import { DriverNote, Reminder } from '../types/interfaces';
import { drivers } from '../data/drivers';
import { noteTakers } from '../data/noteTakers';
import { hapticFeedback, extractTags } from '../utils/helpers';

const Index = () => {
  // State management
  const [noteText, setNoteText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedNoteTaker, setSelectedNoteTaker] = useState('');
  const [showUserSelection, setShowUserSelection] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [recentNotes, setRecentNotes] = useState<DriverNote[]>([]);
  const [loadingRecentNotes, setLoadingRecentNotes] = useState(false);
  const [replyingToNote, setReplyingToNote] = useState<DriverNote | null>(null);
  
  // Athlete Dashboard state
  const [showAthleteDashboard, setShowAthleteDashboard] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [athleteNotes, setAthleteNotes] = useState<DriverNote[]>([]);
  const [loadingAthleteData, setLoadingAthleteData] = useState(false);
  
  // Reminder state
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderNote, setReminderNote] = useState<DriverNote | null>(null);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [showReminderDetail, setShowReminderDetail] = useState(false);
  const [selectedReminderDetail, setSelectedReminderDetail] = useState<Reminder | null>(null);
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  
  // Tag state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  
  // Note type state
  const [selectedNoteType, setSelectedNoteType] = useState<'Note' | 'Focus'>('Note');
  
  // Last refresh time
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  // Speech recognition ref
  const recognitionRef = useRef<any>(null);

  // Check if user is already selected from localStorage
  useEffect(() => {
    const savedNoteTaker = localStorage.getItem('selectedNoteTaker');
    if (savedNoteTaker && noteTakers.includes(savedNoteTaker)) {
      setSelectedNoteTaker(savedNoteTaker);
      setShowUserSelection(false);
    }
    
    // Load saved reminders
    const savedReminders = localStorage.getItem('activeReminders');
    if (savedReminders) {
      setActiveReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const dueReminders = activeReminders.filter(reminder => {
        const reminderTime = new Date(reminder.reminderDateTime);
        return !reminder.isCompleted && !reminder.isDismissed && reminderTime <= now;
      });

      if (dueReminders.length > 0) {
        // Show notification for due reminders
        dueReminders.forEach(reminder => {
          if (Notification.permission === 'granted') {
            new Notification(`Follow-up Reminder: ${reminder.driver}`, {
              body: reminder.reminderMessage,
              icon: '/images/W.O. LOGO - small.png'
            });
          }
        });
      }
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [activeReminders]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Reset status message after 5 seconds
  useEffect(() => {
    if (saveStatus.message) {
      const timer = setTimeout(() => {
        setSaveStatus({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Fetch recent notes on component mount (only if user is selected)
  useEffect(() => {
    if (!showUserSelection) {
      fetchRecentNotes();
      
      // Auto-refresh recent notes every 30 seconds
      const interval = setInterval(() => {
        // Only refresh if not in the middle of other operations
        if (!isSaving && !loadingRecentNotes && !showAthleteDashboard && !showReminderModal) {
          fetchRecentNotes();
        }
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [showUserSelection, isSaving, showAthleteDashboard, showReminderModal]);

  // Close tag dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showTagDropdown && !target.closest('.tag-dropdown-container')) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTagDropdown]);

  // User selection handlers
  const handleUserSelection = (noteTaker: string) => {
    setSelectedNoteTaker(noteTaker);
    localStorage.setItem('selectedNoteTaker', noteTaker);
    setShowUserSelection(false);
    hapticFeedback();
  };

  const handleChangeUser = () => {
    setShowUserSelection(true);
    localStorage.removeItem('selectedNoteTaker');
    hapticFeedback();
  };

  // Note handlers
  const handleReplyToNote = (note: DriverNote) => {
    setSelectedDriver(note.Driver);
    setNoteText(`💬 Comment: `);
    setReplyingToNote(note);
    
    // Scroll to the note input area
    const noteSection = document.querySelector('.note-input-section');
    if (noteSection) {
      noteSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Focus the textarea after a short delay
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }, 500);
    
    hapticFeedback();
    
    setSaveStatus({
      success: true,
      message: 'Ready to add comment. Type your message and save.'
    });
  };

  const handleSetReminder = (note: DriverNote) => {
    setReminderNote(note);
    setReminderMessage(`Follow up on: ${note.Note.substring(0, 50)}...`);
    
    // Set default reminder for tomorrow at 7 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);
    
    setReminderDate(tomorrow.toISOString().split('T')[0]);
    setReminderTime('07:00');
    setShowReminderModal(true);
    hapticFeedback();
  };

  const handleCreateReminder = () => {
    if (!reminderNote || !reminderDate || !reminderTime || !reminderMessage) return;
    
    const dateTime = new Date(`${reminderDate}T${reminderTime}`);
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      noteId: `note-${Date.now()}`,
      driver: reminderNote.Driver,
      originalNote: reminderNote.Note,
      reminderMessage: reminderMessage,
      reminderDateTime: dateTime.toISOString(),
      createdBy: selectedNoteTaker,
      isCompleted: false,
      isDismissed: false
    };
    
    const updatedReminders = [...activeReminders, newReminder];
    setActiveReminders(updatedReminders);
    localStorage.setItem('activeReminders', JSON.stringify(updatedReminders));
    
    setShowReminderModal(false);
    setReminderNote(null);
    setReminderMessage('');
    setReminderDate('');
    setReminderTime('');
    
    setSaveStatus({
      success: true,
      message: 'Reminder set successfully!'
    });
    
    hapticFeedback();
  };

  const handleCompleteReminder = (reminderId: string) => {
    const updatedReminders = activeReminders.map(r => 
      r.id === reminderId ? { ...r, isCompleted: true } : r
    );
    setActiveReminders(updatedReminders);
    localStorage.setItem('activeReminders', JSON.stringify(updatedReminders));
    hapticFeedback();
  };

  const handleDismissReminder = (reminderId: string) => {
    const updatedReminders = activeReminders.map(r => 
      r.id === reminderId ? { ...r, isDismissed: true } : r
    );
    setActiveReminders(updatedReminders);
    localStorage.setItem('activeReminders', JSON.stringify(updatedReminders));
    hapticFeedback();
  };

  const getDueReminders = () => {
    const now = new Date();
    return activeReminders.filter(reminder => {
      const reminderTime = new Date(reminder.reminderDateTime);
      return !reminder.isCompleted && !reminder.isDismissed && reminderTime <= now;
    });
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return activeReminders.filter(reminder => {
      const reminderTime = new Date(reminder.reminderDateTime);
      return !reminder.isCompleted && !reminder.isDismissed && 
             reminderTime > now && reminderTime <= tomorrow;
    });
  };

  const hasActiveReminder = (noteIndex: number) => {
    const note = recentNotes[noteIndex];
    if (!note) return false;
    
    return activeReminders.some(reminder => 
      !reminder.isCompleted && 
      !reminder.isDismissed && 
      reminder.driver === note.Driver &&
      reminder.originalNote === note.Note
    );
  };

  const clearAllReminders = () => {
    if (confirm('Are you sure you want to clear all reminders? This cannot be undone.')) {
      setActiveReminders([]);
      localStorage.removeItem('activeReminders');
      setSaveStatus({
        success: true,
        message: 'All reminders cleared'
      });
      hapticFeedback();
    }
  };

  const fetchRecentNotes = async () => {
    setLoadingRecentNotes(true);
    console.log('🔄 Fetching recent notes...');
    
    try {
      // Add cache-busting timestamp to prevent mobile caching issues
      const response = await fetch(`/api/sheets?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Raw data received:', data.length, 'notes');
        console.log('📊 First note sample:', data[0]);
        
        // Validate and clean the data
        const validNotes = data
          .filter((note: any) => {
            const isValid = note && 
                           note.Driver && 
                           note.Note && 
                           note.Timestamp && 
                           note.Timestamp !== 'Invalid Date';
            
            if (!isValid) {
              console.warn('⚠️ Invalid note filtered out:', note);
            }
            
            return isValid;
          })
          .map((note: DriverNote) => ({
            ...note,
            Type: note.Type || 'Note' // Ensure Type is set, default to 'Note' if not present
          }));
        
        console.log('✅ Valid notes after filtering:', validNotes.length);
        
        // Sort by timestamp with better error handling
        const sortedNotes = validNotes.sort((a: DriverNote, b: DriverNote) => {
          try {
            const dateA = new Date(a.Timestamp);
            const dateB = new Date(b.Timestamp);
            
            // Check if dates are valid
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
              console.warn('⚠️ Invalid timestamp found:', a.Timestamp, b.Timestamp);
              return 0; // Keep original order for invalid dates
            }
            
            return dateB.getTime() - dateA.getTime();
          } catch (error) {
            console.error('❌ Error sorting notes:', error);
            return 0;
          }
        });
        
        const recentNotesSlice = sortedNotes.slice(0, 10);
        console.log('📝 Setting recent notes:', recentNotesSlice.length, 'notes');
        
        setRecentNotes(recentNotesSlice);
        setLastRefreshTime(new Date());
        
        // Log success
        console.log('✅ Recent notes updated successfully');
        
      } else {
        console.error('❌ Failed to fetch recent notes - Status:', response.status);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        
        // Set error status for user feedback
        setSaveStatus({
          success: false,
          message: `Failed to load recent notes (${response.status}). Please try refreshing.`
        });
      }
    } catch (error) {
      console.error('❌ Error fetching recent notes:', error);
      
      // Set error status for user feedback
      setSaveStatus({
        success: false,
        message: 'Network error loading recent notes. Please check your connection and try again.'
      });
    } finally {
      setLoadingRecentNotes(false);
      console.log('🏁 Fetch recent notes completed');
    }
  };

  const handleRecord = () => {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!isRecording) {
      // Create new recognition instance
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.start();
      setIsRecording(true);

      recognition.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript) {
          const correctedTranscript = applyCorrections(finalTranscript);
          setNoteText(prev => prev ? `${prev} ${correctedTranscript}` : correctedTranscript);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        recognitionRef.current = null;
      };
    } else {
      // Stop the existing recognition instance
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsRecording(false);
    }

    // Function to apply racing-specific corrections
    const applyCorrections = (text: string): string => {
      const corrections: { [key: string]: string } = {
        'kyle larsen': 'Kyle Larson',
        'alex bowman': 'Alex Bowman',
        'ross chastain': 'Ross Chastain',
        'daniel suarez': 'Daniel Suarez',
        'loose': 'loose',
        'lose': 'loose',
        'break': 'brake',
        'breaks': 'brakes',
      };

      let correctedText = text.toLowerCase();
      Object.entries(corrections).forEach(([wrong, correct]) => {
        const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
        correctedText = correctedText.replace(regex, correct);
      });

      // Capitalize first letter of sentences
      correctedText = correctedText.replace(/(^|\. )([a-z])/g, (match, prefix, letter) => {
        return prefix + letter.toUpperCase();
      });

      return correctedText;
    };
  };

  const handleSaveNote = async () => {
    if (!selectedDriver || !noteText.trim()) {
      setSaveStatus({
        success: false,
        message: 'Please select a driver and enter a note'
      });
      return;
    }

    // Stop recording if microphone is still on
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
    }

    setIsSaving(true);
    hapticFeedback();

    try {
      let finalNoteText = noteText;
      
      // If this is a reply, append to the original note
      if (replyingToNote && noteText.startsWith('💬 Comment: ')) {
        const commentText = noteText.replace('💬 Comment: ', '');
        const timestamp = new Date().toISOString();
        
        // Update the original note with the comment
        const response = await fetch('/api/sheets', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            originalNote: replyingToNote,
            replyText: commentText,
            replyAuthor: selectedNoteTaker
          })
        });

        if (response.ok) {
          setSaveStatus({
            success: true,
            message: 'Comment added to original note successfully!'
          });
          setNoteText('');
          setReplyingToNote(null);
          // Add delay to ensure Google Sheets has updated
          setTimeout(() => {
            fetchRecentNotes();
          }, 1500);
        } else {
          throw new Error('Failed to add comment');
        }
      } else {
        // Regular note save
        const noteTags = selectedTags.length > 0 ? selectedTags : extractTags(noteText);
        
        const response = await fetch('/api/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notes: [{
              driver: selectedDriver,
              noteTaker: selectedNoteTaker,
              note: finalNoteText,
              timestamp: new Date().toISOString(),
              type: selectedNoteType,
              tags: noteTags
            }]
          })
        });

        if (response.ok) {
          setSaveStatus({
            success: true,
            message: `${selectedNoteType} saved successfully!`
          });
          setNoteText('');
          setSelectedTags([]);
          setSelectedNoteType('Note'); // Reset to default
          // Add delay to ensure Google Sheets has updated
          setTimeout(() => {
            fetchRecentNotes();
          }, 1500);
        } else {
          throw new Error('Failed to save note');
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveStatus({
        success: false,
        message: 'Failed to save note. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openAthleteDashboard = (athlete?: string) => {
    if (athlete) {
      setSelectedAthlete(athlete);
      fetchAthleteData(athlete);
    } else {
      setSelectedAthlete('');
    }
    setShowAthleteDashboard(true);
    hapticFeedback();
  };

  const fetchAthleteData = async (athlete: string) => {
    setLoadingAthleteData(true);
    try {
      // Add cache-busting timestamp to prevent mobile caching issues
      const response = await fetch(`/api/sheets?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Filter and sort notes for this athlete
        const athleteSpecificNotes = data
          .filter((note: DriverNote) => note.Driver === athlete)
          .map((note: DriverNote) => ({
            ...note,
            Type: note.Type || 'Note' // Ensure Type is set, default to 'Note' if not present
          }))
          .sort((a: DriverNote, b: DriverNote) => 
            new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
          );
        setAthleteNotes(athleteSpecificNotes);
      } else {
        console.error('Failed to fetch athlete data');
      }
    } catch (error) {
      console.error('Error fetching athlete data:', error);
    } finally {
      setLoadingAthleteData(false);
    }
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleTagDropdown = () => {
    setShowTagDropdown(!showTagDropdown);
    hapticFeedback();
  };

  return (
    <>
      <Head>
        <title>Wise Driver Notes V2</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Driver Notes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Driver Notes" />
        <meta name="description" content="Professional racing driver notes and feedback system" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/images/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/images/apple-touch-icon.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/images/icon-192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/icon-192.png" />
        
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }} />
      </Head>

      <div className="bg-black text-white min-h-screen">
        {/* User Selection Screen */}
        {showUserSelection ? (
          <UserSelection onUserSelect={handleUserSelection} />
        ) : (
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header 
              selectedNoteTaker={selectedNoteTaker}
              activeRemindersCount={activeReminders.length}
              onClearReminders={clearAllReminders}
              onChangeUser={handleChangeUser}
            />

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
              {/* Reminders */}
              <Reminders
                dueReminders={getDueReminders()}
                upcomingReminders={getUpcomingReminders()}
                onCompleteReminder={handleCompleteReminder}
                onDismissReminder={handleDismissReminder}
                onViewDetail={(reminder) => {
                  setSelectedReminderDetail(reminder);
                  setShowReminderDetail(true);
                  hapticFeedback();
                }}
                hapticFeedback={hapticFeedback}
              />

              {/* Driver Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="fas fa-user-circle text-blue-500 text-xl"></i>
                  <h2 className="text-lg font-semibold text-gray-900">Driver</h2>
                </div>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg text-gray-900 bg-white"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
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
                onTypeChange={setSelectedNoteType}
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
                onNoteTextChange={setNoteText}
                onRecord={handleRecord}
                onSaveNote={handleSaveNote}
                onToggleTagDropdown={toggleTagDropdown}
                onTagSelect={handleTagSelect}
                hapticFeedback={hapticFeedback}
              />

              {/* Diagnostic Panel - Development Only */}
              <DiagnosticPanel
                recentNotes={recentNotes}
                loadingRecentNotes={loadingRecentNotes}
                lastRefreshTime={lastRefreshTime}
                onRefresh={fetchRecentNotes}
              />

              {/* Recent Notes Feed */}
              <RecentNotes
                recentNotes={recentNotes}
                loadingRecentNotes={loadingRecentNotes}
                lastRefreshTime={lastRefreshTime}
                onRefresh={fetchRecentNotes}
                onReplyToNote={handleReplyToNote}
                onSetReminder={handleSetReminder}
                hasActiveReminder={hasActiveReminder}
                hapticFeedback={hapticFeedback}
              />
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation
              onOpenAthleteDashboard={() => openAthleteDashboard()}
              hapticFeedback={hapticFeedback}
            />

            {/* Athlete Dashboard */}
            <AthleteDashboard
              showAthleteDashboard={showAthleteDashboard}
              selectedAthlete={selectedAthlete}
              athleteNotes={athleteNotes}
              loadingAthleteData={loadingAthleteData}
              onSelectAthlete={setSelectedAthlete}
              onClose={() => setShowAthleteDashboard(false)}
              onFetchAthleteData={fetchAthleteData}
              hapticFeedback={hapticFeedback}
            />

            {/* Reminder Modal */}
            <ReminderModal
              showModal={showReminderModal}
              reminderNote={reminderNote}
              reminderMessage={reminderMessage}
              reminderDate={reminderDate}
              reminderTime={reminderTime}
              onClose={() => setShowReminderModal(false)}
              onSetReminderMessage={setReminderMessage}
              onSetReminderDate={setReminderDate}
              onSetReminderTime={setReminderTime}
              onCreateReminder={handleCreateReminder}
              hapticFeedback={hapticFeedback}
            />

            {/* Reminder Detail Modal */}
            <ReminderDetailModal
              showModal={showReminderDetail}
              selectedReminder={selectedReminderDetail}
              onClose={() => setShowReminderDetail(false)}
              onDismiss={handleDismissReminder}
              onComplete={handleCompleteReminder}
              hapticFeedback={hapticFeedback}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: #000000;
          color: #ffffff;
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Prevent scrolling when modal is open */
        body.modal-open {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Index; 