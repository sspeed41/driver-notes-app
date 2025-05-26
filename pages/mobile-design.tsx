import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface DriverNote {
  Driver: string;
  'Note Taker': string;
  Note: string;
  Timestamp: string;
  Tags?: string;
}

const MobileDesign = () => {
  const [noteText, setNoteText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedNoteTaker, setSelectedNoteTaker] = useState('');
  const [showDriverHistory, setShowDriverHistory] = useState(false);
  const [driverHistoryData, setDriverHistoryData] = useState<DriverNote[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyDriver, setHistoryDriver] = useState('');

  const drivers = [
    'Kyle Larson', 'Alex Bowman', 'Ross Chastain', 'Daniel Suarez', 'Austin Dillon',
    'Connor Zilisch', 'Carson Kvapil', 'Austin Hill', 'Jesse Love', 'Nick Sanchez',
    'Daniel Dye', 'Grant Enfinger', 'Daniel Hemric', 'Connor Mosack', 'Kaden Honeycutt',
    'Rajah Caruth', 'Andres Perez', 'Matt Mills', 'Dawson Sutton', 'Tristan McKee',
    'Helio Meza', 'Corey Day', 'Ben Maier', 'Tyler Reif', 'Brenden Queen'
  ];

  const noteTakers = ['Scott Speed', 'Josh Wise', 'Dan Jansen', 'Dan Stratton'];

  const handleRecord = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        setNoteText(prev => prev + "This is a simulated voice note. ");
      }, 2000);
    }
  };

  const hapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
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
        <title>Wise Driver Notes - Mobile Design</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <div className="bg-black text-white min-h-screen">
        {/* Mobile Header */}
        <header className="border-b border-gray-800 sticky top-0 bg-black z-50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center">
                  <svg viewBox="0 0 400 120" className="w-12 h-4">
                    <path 
                      d="M20 20 L360 20 L380 40 L380 80 L360 100 L20 100 L20 60 L40 40 Z" 
                      fill="none" 
                      stroke="#7cff00" 
                      strokeWidth="4"
                    />
                    <text 
                      x="50" 
                      y="75" 
                      fontFamily="Arial, sans-serif" 
                      fontSize="48" 
                      fontWeight="bold" 
                      fill="white"
                    >
                      WISE
                    </text>
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold">Driver Notes</h1>
                  <p className="text-gray-500 text-xs">Real-time analytics</p>
                </div>
              </div>
              
              {/* Status and Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Live</span>
                </div>
                <button className="p-2 text-gray-400 hover:text-white" onClick={hapticFeedback}>
                  <i className="fas fa-bars"></i>
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

            {/* Note Taker Selection */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <i className="fas fa-pen text-[#7cff00] text-xl"></i>
                <h2 className="text-lg font-semibold">Note Taker</h2>
              </div>
              <select 
                className="w-full p-4 bg-black text-white rounded-xl border border-gray-700 focus:border-[#7cff00] focus:outline-none transition-colors text-lg"
                value={selectedNoteTaker}
                onChange={(e) => setSelectedNoteTaker(e.target.value)}
              >
                <option value="">Select note taker...</option>
                {noteTakers.map(taker => (
                  <option key={taker} value={taker}>{taker}</option>
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
                onClick={hapticFeedback}
              >
                Save Note
              </button>
            </div>
          </div>

          {/* Recent Notes Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Notes</h3>
              <button className="text-gray-400 hover:text-white p-2" onClick={hapticFeedback}>
                <i className="fas fa-refresh"></i>
              </button>
            </div>
            
            {/* Sample Notes */}
            {[
              {
                author: 'Scott Speed',
                driver: 'Kyle Larson',
                time: '2m ago',
                content: 'Car is handling really well through turns 1-2. Driver reports good grip and confidence to push harder. Setup changes from yesterday are working perfectly.'
              },
              {
                author: 'Josh Wise',
                driver: 'Alex Bowman',
                time: '5m ago',
                content: 'Experiencing some understeer in the middle of the corner. Need to adjust front sway bar settings. Driver wants more rotation. #setup #handling'
              },
              {
                author: 'Dan Jansen',
                driver: 'Ross Chastain',
                time: '8m ago',
                content: 'Excellent lap times! Driver is finding speed everywhere. Very confident and smooth. This setup is dialed in perfectly for this track. #fast #confidence #setup'
              }
            ].map((note, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <span className="font-semibold">{note.author}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500 text-sm">{note.driver}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500 text-sm">{note.time}</span>
                    </div>
                    <p className="text-gray-200 mb-4 leading-relaxed">
                      {note.content.split('#').map((part, i) => 
                        i === 0 ? part : <span key={i}><span className="text-[#7cff00]">#{part.split(' ')[0]}</span>{part.substring(part.indexOf(' '))}</span>
                      )}
                    </p>
                    <div className="flex items-center space-x-6 text-gray-500">
                      <button 
                        className="flex items-center space-x-2 hover:text-white transition-colors p-2"
                        onClick={hapticFeedback}
                      >
                        <i className="fas fa-comment text-sm"></i>
                        <span className="text-sm">Reply</span>
                      </button>
                      <button 
                        className="flex items-center space-x-2 hover:text-[#7cff00] transition-colors p-2"
                        onClick={hapticFeedback}
                      >
                        <i className="fas fa-share text-sm"></i>
                        <span className="text-sm">Share</span>
                      </button>
                      <button 
                        className="flex items-center space-x-2 hover:text-red-500 transition-colors p-2"
                        onClick={hapticFeedback}
                      >
                        <i className="fas fa-heart text-sm"></i>
                        <span className="text-sm">Like</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
      </div>

      <style jsx global>{`
        body {
          background-color: #000000;
        }
        @media (max-width: 768px) {
          .mobile-padding {
            padding-bottom: 80px;
          }
        }
      `}</style>
    </>
  );
};

export default MobileDesign; 