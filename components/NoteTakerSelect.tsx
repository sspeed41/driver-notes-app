import React from 'react';

interface NoteTaker {
  id: string;
  name: string;
  active: boolean;
}

interface NoteTakerSelectProps {
  selectedNoteTaker: string;
  setSelectedNoteTaker: (noteTaker: string) => void;
}

const defaultNoteTakers: NoteTaker[] = [
  { id: '1', name: 'Scott Speed', active: true },
  { id: '2', name: 'Josh Wise', active: true },
  { id: '3', name: 'Dan Jansen', active: true },
  { id: '4', name: 'Dan Stratton', active: true },
];

const NoteTakerSelect: React.FC<NoteTakerSelectProps> = ({ selectedNoteTaker, setSelectedNoteTaker }) => {
  return (
    <div className="space-y-4">
      <select
        value={selectedNoteTaker}
        onChange={(e) => setSelectedNoteTaker(e.target.value)}
        className="w-full p-2 bg-gray-800 text-white border border-[#7cff00]/30 rounded-lg focus:outline-none focus:border-[#7cff00]"
      >
        <option value="">Select Note Taker</option>
        {defaultNoteTakers.map((noteTaker) => (
          <option key={noteTaker.id} value={noteTaker.name}>
            {noteTaker.name}
          </option>
        ))}
      </select>
      
      <div className="text-sm text-gray-400">
        {!selectedNoteTaker && (
          <p className="italic">Please select a note taker to continue</p>
        )}
      </div>
    </div>
  );
};

export default NoteTakerSelect; 