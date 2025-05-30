import React from 'react';
import { Reminder } from '../types/interfaces';
import { formatTimestamp } from '../utils/helpers';

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
  // If no reminders, don't render anything
  if (dueReminders.length === 0 && upcomingReminders.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Due Reminders - Always shown at top */}
      {dueReminders.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className="fas fa-bell text-yellow-400 text-lg"></i>
            </div>
            <div className="ml-3 w-full">
              <div className="text-sm font-medium text-yellow-800">
                Due Reminders
              </div>
              <div className="mt-1 space-y-1">
                {dueReminders.map((reminder) => (
                  <div 
                    key={reminder.id}
                    className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {reminder.driver}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {reminder.reminderMessage}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={() => {
                          hapticFeedback();
                          onCompleteReminder(reminder.id);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        onClick={() => {
                          hapticFeedback();
                          onDismissReminder(reminder.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <button
                        onClick={() => {
                          hapticFeedback();
                          onViewDetail(reminder);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Reminders - Only show if there are due reminders */}
      {upcomingReminders.length > 0 && dueReminders.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className="fas fa-clock text-blue-400 text-lg"></i>
            </div>
            <div className="ml-3 w-full">
              <div className="text-sm font-medium text-blue-800">
                Upcoming Reminders
              </div>
              <div className="mt-1 space-y-1">
                {upcomingReminders.map((reminder) => (
                  <div 
                    key={reminder.id}
                    className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {reminder.driver}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {reminder.reminderMessage}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={() => {
                          hapticFeedback();
                          onCompleteReminder(reminder.id);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        onClick={() => {
                          hapticFeedback();
                          onDismissReminder(reminder.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <button
                        onClick={() => {
                          hapticFeedback();
                          onViewDetail(reminder);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders; 