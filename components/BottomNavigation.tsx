import React from 'react';
import { getUserRole } from '../utils/roleMapping';

interface BottomNavigationProps {
  selectedNoteTaker: string;
  myViewEnabled: boolean;
  currentView: 'home' | 'note-creation' | 'athletes';
  onOpenAthleteDashboard: () => void;
  onToggleMyView: () => void;
  onNavigateHome: () => void;
  onNavigateNoteCreation: () => void;
  hapticFeedback: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  selectedNoteTaker,
  myViewEnabled,
  currentView,
  onOpenAthleteDashboard,
  onToggleMyView,
  onNavigateHome,
  onNavigateNoteCreation,
  hapticFeedback 
}) => {
  const userRole = getUserRole(selectedNoteTaker);
  const showMyViewToggle = userRole && userRole.tags.length > 0;

  const getMyViewIconColor = () => {
    if (!showMyViewToggle) return 'text-gray-400';
    
    if (myViewEnabled) {
      switch (userRole?.color) {
        case 'purple': return 'text-purple-500';
        case 'blue': return 'text-blue-500';
        case 'green': return 'text-green-500';
        default: return 'text-blue-500';
      }
    }
    
    return currentView === 'home' ? 'text-blue-500' : 'text-gray-400';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around py-3">
        {/* My View / Home */}
        <button 
          className="flex flex-col items-center space-y-1 p-2" 
          onClick={() => { 
            if (showMyViewToggle) {
              onToggleMyView();
            } else {
              onNavigateHome();
            }
            hapticFeedback(); 
          }}
        >
          <div className="relative">
            <i className={`fas fa-filter text-lg ${getMyViewIconColor()}`}></i>
            {myViewEnabled && showMyViewToggle && (
              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                userRole?.color === 'purple' ? 'bg-purple-500' :
                userRole?.color === 'green' ? 'bg-green-500' : 'bg-blue-500'
              }`}></span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {showMyViewToggle ? 'My View' : 'Home'}
          </span>
        </button>

        {/* Search */}
        <button className="flex flex-col items-center space-y-1 p-2" onClick={hapticFeedback}>
          <i className="fas fa-search text-gray-400 text-lg"></i>
          <span className="text-xs text-gray-500">Search</span>
        </button>

        {/* Note Creation */}
        <button 
          className="flex flex-col items-center space-y-1 p-2 relative" 
          onClick={() => { 
            onNavigateNoteCreation(); 
            hapticFeedback(); 
          }}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
            currentView === 'note-creation' ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <i className="fas fa-plus text-white text-lg"></i>
          </div>
          <span className="text-xs text-gray-500">Note</span>
        </button>

        {/* Athletes */}
        <button 
          className="flex flex-col items-center space-y-1 p-2" 
          onClick={() => { 
            onOpenAthleteDashboard(); 
            hapticFeedback(); 
          }}
        >
          <i className={`fas fa-users text-lg ${
            currentView === 'athletes' ? 'text-blue-500' : 'text-gray-400'
          }`}></i>
          <span className="text-xs text-gray-500">Athletes</span>
        </button>

        {/* Settings */}
        <button className="flex flex-col items-center space-y-1 p-2" onClick={hapticFeedback}>
          <i className="fas fa-cog text-gray-400 text-lg"></i>
          <span className="text-xs text-gray-500">Settings</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation; 