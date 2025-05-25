import React from 'react';
import { Driver } from '@/types/Note';

interface DriverSelectProps {
  selectedDriver: string;
  setSelectedDriver: (driver: string) => void;
}

const defaultDrivers: Driver[] = [
  { id: '1', name: 'Kyle Larson', active: true },
  { id: '2', name: 'Alex Bowman', active: true },
  { id: '3', name: 'Ross Chastain', active: true },
  { id: '4', name: 'Daniel Suarez', active: true },
  { id: '5', name: 'Austin Dillon', active: true },
  { id: '6', name: 'Connor Zilisch', active: true },
  { id: '7', name: 'Carson Kvapil', active: true },
  { id: '8', name: 'Austin Hill', active: true },
  { id: '9', name: 'Jesse Love', active: true },
  { id: '10', name: 'Nick Sanchez', active: true },
  { id: '11', name: 'Daniel Dye', active: true },
  { id: '12', name: 'Grant Enfinger', active: true },
  { id: '13', name: 'Daniel Hemric', active: true },
  { id: '14', name: 'Connor Mosack', active: true },
  { id: '15', name: 'Kaden Honeycutt', active: true },
  { id: '16', name: 'Rajah Caruth', active: true },
  { id: '17', name: 'Andres Perez', active: true },
  { id: '18', name: 'Matt Mills', active: true },
  { id: '19', name: 'Dawson Sutton', active: true },
  { id: '20', name: 'Tristan McKee', active: true },
  { id: '21', name: 'Helio Meza', active: true },
  { id: '22', name: 'Corey Day', active: true },
  { id: '23', name: 'Ben Maier', active: true },
  { id: '24', name: 'Tyler Reif', active: true },
  { id: '25', name: 'Brenden Queen', active: true },
];

const DriverSelect: React.FC<DriverSelectProps> = ({ selectedDriver, setSelectedDriver }) => {
  return (
    <div className="space-y-4">
      <select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
        className="w-full p-2 bg-gray-800 text-white border border-[#7cff00]/30 rounded-lg focus:outline-none focus:border-[#7cff00]"
      >
        <option value="">Select a driver</option>
        {defaultDrivers.map((driver) => (
          <option key={driver.id} value={driver.name}>
            {driver.name}
          </option>
        ))}
      </select>
      
      <div className="text-sm text-gray-400">
        {!selectedDriver && (
          <p className="italic">Please select a driver to continue</p>
        )}
      </div>
    </div>
  );
};

export default DriverSelect; 