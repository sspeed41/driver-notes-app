import React from 'react';
import { Reminder } from '../types/interfaces';

interface RemindersProps {
  dueReminders: Reminder[];
  upcomingReminders: Reminder[];
  onCompleteReminder: (id: string) => void;
  onDismissReminder: (id: string) => void;
  onViewDetail: (reminder: Reminder) => void;
  hapticFeedback: () => void;
}

const Reminders: React.FC<RemindersProps> = ({
  dueReminders,
  upcomingReminders,
  onCompleteReminder,
  onDismissReminder,
  onViewDetail,
  hapticFeedback
}) => {
  if (dueReminders.length === 0 && upcomingReminders.length === 0) {
    return null;
  }

  return (
    <>
      {/* Due Reminders Alert */}
      {dueReminders.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <i className="fas fa-bell text-yellow-600 text-lg"></i>
            <h3 className="text-lg font-semibold text-yellow-800">
              {dueReminders.length} Follow-up{dueReminders.length > 1 ? 's' : ''} Due
            </h3>
          </div>
          <div className="space-y-2">
            {dueReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-yellow-100">
                <div className="flex-1 cursor-pointer" onClick={() => {
                  onViewDetail(reminder);
                  hapticFeedback();
                }}>
                  <p className="text-gray-900 font-medium">{reminder.driver}</p>
                  <p className="text-gray-600 text-sm">{reminder.reminderMessage}</p>
                  <p className="text-gray-500 text-xs">
                    Due: {new Date(reminder.reminderDateTime).toLocaleString()}
                  </p>
                  <p className="text-blue-500 text-xs mt-1">Click to view full note</p>
                </div>
                <div className="flex space-x-2 ml-3">
                  <button
                    onClick={() => onDismissReminder(reminder.id)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => onCompleteReminder(reminder.id)}
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
      {upcomingReminders.length > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <i className="fas fa-clock text-blue-600 text-lg"></i>
            <h3 className="text-lg font-semibold text-blue-800">
              Upcoming Reminders (Next 24h)
            </h3>
          </div>
          <div className="space-y-2">
            {upcomingReminders.map((reminder) => (
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
    </>
  );
};

export default Reminders; 