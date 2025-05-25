import React, { useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface NoteInputProps {
  noteText: string;
  setNoteText: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const NoteInput: React.FC<NoteInputProps> = ({
  noteText,
  setNoteText,
  isRecording,
  setIsRecording,
}) => {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        if (finalTranscript) {
          const newText = noteText + ' ' + finalTranscript;
          setNoteText(newText.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setNoteText, setIsRecording, noteText]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note here or click the microphone to start dictation..."
          className="w-full h-40 p-4 bg-gray-800 text-white border border-[#7cff00]/30 rounded-lg focus:outline-none focus:border-[#7cff00] resize-none"
        />
        <button
          onClick={toggleRecording}
          className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#7cff00] hover:bg-[#6be600]'
          }`}
        >
          {isRecording ? (
            <FaMicrophoneSlash className="w-5 h-5 text-white" />
          ) : (
            <FaMicrophone className="w-5 h-5 text-black" />
          )}
        </button>
      </div>
      {isRecording && (
        <div className="text-[#7cff00] text-sm animate-pulse">
          Recording... Speak clearly into your microphone
        </div>
      )}
    </div>
  );
};

export default NoteInput; 