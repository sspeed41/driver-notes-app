import React from 'react';

interface HeaderProps {
  selectedNoteTaker: string;
  activeRemindersCount: number;
  onClearReminders: () => void;
  onChangeUser: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  selectedNoteTaker, 
  activeRemindersCount, 
  onClearReminders, 
  onChangeUser 
}) => {
  return (
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
              <h1 className="text-xl font-semibold text-gray-900">Driver Notes V3.1</h1>
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