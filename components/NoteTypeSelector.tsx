import React from 'react';

interface NoteTypeSelectorProps {
  selectedType: 'Note' | 'Focus';
  onTypeChange: (type: 'Note' | 'Focus') => void;
  hapticFeedback: () => void;
}

const NoteTypeSelector: React.FC<NoteTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  hapticFeedback
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <i className="fas fa-edit text-blue-500 text-xl"></i>
        <h2 className="text-lg font-semibold text-gray-900">Entry Type</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            onTypeChange('Note');
            hapticFeedback();
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            selectedType === 'Note'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <i className={`fas fa-sticky-note text-2xl ${
              selectedType === 'Note' ? 'text-blue-500' : 'text-gray-400'
            }`}></i>
            <div className="text-center">
              <div className="font-semibold">Note</div>
              <div className="text-xs opacity-75">Regular observation or feedback</div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => {
            onTypeChange('Focus');
            hapticFeedback();
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            selectedType === 'Focus'
              ? 'border-orange-500 bg-orange-50 text-orange-700'
              : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <i className={`fas fa-bullseye text-2xl ${
              selectedType === 'Focus' ? 'text-orange-500' : 'text-gray-400'
            }`}></i>
            <div className="text-center">
              <div className="font-semibold">Focus</div>
              <div className="text-xs opacity-75">Priority item for athlete profile</div>
            </div>
          </div>
        </button>
      </div>
      
      {selectedType === 'Focus' && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <i className="fas fa-info-circle text-orange-500 text-sm mt-0.5"></i>
            <div className="text-sm text-orange-700">
              <strong>Focus items</strong> will appear prominently at the top of the athlete's profile page and are perfect for highlighting current priorities, goals, or key areas of improvement.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteTypeSelector; 