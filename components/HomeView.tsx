import React from 'react';
import { DriverNote, Reminder } from '../types/interfaces';
import Reminders from './Reminders';
import RecentNotes from './RecentNotes';

interface HomeViewProps {
  recentNotes: DriverNote[];
  loadingRecentNotes: boolean;
  lastRefreshTime: Date | null;
  selectedNoteTaker: string;
  myViewEnabled: boolean;
  dueReminders: Reminder[];
  upcomingReminders: Reminder[];
  onRefresh: () => void;
  onReplyToNote: (note: DriverNote) => void;
  onSetReminder: (note: DriverNote) => void;
  onDeleteNote: (note: DriverNote) => void;
  onCompleteReminder: (reminderId: string) => void;
  onDismissReminder: (reminderId: string) => void;
  onViewReminderDetail: (reminder: Reminder) => void;
  hasActiveReminder: (index: number) => boolean;
  hapticFeedback: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  recentNotes,
  loadingRecentNotes,
  lastRefreshTime,
  selectedNoteTaker,
  myViewEnabled,
  dueReminders,
  upcomingReminders,
  onRefresh,
  onReplyToNote,
  onSetReminder,
  onDeleteNote,
  onCompleteReminder,
  onDismissReminder,
  onViewReminderDetail,
  hasActiveReminder,
  hapticFeedback
}) => {
  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Reminders Section */}
      {(dueReminders.length > 0 || upcomingReminders.length > 0) && (
        <div className="mb-4">
          <Reminders
            dueReminders={dueReminders}
            upcomingReminders={upcomingReminders}
            onCompleteReminder={onCompleteReminder}
            onDismissReminder={onDismissReminder}
            onViewDetail={onViewReminderDetail}
            hapticFeedback={hapticFeedback}
          />
        </div>
      )}

      {/* Recent Notes Section */}
      <RecentNotes
        recentNotes={recentNotes}
        loadingRecentNotes={loadingRecentNotes}
        lastRefreshTime={lastRefreshTime}
        selectedNoteTaker={selectedNoteTaker}
        myViewEnabled={myViewEnabled}
        onRefresh={onRefresh}
        onReplyToNote={onReplyToNote}
        onSetReminder={onSetReminder}
        onDeleteNote={onDeleteNote}
        hasActiveReminder={hasActiveReminder}
        hapticFeedback={hapticFeedback}
      />
    </div>
  );
};

export default HomeView; 