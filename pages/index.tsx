import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DriverLogo from '../components/DriverLogo';

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
  const [showAthleteDashboard, setShowAthleteDashboard] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [athleteNotes, setAthleteNotes] = useState<DriverNote[]>([]);
  const [loadingAthleteData, setLoadingAthleteData] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderNote, setReminderNote] = useState<DriverNote | null>(null);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [activeReminders, setActiveReminders] = useState<Array<{
    id: string;
    noteId: string;
    driver: string;
    originalNote: string;
    reminderMessage: string;
    reminderDateTime: string;
    createdBy: string;
    isCompleted: boolean;
    isDismissed?: boolean;
  }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const tagOptions = ['physical', 'psychological', 'tactical', 'technical'];

  const drivers = [
    'Kyle Larson', 'Alex Bowman', 'Ross Chastain', 'Daniel Suarez', 'Austin Dillon',
    'Connor Zilisch', 'Carson Kvapil', 'Austin Hill', 'Jesse Love', 'Nick Sanchez',
    'Daniel Dye', 'Grant Enfinger', 'Daniel Hemric', 'Connor Mosack', 'Kaden Honeycutt',
    'Rajah Caruth', 'Andres Perez', 'Matt Mills', 'Dawson Sutton', 'Tristan McKee',
    'Helio Meza', 'Corey Day', 'Ben Maier', 'Tyler Reif', 'Brenden Queen'
  ];

  const noteTakers = ['Scott Speed', 'Josh Wise', 'Dan Jansen', 'Dan Stratton'];

  // Comprehensive athlete profile data
  const athleteProfiles: { [key: string]: {
    age: number;
    gymTime: string;
    crewChief: string;
    spotter: string;
    phone: string;
    email: string;
    birthday: string;
  }} = {
    'Kyle Larson': {
      age: 32,
      gymTime: 'FLEX',
      crewChief: 'Cliff Daniels',
      spotter: 'Tyler Mon',
      phone: '7043088150',
      email: 'k@kylelarsonracing.com',
      birthday: '7/31/1992'
    },
    'Alex Bowman': {
      age: 32,
      gymTime: '7:30',
      crewChief: 'Blake Harris',
      spotter: 'Kevin Hamlin',
      phone: '5206093435',
      email: 'Awb55@me.com',
      birthday: '4/25/1993'
    },
    'Ross Chastain': {
      age: 32,
      gymTime: '7:00',
      crewChief: 'Phil Surgen',
      spotter: 'Brandon McReynolds',
      phone: '2396336239',
      email: 'Ross@rosschastain.com',
      birthday: '12/4/1992'
    },
    'Daniel Suarez': {
      age: 33,
      gymTime: '7:00',
      crewChief: 'Matt Swiderski',
      spotter: 'Frankie Kimmel',
      phone: '7044906943',
      email: 'daniel@danielsuarezracing.com',
      birthday: '1/7/1992'
    },
    'Austin Dillon': {
      age: 35,
      gymTime: 'FLEX',
      crewChief: 'Richard Boswell',
      spotter: 'Brandon Bedisch',
      phone: '3366180868',
      email: 'adillon@rcrracing.com',
      birthday: '4/27/1990'
    },
    'Connor Zilisch': {
      age: 18,
      gymTime: '8:00',
      crewChief: 'Mardi Lindley',
      spotter: 'Josh Williams',
      phone: '7049896020',
      email: 'connorz722@gmail.com',
      birthday: '7/22/2006'
    },
    'Carson Kvapil': {
      age: 22,
      gymTime: '8:30',
      crewChief: 'Andrew Overstreet',
      spotter: 'TJ Majors',
      phone: '7047758625',
      email: 'carsonkvapil35@icloud.com',
      birthday: '5/22/2003'
    },
    'Austin Hill': {
      age: 31,
      gymTime: '9:00',
      crewChief: 'Chad Haney',
      spotter: 'Derek Williams',
      phone: '6784475920',
      email: 'austin@austinhillracing.com',
      birthday: '4/21/1994'
    },
    'Jesse Love': {
      age: 20,
      gymTime: '9:00',
      crewChief: 'Danny Stockman',
      spotter: 'Brandon Bedisch',
      phone: '6507224002',
      email: 'jesse@jesseloveracing.com',
      birthday: '1/14/2005'
    },
    'Nick Sanchez': {
      age: 23,
      gymTime: '7:30',
      crewChief: 'Patrick Donahue',
      spotter: '',
      phone: '7862576737',
      email: 'Nicksanchez080@gmail.com',
      birthday: '6/10/2001'
    },
    'Daniel Dye': {
      age: 21,
      gymTime: '6:30',
      crewChief: '',
      spotter: '',
      phone: '3868465451',
      email: 'daniel@danieldyeracing.com',
      birthday: '12/4/2003'
    },
    'Grant Enfinger': {
      age: 40,
      gymTime: '9:00',
      crewChief: 'Jeff Stankiewicz',
      spotter: '',
      phone: '2514545211',
      email: 'grantenfinger@yahoo.com',
      birthday: '1/22/1985'
    },
    'Daniel Hemric': {
      age: 34,
      gymTime: '11:00',
      crewChief: '',
      spotter: '',
      phone: '9805218414',
      email: 'DanielHemric@outlook.com',
      birthday: '1/27/1991'
    },
    'Connor Mosack': {
      age: 26,
      gymTime: '8:00',
      crewChief: 'Blake Bainbridge',
      spotter: '',
      phone: '7047563691',
      email: 'connormosack@gmail.com',
      birthday: '1/20/1999'
    },
    'Kaden Honeycutt': {
      age: 21,
      gymTime: '9:30',
      crewChief: 'Phil Gould',
      spotter: 'Stevie Reves?',
      phone: '4097193218',
      email: 'Kaden.Honeycutt@yahoo.com',
      birthday: '6/23/2003'
    },
    'Rajah Caruth': {
      age: 22,
      gymTime: '8:00',
      crewChief: '?',
      spotter: '',
      phone: '2028265236',
      email: 'rc13racing@gmail.com',
      birthday: '6/11/2002'
    },
    'Andres Perez': {
      age: 20,
      gymTime: '10:00',
      crewChief: '',
      spotter: '',
      phone: '9802674057',
      email: 'andres.plg.mx@gmail.com',
      birthday: '4/2/2005'
    },
    'Matt Mills': {
      age: 28,
      gymTime: '10:30',
      crewChief: 'mike shiplet',
      spotter: 'TJ majors',
      phone: '3304475725',
      email: 'mattmillsracing@yahoo.com',
      birthday: '11/14/1996'
    },
    'Dawson Sutton': {
      age: 17,
      gymTime: '7:30',
      crewChief: 'Chad Kendricks',
      spotter: 'Bruce Danz',
      phone: '6154892352',
      email: 'dawson@rackleywar.com',
      birthday: '1/26/2008'
    },
    'Tristan McKee': {
      age: 14,
      gymTime: '7:00',
      crewChief: 'piercy',
      spotter: '',
      phone: '7579688664',
      email: 'mckeetristan03@gmail.com',
      birthday: '8/3/2010'
    },
    'Helio Meza': {
      age: 17,
      gymTime: '9:00',
      crewChief: 'Hixon MXCUP+MX nasgar',
      spotter: '',
      phone: '2816600726',
      email: 'hmezza27@gmail.com',
      birthday: '11/27/2007'
    },
    'Corey Day': {
      age: 19,
      gymTime: '11:00',
      crewChief: '',
      spotter: '',
      phone: '5593601505',
      email: 'coreyaday41@gmail.com',
      birthday: '11/28/2005'
    },
    'Ben Maier': {
      age: 16,
      gymTime: '9:00',
      crewChief: 'setzer',
      spotter: '',
      phone: '4438271176',
      email: 'ben67racer@gmail.com',
      birthday: '12/28/2008'
    },
    'Tyler Reif': {
      age: 17,
      gymTime: '11:00',
      crewChief: 'beam',
      spotter: '',
      phone: '7027415572',
      email: 'tylerreif@outlook.com',
      birthday: '6/5/2007'
    },
    'Brenden Queen': {
      age: 27,
      gymTime: '9:30',
      crewChief: 'shane huffman',
      spotter: '',
      phone: '7574775730',
      email: 'Brendenqueen@gmail.com',
      birthday: '11/21/1997'
    }
  };

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
    // Set the driver to match the note being replied to
    setSelectedDriver(note.Driver);
    
    // Pre-fill the note text with @mention
    setNoteText(`@${note['Note Taker']}: `);
    
    // Store the original note for appending the reply
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
        // Position cursor at the end
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }, 500);
    
    hapticFeedback();
    
    // Show feedback
    setSaveStatus({
      success: true,
      message: `Replying to ${note['Note Taker']} about ${note.Driver} - reply will be added to original note`
    });
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
    if (!reminderNote || !reminderDate || !reminderTime) {
      setSaveStatus({
        success: false,
        message: 'Please fill in all reminder fields.'
      });
      return;
    }

    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    const newReminder = {
      id: Date.now().toString(),
      noteId: `${reminderNote.Driver}-${reminderNote.Timestamp}`,
      driver: reminderNote.Driver,
      originalNote: reminderNote.Note,
      reminderMessage: reminderMessage,
      reminderDateTime: reminderDateTime.toISOString(),
      createdBy: selectedNoteTaker,
      isCompleted: false,
      isDismissed: false
    };

    const updatedReminders = [...activeReminders, newReminder];
    setActiveReminders(updatedReminders);
    localStorage.setItem('activeReminders', JSON.stringify(updatedReminders));

    setSaveStatus({
      success: true,
      message: `Reminder set for ${reminderDateTime.toLocaleDateString()} at ${reminderDateTime.toLocaleTimeString()}`
    });

    // Reset modal
    setShowReminderModal(false);
    setReminderNote(null);
    setReminderDate('');
    setReminderTime('');
    setReminderMessage('');
    hapticFeedback();
  };

  const handleCompleteReminder = (reminderId: string) => {
    const updatedReminders = activeReminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, isCompleted: true } : reminder
    );
    setActiveReminders(updatedReminders);
    localStorage.setItem('activeReminders', JSON.stringify(updatedReminders));
    hapticFeedback();
  };

  const handleDismissReminder = (reminderId: string) => {
    const updatedReminders = activeReminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, isDismissed: true } : reminder
    );
    setActiveReminders(updatedReminders);
    localStorage.setItem('activeReminders', JSON.stringify(updatedReminders));
    hapticFeedback();
  };

  const getDueReminders = () => {
    const now = new Date();
    return activeReminders.filter(reminder => {
      const reminderTime = new Date(reminder.reminderDateTime);
      // Handle cases where isDismissed might be undefined
      const isNotDismissed = !reminder.isDismissed;
      const isNotCompleted = !reminder.isCompleted;
      const isDue = reminderTime <= now;
      return isNotCompleted && isNotDismissed && isDue;
    });
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return activeReminders.filter(reminder => {
      const reminderTime = new Date(reminder.reminderDateTime);
      // Handle cases where isDismissed might be undefined
      const isNotDismissed = !reminder.isDismissed;
      const isNotCompleted = !reminder.isCompleted;
      const isUpcoming = reminderTime > now && reminderTime <= next24Hours;
      return isNotCompleted && isNotDismissed && isUpcoming;
    });
  };

  const hasActiveReminder = (noteIndex: number) => {
    const note = recentNotes[noteIndex];
    if (!note) return false;
    
    return activeReminders.some(reminder => 
      reminder.driver === note.Driver && 
      reminder.originalNote === note.Note &&
      !reminder.isCompleted && 
      !reminder.isDismissed
    );
  };

  // Clear all reminders function for testing
  const clearAllReminders = () => {
    setActiveReminders([]);
    localStorage.removeItem('activeReminders');
    setSaveStatus({
      success: true,
      message: 'All reminders cleared!'
    });
    hapticFeedback();
  };

  // Fix existing reminders that might not have isDismissed property
  useEffect(() => {
    const fixExistingReminders = () => {
      const needsUpdate = activeReminders.some(reminder => reminder.isDismissed === undefined);
      if (needsUpdate) {
        const fixedReminders = activeReminders.map(reminder => ({
          ...reminder,
          isDismissed: reminder.isDismissed || false
        }));
        setActiveReminders(fixedReminders);
        localStorage.setItem('activeReminders', JSON.stringify(fixedReminders));
      }
    };

    if (activeReminders.length > 0) {
      fixExistingReminders();
    }
  }, [activeReminders.length]);

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

    // Check if this is a reply to an existing note
    if (replyingToNote && noteText.startsWith(`@${replyingToNote['Note Taker']}: `)) {
      // This is a reply - append to existing note
      const replyText = noteText.substring(`@${replyingToNote['Note Taker']}: `.length).trim();
      
      if (!replyText) {
        setSaveStatus({
          success: false,
          message: 'Please enter a reply message.'
        });
        setIsSaving(false);
        return;
      }

      try {
        const response = await fetch('/api/sheets', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            originalNote: replyingToNote,
            replyText: `@${selectedNoteTaker}: ${replyText}`,
            replyAuthor: selectedNoteTaker
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setSaveStatus({
            success: false,
            message: `Error: ${data.message || 'Failed to add reply'}`,
          });
          return;
        }

        setSaveStatus({
          success: true,
          message: 'Reply added to original note successfully!',
        });

        // Clear the note text and reply state after successful save
        setNoteText('');
        setReplyingToNote(null);
        
        // Refresh recent notes to show the updated note
        fetchRecentNotes();
      } catch (error) {
        console.error('Error adding reply:', error);
        setSaveStatus({
          success: false,
          message: 'Network error. Please check your connection.',
        });
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // Regular note creation
    const extractTags = (text: string): string[] => {
      const tagRegex = /#(\w+)/g;
      const matches = text.match(tagRegex);
      const textTags = matches ? matches.map((tag) => tag.slice(1)) : [];
      // Combine text tags with selected dropdown tags
      const allTags = textTags.concat(selectedTags);
      return Array.from(new Set(allTags));
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
      setSelectedTags([]);
      
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

  const openAthleteDashboard = (athlete?: string) => {
    // Always open the dashboard, regardless of selection
    setSelectedAthlete(athlete || '');
    setShowAthleteDashboard(true);
    
    // Only fetch data if an athlete is provided
    if (athlete) {
      fetchAthleteData(athlete);
    }
    hapticFeedback();
  };

  const fetchAthleteData = async (athlete: string) => {
    if (!athlete) return;
    
    setLoadingAthleteData(true);
    try {
      const response = await fetch('/api/sheets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data: DriverNote[] = await response.json();
        // Filter notes for the selected athlete and sort by timestamp (newest first)
        const athleteSpecificNotes = data.filter((note: DriverNote) => note.Driver === athlete)
          .sort((a: DriverNote, b: DriverNote) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())
          .slice(0, 15); // Get last 15 notes for the dashboard
        
        setAthleteNotes(athleteSpecificNotes);
      } else {
        console.error('Failed to fetch athlete data');
        setAthleteNotes([]);
      }
    } catch (error) {
      console.error('Error fetching athlete data:', error);
      setAthleteNotes([]);
    }
    setLoadingAthleteData(false);
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
        <title>Wise Driver Notes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <div className="bg-black text-white min-h-screen">
        {/* User Selection Screen */}
        {showUserSelection ? (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            {/* Logo and Title */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/images/W.O. LOGO - small.png" 
                  alt="W.O. Optimization" 
                  className="w-40 h-auto max-h-16"
                />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">Driver Notes</h1>
              <p className="text-gray-600 text-lg">Who are you?</p>
            </div>

            {/* User Selection Buttons */}
            <div className="w-full max-w-md space-y-4">
              {noteTakers.map((noteTaker) => (
                <button
                  key={noteTaker}
                  onClick={() => handleUserSelection(noteTaker)}
                  className="w-full p-6 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500 rounded-2xl transition-all duration-200 text-left group shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fas fa-user text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                        {noteTaker}
                      </h3>
                      <p className="text-gray-500 text-sm">Tap to continue</p>
                    </div>
                    <div className="ml-auto">
                      <i className="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"></i>
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
          <div className="min-h-screen bg-gray-50">
            {/* Clean Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
              <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  {/* Logo and Title */}
                  <div className="flex items-center space-x-4">
                    <img 
                      src="/images/W.O. LOGO - small.png" 
                      alt="W.O." 
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">Driver Notes</h1>
                      <p className="text-sm text-gray-500">
                        {selectedNoteTaker} • Live
                      </p>
                    </div>
                  </div>
                  
                  {/* Status and Menu */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-500">Connected</span>
                    </div>
                    {/* Clear Reminders Button (for testing) */}
                    {activeReminders.length > 0 && (
                      <button 
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100" 
                        onClick={clearAllReminders}
                        title="Clear all reminders"
                      >
                        <i className="fas fa-bell-slash"></i>
                      </button>
                    )}
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" 
                      onClick={handleChangeUser}
                    >
                      <i className="fas fa-user-cog"></i>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
              {/* Due Reminders Alert */}
              {getDueReminders().length > 0 && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <i className="fas fa-bell text-yellow-600 text-lg"></i>
                    <h3 className="text-lg font-semibold text-yellow-800">
                      {getDueReminders().length} Follow-up{getDueReminders().length > 1 ? 's' : ''} Due
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {getDueReminders().map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-yellow-100">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{reminder.driver}</p>
                          <p className="text-gray-600 text-sm">{reminder.reminderMessage}</p>
                          <p className="text-gray-500 text-xs">
                            Due: {new Date(reminder.reminderDateTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-3">
                          <button
                            onClick={() => handleDismissReminder(reminder.id)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleCompleteReminder(reminder.id)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Reminders */}
              {getUpcomingReminders().length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <i className="fas fa-clock text-blue-600 text-lg"></i>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Upcoming Reminders (Next 24h)
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {getUpcomingReminders().map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-blue-100">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{reminder.driver}</p>
                          <p className="text-gray-600 text-sm">{reminder.reminderMessage}</p>
                          <p className="text-gray-500 text-xs">
                            Scheduled: {new Date(reminder.reminderDateTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Driver Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="fas fa-user-circle text-blue-500 text-xl"></i>
                  <h2 className="text-lg font-semibold text-gray-900">Driver</h2>
                </div>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                >
                  <option value="">Select driver...</option>
                  {drivers.map(driver => (
                    <option key={driver} value={driver}>{driver}</option>
                  ))}
                </select>
              </div>

              {/* Note Input Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 note-input-section">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-microphone text-blue-500 text-xl"></i>
                    <h2 className="text-lg font-semibold text-gray-900">Voice Notes</h2>
                  </div>
                  <button 
                    onClick={() => { handleRecord(); hapticFeedback(); }}
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
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors text-lg"
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
                    <div className="relative tag-dropdown-container">
                      <button 
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                        onClick={toggleTagDropdown}
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
                                    onChange={() => handleTagSelect(tag)}
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
                    onClick={() => { handleSaveNote(); hapticFeedback(); }}
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
                          onClick={() => handleTagSelect(tag)}
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

              {/* Recent Notes Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Recent Notes</h3>
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100" 
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
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600">Loading recent notes...</span>
                    </div>
                  </div>
                ) : recentNotes.length > 0 ? (
                  recentNotes.map((note, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-colors">
                      <div className="flex items-start space-x-4">
                        <DriverLogo driverName={note.Driver} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2 flex-wrap">
                            <span className="font-semibold text-gray-900">{note.Driver}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">{note['Note Taker'] || 'Unknown'}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">{formatTimestamp(note.Timestamp)}</span>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {note.Note.split('#').map((part, i) => 
                              i === 0 ? part : <span key={i}><span className="text-blue-500">#{part.split(' ')[0]}</span>{part.substring(part.indexOf(' '))}</span>
                            )}
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
                              onClick={() => handleReplyToNote(note)}
                            >
                              <i className="fas fa-comment text-sm"></i>
                              <span className="text-sm">Reply</span>
                            </button>
                            <button 
                              className="flex items-center space-x-2 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-100"
                              onClick={() => handleShareNote(note)}
                            >
                              <i className="fas fa-share text-sm"></i>
                              <span className="text-sm">Share</span>
                            </button>
                            <button 
                              className={`flex items-center space-x-2 transition-colors p-2 rounded-lg hover:bg-gray-100 ${
                                hasActiveReminder(index)
                                  ? 'text-yellow-600 hover:text-yellow-700'
                                  : 'hover:text-yellow-600'
                              }`}
                              onClick={() => handleSetReminder(note)}
                            >
                              <i className={`fas fa-bell text-sm ${hasActiveReminder(index) ? 'text-yellow-600' : ''}`}></i>
                              <span className="text-sm">
                                {hasActiveReminder(index) ? 'Reminder Set' : 'Remind'}
                              </span>
                            </button>
                            <button 
                              className={`flex items-center space-x-2 transition-colors p-2 rounded-lg hover:bg-gray-100 ${
                                likedNotes.has(`note-${index}`) 
                                  ? 'text-red-500 hover:text-red-600' 
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
                    <i className="fas fa-clipboard-list text-gray-400 text-4xl mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
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
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="flex items-center justify-around py-3">
                <button className="flex flex-col items-center space-y-1 p-2" onClick={hapticFeedback}>
                  <i className="fas fa-home text-blue-500 text-lg"></i>
                  <span className="text-xs text-gray-500">Home</span>
                </button>
                <button className="flex flex-col items-center space-y-1 p-2" onClick={hapticFeedback}>
                  <i className="fas fa-search text-gray-400 text-lg"></i>
                  <span className="text-xs text-gray-500">Search</span>
                </button>
                <button className="flex flex-col items-center space-y-1 p-2 relative" onClick={hapticFeedback}>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-plus text-white text-lg"></i>
                  </div>
                  <span className="text-xs text-gray-500">Note</span>
                </button>
                <button 
                  className="flex flex-col items-center space-y-1 p-2" 
                  onClick={() => { 
                    openAthleteDashboard(); 
                    hapticFeedback(); 
                  }}
                >
                  <i className="fas fa-users text-gray-400 text-lg"></i>
                  <span className="text-xs text-gray-500">Athletes</span>
                </button>
                <button className="flex flex-col items-center space-y-1 p-2" onClick={hapticFeedback}>
                  <i className="fas fa-cog text-gray-400 text-lg"></i>
                  <span className="text-xs text-gray-500">Settings</span>
                </button>
              </div>
            </nav>

            {/* Athlete Dashboard Modal */}
            {showAthleteDashboard && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-2xl shadow-xl border border-gray-200 flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-users text-blue-500 text-xl"></i>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Athletes Dashboard</h2>
                        <p className="text-gray-600 text-sm">Select an athlete to view their profile</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setShowAthleteDashboard(false); hapticFeedback(); }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-hidden">
                    {selectedAthlete ? (
                      /* Individual Athlete Profile */
                      <div className="h-full overflow-y-auto">
                        <div className="p-6">
                          {/* Athlete Header */}
                          <div className="flex items-center space-x-4 mb-6">
                            <DriverLogo driverName={selectedAthlete} size="lg" />
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{selectedAthlete}</h3>
                              <p className="text-gray-600">Professional Driver</p>
                            </div>
                            <button
                              onClick={() => { setSelectedAthlete(''); hapticFeedback(); }}
                              className="ml-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              ← Back to Athletes
                            </button>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <i className="fas fa-calendar text-blue-500"></i>
                                <span className="text-sm font-medium text-gray-600">Next Race</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">TBD</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <i className="fas fa-flag-checkered text-blue-500"></i>
                                <span className="text-sm font-medium text-gray-600">Last Race</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">TBD</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <i className="fas fa-trophy text-blue-500"></i>
                                <span className="text-sm font-medium text-gray-600">Avg Finish</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">TBD</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <i className="fas fa-star text-blue-500"></i>
                                <span className="text-sm font-medium text-gray-600">Points</span>
                              </div>
                              <p className="text-lg font-bold text-gray-900">TBD</p>
                            </div>
                          </div>

                          {/* Athlete Details */}
                          {athleteProfiles[selectedAthlete] && (
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                              {/* Personal Info */}
                              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                  <i className="fas fa-user text-blue-500 mr-2"></i>
                                  Personal Information
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Age:</span>
                                    <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].age}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Birthday:</span>
                                    <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].birthday}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Gym Time:</span>
                                    <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].gymTime}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Team Info */}
                              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                  <i className="fas fa-users text-blue-500 mr-2"></i>
                                  Team Information
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Crew Chief:</span>
                                    <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].crewChief || 'TBD'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Spotter:</span>
                                    <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].spotter || 'TBD'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Contact Info */}
                              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 md:col-span-2">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                  <i className="fas fa-phone text-blue-500 mr-2"></i>
                                  Contact Information
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Phone:</span>
                                    <a 
                                      href={`tel:${athleteProfiles[selectedAthlete].phone}`}
                                      className="font-medium text-blue-500 hover:text-blue-600 transition-colors"
                                    >
                                      {athleteProfiles[selectedAthlete].phone}
                                    </a>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <a 
                                      href={`mailto:${athleteProfiles[selectedAthlete].email}`}
                                      className="font-medium text-blue-500 hover:text-blue-600 transition-colors"
                                    >
                                      {athleteProfiles[selectedAthlete].email}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Recent Notes */}
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <i className="fas fa-clipboard-list text-blue-500 mr-2"></i>
                              Recent Notes ({athleteNotes.length})
                            </h4>
                            {loadingAthleteData ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="flex items-center space-x-3">
                                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-gray-600">Loading notes...</span>
                                </div>
                              </div>
                            ) : athleteNotes.length > 0 ? (
                              <div className="space-y-3 max-h-64 overflow-y-auto">
                                {athleteNotes.map((note, index) => (
                                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-900">{note['Note Taker']}</span>
                                      <span className="text-xs text-gray-500">{formatTimestamp(note.Timestamp)}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm">{note.Note}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-8">No notes available for this athlete.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Athletes Grid */
                      <div className="h-full overflow-y-auto p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {drivers.map((driver) => (
                            <button
                              key={driver}
                              onClick={() => { 
                                setSelectedAthlete(driver); 
                                fetchAthleteData(driver);
                                hapticFeedback(); 
                              }}
                              className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500 rounded-2xl p-4 transition-all duration-200 text-left group shadow-sm"
                            >
                              <div className="flex flex-col items-center space-y-3">
                                <DriverLogo driverName={driver} size="md" />
                                <div className="text-center">
                                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-500 transition-colors text-sm">
                                    {driver}
                                  </h3>
                                  {athleteProfiles[driver] && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Age {athleteProfiles[driver].age}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reminder Modal */}
            {showReminderModal && reminderNote && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-bell text-blue-500 text-xl"></i>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Set Follow-up Reminder</h2>
                        <p className="text-gray-600 text-sm">{reminderNote.Driver}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setShowReminderModal(false); hapticFeedback(); }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-4">
                    {/* Original Note */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-gray-600 text-sm mb-2">Original Note:</p>
                      <p className="text-gray-900 text-sm">{reminderNote.Note}</p>
                    </div>

                    {/* Reminder Message */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Reminder Message</label>
                      <textarea
                        value={reminderMessage}
                        onChange={(e) => setReminderMessage(e.target.value)}
                        className="w-full h-20 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="What do you want to be reminded about?"
                      />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
                        <input
                          type="date"
                          value={reminderDate}
                          onChange={(e) => setReminderDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Time</label>
                        <input
                          type="time"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Quick Time Options */}
                    <div>
                      <p className="text-gray-700 text-sm font-medium mb-2">Quick Options</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'Tomorrow 7 AM', days: 1, time: '07:00' },
                          { label: 'In 2 days', days: 2, time: '07:00' },
                          { label: 'In 3 days', days: 3, time: '07:00' },
                          { label: 'Next week', days: 7, time: '07:00' }
                        ].map((option) => (
                          <button
                            key={option.label}
                            onClick={() => {
                              const targetDate = new Date();
                              targetDate.setDate(targetDate.getDate() + option.days);
                              targetDate.setHours(7, 0, 0, 0);
                              setReminderDate(targetDate.toISOString().split('T')[0]);
                              setReminderTime(option.time);
                              hapticFeedback();
                            }}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-between p-6 border-t border-gray-200">
                    <button
                      onClick={() => { setShowReminderModal(false); hapticFeedback(); }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateReminder}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      Set Reminder
                    </button>
                  </div>
                </div>
              </div>
            )}
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

        /* Focus styles for accessibility */
        button:focus,
        select:focus,
        textarea:focus {
          outline: 2px solid #3b82f6;
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