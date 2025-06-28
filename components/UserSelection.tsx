import React from 'react';
import { noteTakers } from '../data/noteTakers';

interface UserSelectionProps {
  onUserSelect: (noteTaker: string) => void;
}

const UserSelection: React.FC<UserSelectionProps> = ({ onUserSelect }) => {
  return (
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
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Driver Notes V4.0</h1>
        <p className="text-gray-600 text-lg">Who are you?</p>
      </div>

      {/* User Selection Buttons */}
      <div className="w-full max-w-md space-y-4">
        {noteTakers.map((noteTaker) => (
          <button
            key={noteTaker}
            onClick={() => onUserSelect(noteTaker)}
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
  );
};

export default UserSelection; 