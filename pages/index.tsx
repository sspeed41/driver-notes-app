import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface DriverNote {
  Driver: string;
  'Note Taker': string;
  Note: string;
  Timestamp: string;
  Tags?: string;
}

const Index = () => {
  const [noteText, setNoteText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedNoteTaker, setSelectedNoteTaker] = useState('');
  const [showDriverHistory, setShowDriverHistory] = useState(false);
  const [driverHistoryData, setDriverHistoryData] = useState<DriverNote[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyDriver, setHistoryDriver] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [recentNotes, setRecentNotes] = useState<DriverNote[]>([]);
  const [loadingRecentNotes, setLoadingRecentNotes] = useState(false);
  const [showUserSelection, setShowUserSelection] = useState(true);
  const [likedNotes, setLikedNotes] = useState<Set<string>>(new Set());
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingToNote, setReplyingToNote] = useState<DriverNote | null>(null);
  const [replyText, setReplyText] = useState('');

  const drivers = [
    'Kyle Larson', 'Alex Bowman', 'Ross Chastain', 'Daniel Suarez', 'Austin Dillon',
    'Connor Zilisch', 'Carson Kvapil', 'Austin Hill', 'Jesse Love', 'Nick Sanchez',
    'Daniel Dye', 'Grant Enfinger', 'Daniel Hemric', 'Connor Mosack', 'Kaden Honeycutt',
    'Rajah Caruth', 'Andres Perez', 'Matt Mills', 'Dawson Sutton', 'Tristan McKee',
    'Helio Meza', 'Corey Day', 'Ben Maier', 'Tyler Reif', 'Brenden Queen'
  ];

  const noteTakers = ['Scott Speed', 'Josh Wise', 'Dan Jansen', 'Dan Stratton'];

  // Check if user is already selected from localStorage
  useEffect(() => {
    const savedNoteTaker = localStorage.getItem('selectedNoteTaker');
    if (savedNoteTaker && noteTakers.includes(savedNoteTaker)) {
      setSelectedNoteTaker(savedNoteTaker);
      setShowUserSelection(false);
    }
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
    }
  }, [showUserSelection]);

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

  const handleLikeNote = (noteIndex: number) => {
    const noteId = `note-${noteIndex}`;
    const newLikedNotes = new Set(likedNotes);
    
    if (likedNotes.has(noteId)) {
      newLikedNotes.delete(noteId);
    } else {
      newLikedNotes.add(noteId);
    }
    
    setLikedNotes(newLikedNotes);
    hapticFeedback();
    
    // Show feedback
    setSaveStatus({
      success: true,
      message: likedNotes.has(noteId) ? 'Note unliked!' : 'Note liked!'
    });
  };

  const handleReplyToNote = (note: DriverNote) => {
    setReplyingToNote(note);
    setShowReplyModal(true);
    hapticFeedback();
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !replyingToNote) return;

    const replyNote = {
      id: Date.now().toString(),
      driver: replyingToNote.Driver,
      noteTaker: selectedNoteTaker,
      note: `@${replyingToNote['Note Taker']}: ${replyText.trim()}`,
      timestamp: new Date().toISOString(),
      tags: [],
    };

    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: [replyNote] }),
      });

      if (response.ok) {
        setSaveStatus({
          success: true,
          message: 'Reply posted successfully!'
        });
        setReplyText('');
        setShowReplyModal(false);
        setReplyingToNote(null);
        // Refresh recent notes to show the reply
        fetchRecentNotes();
      } else {
        setSaveStatus({
          success: false,
          message: 'Failed to post reply'
        });
      }
    } catch (error) {
      setSaveStatus({
        success: false,
        message: 'Error posting reply'
      });
    }
  };

  const handleShareNote = (note: DriverNote) => {
    const shareText = `${note['Note Taker']} about ${note.Driver}: ${note.Note}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Driver Note',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        setSaveStatus({
          success: true,
          message: 'Note copied to clipboard!'
        });
      });
    }
    hapticFeedback();
  };

  const fetchRecentNotes = async () => {
    setLoadingRecentNotes(true);
    try {
      const response = await fetch('/api/sheets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data: DriverNote[] = await response.json();
        // Sort by timestamp (newest first) and get the last 5 notes
        const sortedNotes = data
          .sort((a: DriverNote, b: DriverNote) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())
          .slice(0, 5);
        
        setRecentNotes(sortedNotes);
      } else {
        console.error('Failed to fetch recent notes');
        setRecentNotes([]);
      }
    } catch (error) {
      console.error('Error fetching recent notes:', error);
      setRecentNotes([]);
    }
    setLoadingRecentNotes(false);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        // Racing-specific vocabulary corrections
        const racingCorrections: { [key: string]: string } = {
          'car larson': 'Kyle Larson',
          'kyle larsen': 'Kyle Larson',
          'alex bowman': 'Alex Bowman',
          'ross chastain': 'Ross Chastain',
          'daniel suarez': 'Daniel Suarez',
          'austin dillon': 'Austin Dillon',
          'connor zilisch': 'Connor Zilisch',
          'carson kvapil': 'Carson Kvapil',
          'austin hill': 'Austin Hill',
          'jesse love': 'Jesse Love',
          'nick sanchez': 'Nick Sanchez',
          'daniel dye': 'Daniel Dye',
          'grant enfinger': 'Grant Enfinger',
          'daniel hemric': 'Daniel Hemric',
          'connor mosack': 'Connor Mosack',
          'kaden honeycutt': 'Kaden Honeycutt',
          'rajah caruth': 'Rajah Caruth',
          'andres perez': 'Andres Perez',
          'matt mills': 'Matt Mills',
          'dawson sutton': 'Dawson Sutton',
          'tristan mckee': 'Tristan McKee',
          'helio meza': 'Helio Meza',
          'corey day': 'Corey Day',
          'ben maier': 'Ben Maier',
          'tyler reif': 'Tyler Reif',
          'brenden queen': 'Brenden Queen',
          'understeer': 'understeer',
          'oversteer': 'oversteer',
          'loose': 'loose',
          'tight': 'tight',
          'aero': 'aero',
          'downforce': 'downforce',
          'setup': 'setup',
          'handling': 'handling',
          'grip': 'grip',
          'traction': 'traction',
          'braking': 'braking',
          'turn in': 'turn-in',
          'corner entry': 'corner entry',
          'corner exit': 'corner exit',
          'apex': 'apex',
          'racing line': 'racing line',
          'pit stop': 'pit stop',
          'tire wear': 'tire wear',
          'fuel mileage': 'fuel mileage',
          'track position': 'track position'
        };

        const applyCorrections = (text: string): string => {
          let correctedText = text.toLowerCase();
          Object.entries(racingCorrections).forEach(([wrong, correct]) => {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            correctedText = correctedText.replace(regex, correct);
          });
          return correctedText;
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            const correctedText = applyCorrections(finalTranscript);
            setNoteText(prev => prev + correctedText + ' ');
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } else {
        // Fallback for browsers without speech recognition
        alert('Speech recognition is not supported in this browser. Please type your note manually.');
        setIsRecording(false);
      }
    }
  };

  const hapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedDriver || !noteText.trim()) {
      setSaveStatus({
        success: false,
        message: 'Please select a driver and enter a note.'
      });
      return;
    }

    setIsSaving(true);

    const extractTags = (text: string): string[] => {
      const tagRegex = /#(\w+)/g;
      const matches = text.match(tagRegex);
      return matches ? matches.map((tag) => tag.slice(1)) : [];
    };

    const newNote = {
      id: Date.now().toString(),
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
        setSaveStatus({
          success: false,
          message: `Error: ${data.message || 'Failed to save note'}`,
        });
        return;
      }

      setSaveStatus({
        success: true,
        message: 'Note saved successfully to Google Sheets!',
      });

      // Clear the note text after successful save
      setNoteText('');
      
      // Refresh recent notes to show the new note
      fetchRecentNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveStatus({
        success: false,
        message: 'Network error. Please check your connection.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchDriverHistory = async (driver: string) => {
    if (!driver) return;
    
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/sheets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data: DriverNote[] = await response.json();
        // Filter notes for the selected driver and sort by timestamp (newest first)
        const driverNotes = data.filter((note: DriverNote) => note.Driver === driver)
          .sort((a: DriverNote, b: DriverNote) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())
          .slice(0, 10); // Get last 10 notes
        
        setDriverHistoryData(driverNotes);
      } else {
        console.error('Failed to fetch driver history');
        setDriverHistoryData([]);
      }
    } catch (error) {
      console.error('Error fetching driver history:', error);
      setDriverHistoryData([]);
    }
    setLoadingHistory(false);
  };

  const openDriverHistory = () => {
    setShowDriverHistory(true);
    if (selectedDriver) {
      setHistoryDriver(selectedDriver);
      fetchDriverHistory(selectedDriver);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      <Head>
        <title>Wise Driver Notes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <div className="bg-black text-white min-h-screen">
        {/* User Selection Screen */}
        {showUserSelection ? (
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            {/* Logo and Title */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/images/Wise Logo.png" 
                  alt="Wise Optimization" 
                  className="w-40 h-auto max-h-16"
                />
              </div>
              <h1 className="text-3xl font-bold mb-4">Driver Notes</h1>
              <p className="text-gray-400 text-lg">Who are you?</p>
            </div>

            {/* User Selection Buttons */}
            <div className="w-full max-w-md space-y-4">
              {noteTakers.map((noteTaker) => (
                <button
                  key={noteTaker}
                  onClick={() => handleUserSelection(noteTaker)}
                  className="w-full p-6 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-[#7cff00] rounded-2xl transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#7cff00] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fas fa-user text-black text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-[#7cff00] transition-colors">
                        {noteTaker}
                      </h3>
                      <p className="text-gray-400 text-sm">Tap to continue</p>
                    </div>
                    <div className="ml-auto">
                      <i className="fas fa-chevron-right text-gray-400 group-hover:text-[#7cff00] transition-colors"></i>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Select your name to start taking driver notes
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Header */}
            <header className="border-b border-gray-800 sticky top-0 bg-black z-50">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  {/* Logo and Title */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center">
                      <img 
                        src="/images/Wise Logo.png" 
                        alt="Wise Optimization" 
                        className="w-20 h-auto max-h-8"
                      />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold">Driver Notes</h1>
                      <p className="text-gray-500 text-xs">
                        {selectedNoteTaker} • Real-time analytics
                      </p>
                    </div>
                  </div>
                  
                  {/* Status and Menu */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400">Live</span>
                    </div>
                    <button 
                      className="p-2 text-gray-400 hover:text-white" 
                      onClick={handleChangeUser}
                    >
                      <i className="fas fa-user-cog"></i>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="px-4 py-4 pb-24">
              {/* Quick Selection Cards */}
              <div className="space-y-4 mb-6">
                {/* Driver Selection */}
                <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <i className="fas fa-user-circle text-[#7cff00] text-xl"></i>
                    <h2 className="text-lg font-semibold">Driver</h2>
                  </div>
                  <select 
                    className="w-full p-4 bg-black text-white rounded-xl border border-gray-700 focus:border-[#7cff00] focus:outline-none transition-colors text-lg"
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                  >
                    <option value="">Select driver...</option>
                    {drivers.map(driver => (
                      <option key={driver} value={driver}>{driver}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Note Input Section */}
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-microphone text-[#7cff00] text-xl"></i>
                    <h2 className="text-lg font-semibold">Voice Notes</h2>
                  </div>
                  <button 
                    onClick={() => { handleRecord(); hapticFeedback(); }}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-colors ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} text-sm`}></i>
                    <span className="text-sm">{isRecording ? 'Stop' : 'Record'}</span>
                  </button>
                </div>
                
                <div className="relative mb-4">
                  <textarea 
                    className="w-full h-32 p-4 bg-black text-white rounded-xl border border-gray-700 focus:border-[#7cff00] focus:outline-none resize-none transition-colors text-lg"
                    placeholder="What's happening with the driver? Tap the microphone to start voice recording or type directly..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
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
                    <button 
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors p-2"
                      onClick={hapticFeedback}
                    >
                      <i className="fas fa-hashtag"></i>
                      <span className="text-sm">Tags</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors p-2"
                      onClick={hapticFeedback}
                    >
                      <i className="fas fa-clock"></i>
                      <span className="text-sm">Time</span>
                    </button>
                  </div>
                  
                  <button 
                    className="px-6 py-3 bg-[#7cff00] hover:bg-[#6be600] text-black font-semibold rounded-full transition-colors disabled:opacity-50 text-lg"
                    onClick={() => { handleSaveNote(); hapticFeedback(); }}
                    disabled={isSaving || !selectedDriver || !noteText.trim()}
                  >
                    {isSaving ? 'Saving...' : 'Save Note'}
                  </button>
                </div>

                {/* Save Status */}
                {saveStatus.message && (
                  <div
                    className={`mt-4 p-3 rounded-xl ${
                      saveStatus.success ? 'bg-green-800/50 text-green-200' : 'bg-red-800/50 text-red-200'
                    }`}
                  >
                    {saveStatus.message}
                  </div>
                )}
              </div>

              {/* Recent Notes Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Recent Notes</h3>
                  <button 
                    className="text-gray-400 hover:text-white p-2" 
                    onClick={() => { fetchRecentNotes(); hapticFeedback(); }}
                    disabled={loadingRecentNotes}
                  >
                    <i className={`fas fa-refresh ${loadingRecentNotes ? 'animate-spin' : ''}`}></i>
                  </button>
                </div>
                
                {/* Recent Notes Content */}
                {loadingRecentNotes ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-[#7cff00] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-400">Loading recent notes...</span>
                    </div>
                  </div>
                ) : recentNotes.length > 0 ? (
                  recentNotes.map((note, index) => (
                    <div key={index} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-user text-gray-400"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2 flex-wrap">
                            <span className="font-semibold">{note['Note Taker'] || 'Unknown'}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-500 text-sm">{note.Driver}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-500 text-sm">{formatTimestamp(note.Timestamp)}</span>
                          </div>
                          <p className="text-gray-200 mb-4 leading-relaxed">
                            {note.Note.split('#').map((part, i) => 
                              i === 0 ? part : <span key={i}><span className="text-[#7cff00]">#{part.split(' ')[0]}</span>{part.substring(part.indexOf(' '))}</span>
                            )}
                          </p>
                          {note.Tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {note.Tags.split(',').map((tag: string, tagIndex: number) => (
                                <span key={tagIndex} className="text-[#7cff00] text-xs">
                                  #{tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center space-x-6 text-gray-500">
                            <button 
                              className="flex items-center space-x-2 hover:text-white transition-colors p-2"
                              onClick={() => handleReplyToNote(note)}
                            >
                              <i className="fas fa-comment text-sm"></i>
                              <span className="text-sm">Reply</span>
                            </button>
                            <button 
                              className="flex items-center space-x-2 hover:text-[#7cff00] transition-colors p-2"
                              onClick={() => handleShareNote(note)}
                            >
                              <i className="fas fa-share text-sm"></i>
                              <span className="text-sm">Share</span>
                            </button>
                            <button 
                              className={`flex items-center space-x-2 transition-colors p-2 ${
                                likedNotes.has(`note-${index}`) 
                                  ? 'text-red-500 hover:text-red-400' 
                                  : 'hover:text-red-500'
                              }`}
                              onClick={() => handleLikeNote(index)}
                            >
                              <i className={`${likedNotes.has(`note-${index}`) ? 'fas fa-heart' : 'far fa-heart'} text-sm`}></i>
                              <span className="text-sm">{likedNotes.has(`note-${index}`) ? 'Liked' : 'Like'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <i className="fas fa-clipboard-list text-gray-600 text-4xl mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">
                      No Recent Notes
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Start by creating your first driver note above.
                    </p>
                  </div>
                )}
              </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
              <div className="flex items-center justify-around py-3">
                <button className="flex flex-col items-center space-y-1 p-2" onClick={hapticFeedback}>
                  <i className="fas fa-home text-[#7cff00] text-lg"></i>
                  <span className="text-xs text-gray-400">Home</span>
                </button>
                <button className="flex flex-col items-center space-y-1 p-2" onClick={hapticFeedback}>
                  <i className="fas fa-search text-gray-400 text-lg"></i>
                  <span className="text-xs text-gray-400">Search</span>
                </button>
                <button className="flex flex-col items-center space-y-1 p-2 relative" onClick={hapticFeedback}>
                  <div className="w-12 h-12 bg-[#7cff00] rounded-full flex items-center justify-center">
                    <i className="fas fa-plus text-black text-lg"></i>
                  </div>
                  <span className="text-xs text-gray-400">Note</span>
                </button>
                <button 
                  className="flex flex-col items-center space-y-1 p-2" 
                  onClick={() => { openDriverHistory(); hapticFeedback(); }}
                >
                  <i className="fas fa-chart-line text-gray-400 text-lg"></i>
                  <span className="text-xs text-gray-400">History</span>
                </button>
                <button className="flex flex-col items-center space-y-1 p-2" onClick={hapticFeedback}>
                  <i className="fas fa-cog text-gray-400 text-lg"></i>
                  <span className="text-xs text-gray-400">Settings</span>
                </button>
              </div>
            </nav>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="fixed top-20 left-4 right-4 bg-red-600 text-white p-3 rounded-xl z-40">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="font-semibold">Recording...</span>
                  <span className="text-sm">Speak clearly</span>
                </div>
              </div>
            )}

            {/* Driver History Modal */}
            {showDriverHistory && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
                <div className="bg-gray-900 w-full h-5/6 rounded-t-3xl border-t border-gray-700">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-history text-[#7cff00] text-xl"></i>
                      <div>
                        <h2 className="text-xl font-bold">Driver History</h2>
                        <p className="text-gray-400 text-sm">
                          {historyDriver || 'Select a driver to view history'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setShowDriverHistory(false); hapticFeedback(); }}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>

                  {/* Driver Selector */}
                  <div className="p-6 border-b border-gray-700">
                    <select 
                      className="w-full p-4 bg-black text-white rounded-xl border border-gray-700 focus:border-[#7cff00] focus:outline-none transition-colors text-lg"
                      value={historyDriver}
                      onChange={(e) => {
                        setHistoryDriver(e.target.value);
                        fetchDriverHistory(e.target.value);
                      }}
                    >
                      <option value="">Select driver to view history...</option>
                      {drivers.map(driver => (
                        <option key={driver} value={driver}>{driver}</option>
                      ))}
                    </select>
                  </div>

                  {/* History Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {loadingHistory ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 border-2 border-[#7cff00] border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-400">Loading driver history...</span>
                        </div>
                      </div>
                    ) : driverHistoryData.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">
                            Latest Notes ({driverHistoryData.length})
                          </h3>
                          <span className="text-sm text-gray-400">
                            From Google Sheets
                          </span>
                        </div>
                        
                        {driverHistoryData.map((note, index) => (
                          <div key={index} className="bg-black rounded-2xl p-5 border border-gray-700">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-user text-gray-400 text-sm"></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2 flex-wrap">
                                  <span className="font-semibold text-sm">{note['Note Taker'] || 'Unknown'}</span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-500 text-xs">{formatTimestamp(note.Timestamp)}</span>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed mb-3">
                                  {note.Note}
                                </p>
                                {note.Tags && (
                                  <div className="flex flex-wrap gap-2">
                                    {note.Tags.split(',').map((tag: string, tagIndex: number) => (
                                      <span key={tagIndex} className="text-[#7cff00] text-xs">
                                        #{tag.trim()}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : historyDriver ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <i className="fas fa-clipboard-list text-gray-600 text-4xl mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">
                          No Notes Found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          No notes found for {historyDriver} in the database.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <i className="fas fa-user-circle text-gray-600 text-4xl mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">
                          Select a Driver
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Choose a driver from the dropdown above to view their note history.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reply Modal */}
            {showReplyModal && replyingToNote && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
                <div className="bg-gray-900 w-full h-3/4 rounded-t-3xl border-t border-gray-700">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-reply text-[#7cff00] text-xl"></i>
                      <div>
                        <h2 className="text-xl font-bold">Reply to Note</h2>
                        <p className="text-gray-400 text-sm">
                          Replying to {replyingToNote['Note Taker']} about {replyingToNote.Driver}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setShowReplyModal(false); setReplyingToNote(null); setReplyText(''); hapticFeedback(); }}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>

                  {/* Original Note */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="bg-black rounded-2xl p-4 border border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-sm">{replyingToNote['Note Taker']}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500 text-sm">{replyingToNote.Driver}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500 text-xs">{formatTimestamp(replyingToNote.Timestamp)}</span>
                      </div>
                      <p className="text-gray-200 text-sm">
                        {replyingToNote.Note}
                      </p>
                    </div>
                  </div>

                  {/* Reply Input */}
                  <div className="flex-1 p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Reply
                      </label>
                      <textarea 
                        className="w-full h-32 p-4 bg-black text-white rounded-xl border border-gray-700 focus:border-[#7cff00] focus:outline-none resize-none transition-colors text-lg"
                        placeholder={`Reply to ${replyingToNote['Note Taker']}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        maxLength={280}
                      />
                      <div className={`text-right text-sm mt-2 ${
                        replyText.length > 280 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {replyText.length} / 280
                      </div>
                    </div>

                    {/* Reply Actions */}
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => { setShowReplyModal(false); setReplyingToNote(null); setReplyText(''); hapticFeedback(); }}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => { handleSubmitReply(); hapticFeedback(); }}
                        disabled={!replyText.trim()}
                        className="px-6 py-3 bg-[#7cff00] hover:bg-[#6be600] text-black font-semibold rounded-full transition-colors disabled:opacity-50"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
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

        /* Focus styles for accessibility */
        button:focus,
        select:focus,
        textarea:focus {
          outline: 2px solid #7cff00;
          outline-offset: 2px;
        }

        /* Animation for recording pulse */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Smooth transitions */
        * {
          transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        }
      `}</style>
    </>
  );
};

export default Index; 