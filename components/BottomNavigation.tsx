import React from 'react';

interface BottomNavigationProps {
  onOpenAthleteDashboard: () => void;
  hapticFeedback: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  onOpenAthleteDashboard, 
  hapticFeedback 
}) => {
  return (
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
            onOpenAthleteDashboard(); 
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
  );
};

export default BottomNavigation; 