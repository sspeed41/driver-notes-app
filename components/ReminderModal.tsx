import React from 'react';
import { DriverNote, Reminder } from '../types/interfaces';

interface ReminderModalProps {
  showModal: boolean;
  reminderNote: DriverNote | null;
  reminderMessage: string;
  reminderDate: string;
  reminderTime: string;
  onClose: () => void;
  onSetReminderMessage: (message: string) => void;
  onSetReminderDate: (date: string) => void;
  onSetReminderTime: (time: string) => void;
  onCreateReminder: () => void;
  hapticFeedback: () => void;
}

interface ReminderDetailModalProps {
  showModal: boolean;
  selectedReminder: Reminder | null;
  onClose: () => void;
  onDismiss: (id: string) => void;
  onComplete: (id: string) => void;
  hapticFeedback: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  showModal,
  reminderNote,
  reminderMessage,
  reminderDate,
  reminderTime,
  onClose,
  onSetReminderMessage,
  onSetReminderDate,
  onSetReminderTime,
  onCreateReminder,
  hapticFeedback
}) => {
  if (!showModal || !reminderNote) return null;

  const quickOptions = [
    { label: 'Tomorrow 7 AM', days: 1, time: '07:00' },
    { label: 'In 2 days', days: 2, time: '07:00' },
    { label: 'In 3 days', days: 3, time: '07:00' },
    { label: 'Next week', days: 7, time: '07:00' }
  ];

  return (
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
            onClick={() => { onClose(); hapticFeedback(); }}
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
              onChange={(e) => onSetReminderMessage(e.target.value)}
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white placeholder-gray-500"
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
                onChange={(e) => onSetReminderDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => onSetReminderTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Quick Time Options */}
          <div>
            <p className="text-gray-700 text-sm font-medium mb-2">Quick Options</p>
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    const targetDate = new Date();
                    targetDate.setDate(targetDate.getDate() + option.days);
                    targetDate.setHours(7, 0, 0, 0);
                    onSetReminderDate(targetDate.toISOString().split('T')[0]);
                    onSetReminderTime(option.time);
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
            onClick={() => { onClose(); hapticFeedback(); }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreateReminder}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export const ReminderDetailModal: React.FC<ReminderDetailModalProps> = ({
  showModal,
  selectedReminder,
  onClose,
  onDismiss,
  onComplete,
  hapticFeedback
}) => {
  if (!showModal || !selectedReminder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <i className="fas fa-bell text-yellow-400 text-xl"></i>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reminder Details</h2>
              <p className="text-gray-600 text-sm">{selectedReminder.driver}</p>
            </div>
          </div>
          <button 
            onClick={() => { onClose(); hapticFeedback(); }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Original Note */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2 font-medium">Original Note:</p>
            <p className="text-gray-900">{selectedReminder.originalNote}</p>
          </div>

          {/* Reminder Info */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <p className="text-yellow-700 text-sm mb-2 font-medium">Reminder:</p>
            <p className="text-yellow-800 mb-2">{selectedReminder.reminderMessage}</p>
            <p className="text-yellow-600 text-sm">
              Due: {new Date(selectedReminder.reminderDateTime).toLocaleString()}
            </p>
            <p className="text-yellow-600 text-sm">
              Created by: {selectedReminder.createdBy}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={() => { onClose(); hapticFeedback(); }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                onDismiss(selectedReminder.id);
                onClose();
                hapticFeedback();
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onComplete(selectedReminder.id);
                onClose();
                hapticFeedback();
              }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 