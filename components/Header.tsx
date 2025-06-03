import React from 'react';
import { getUserRole } from '../utils/roleMapping';

interface HeaderProps {
  selectedNoteTaker: string;
  activeRemindersCount: number;
  notificationsEnabled: boolean;
  onClearReminders: () => void;
  onChangeUser: () => void;
  onToggleNotifications: () => void;
  inAppNotifications?: Array<{
    id: string;
    title: string;
    message: string;
    timestamp: number;
  }>;
  onDismissNotification?: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  selectedNoteTaker, 
  activeRemindersCount, 
  notificationsEnabled,
  onClearReminders, 
  onChangeUser, 
  onToggleNotifications,
  inAppNotifications = [],
  onDismissNotification
}) => {
  const userRole = getUserRole(selectedNoteTaker);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* In-app Notifications */}
      {inAppNotifications.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="max-w-4xl mx-auto px-4 py-2">
            {inAppNotifications.map(notification => (
              <div 
                key={notification.id}
                className="flex items-start justify-between p-3 bg-white rounded-lg shadow-sm mb-2 last:mb-0 border border-blue-100"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900">{notification.title}</h3>
                  <p className="text-sm text-blue-700">{notification.message}</p>
                </div>
                {onDismissNotification && (
                  <button 
                    onClick={() => onDismissNotification(notification.id)}
                    className="ml-2 text-blue-400 hover:text-blue-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
              <h1 className="text-xl font-semibold text-gray-900">Driver Notes V3.6</h1>
              <p className="text-sm text-gray-500">
                {selectedNoteTaker} • {userRole ? userRole.role : 'General'} • Live
              </p>
            </div>
          </div>
          
          {/* Status and Menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Connected</span>
            </div>
            
            {/* Notification Toggle */}
            <button 
              className={`p-2 rounded-lg transition-all duration-200 ${
                notificationsEnabled 
                  ? 'text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm' 
                  : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
              }`}
              onClick={onToggleNotifications}
              title={
                notificationsEnabled 
                  ? 'Notifications enabled - Click to disable' 
                  : 'Click to enable team notifications'
              }
            >
              <i className={`fas ${notificationsEnabled ? 'fa-bell' : 'fa-bell-slash'} text-sm`}></i>
            </button>
            
            {/* Clear Reminders Button (for testing) */}
            {activeRemindersCount > 0 && (
              <button 
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100" 
                onClick={onClearReminders}
                title="Clear all reminders"
              >
                <i className="fas fa-bell-slash"></i>
              </button>
            )}
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" 
              onClick={onChangeUser}
            >
              <i className="fas fa-user-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 