import React, { useState } from 'react';
import { FaMicrophone, FaCar, FaFlag, FaTachometerAlt, FaUsers, FaClipboardList } from 'react-icons/fa';

const DesignOptions = () => {
  const [selectedDesign, setSelectedDesign] = useState(1);

  const drivers = ['Kyle Larson', 'Alex Bowman', 'Ross Chastain', 'Daniel Suarez', 'Austin Dillon'];
  const noteTakers = ['Scott Speed', 'Josh Wise', 'Dan Jansen', 'Dan Stratton'];

  // Design Option 1: Modern Card Layout with Top Logo
  const Design1 = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header with Logo */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#7cff00] rounded-full flex items-center justify-center mr-4">
              <span className="text-black font-bold text-xl">LOGO</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Driver Analytics</h1>
              <p className="text-[#7cff00] text-lg">Professional Racing Notes Platform</p>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Driver Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-[#7cff00]/30">
            <div className="flex items-center mb-4">
              <FaCar className="text-[#7cff00] mr-2" />
              <h2 className="text-xl font-semibold text-white">Driver</h2>
            </div>
            <select className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-[#7cff00]">
              <option>Select Driver</option>
              {drivers.map(driver => <option key={driver}>{driver}</option>)}
            </select>
          </div>

          {/* Note Taker Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-[#7cff00]/30">
            <div className="flex items-center mb-4">
              <FaUsers className="text-[#7cff00] mr-2" />
              <h2 className="text-xl font-semibold text-white">Note Taker</h2>
            </div>
            <select className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-[#7cff00]">
              <option>Select Note Taker</option>
              {noteTakers.map(taker => <option key={taker}>{taker}</option>)}
            </select>
          </div>

          {/* Note Input - Spans 2 columns */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-[#7cff00]/30">
            <div className="flex items-center mb-4">
              <FaClipboardList className="text-[#7cff00] mr-2" />
              <h2 className="text-xl font-semibold text-white">Voice Notes</h2>
            </div>
            <div className="relative">
              <textarea 
                className="w-full h-32 p-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-[#7cff00] resize-none"
                placeholder="Start recording or type your notes..."
              />
              <button className="absolute bottom-4 right-4 p-3 bg-[#7cff00] hover:bg-[#6be600] rounded-full transition-colors">
                <FaMicrophone className="text-black" />
              </button>
            </div>
          </div>

          {/* Action Panel - Full width */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-[#7cff00]/30">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Actions</h2>
              <button className="px-6 py-3 bg-[#7cff00] hover:bg-[#6be600] text-black font-semibold rounded-lg transition-colors">
                Save to Google Sheets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Design Option 2: Sidebar Layout with Logo
  const Design2 = () => (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-gray-900 to-black border-r border-[#7cff00]/30 p-6">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#7cff00] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-2xl">LOGO</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Racing Analytics</h1>
          <p className="text-gray-400">Driver Performance Notes</p>
        </div>

        {/* Navigation/Stats */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center text-[#7cff00] mb-2">
              <FaTachometerAlt className="mr-2" />
              <span className="font-semibold">Session Stats</span>
            </div>
            <p className="text-gray-300 text-sm">Notes Today: 12</p>
            <p className="text-gray-300 text-sm">Active Drivers: 5</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center text-[#7cff00] mb-2">
              <FaFlag className="mr-2" />
              <span className="font-semibold">Quick Actions</span>
            </div>
            <button className="w-full text-left text-gray-300 text-sm hover:text-white py-1">View Google Sheet</button>
            <button className="w-full text-left text-gray-300 text-sm hover:text-white py-1">Export Data</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Driver Notes Interface</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-[#7cff00]/30">
              <h3 className="text-[#7cff00] font-semibold mb-4">Select Driver</h3>
              <select className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600">
                <option>Choose a driver...</option>
                {drivers.map(driver => <option key={driver}>{driver}</option>)}
              </select>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-[#7cff00]/30">
              <h3 className="text-[#7cff00] font-semibold mb-4">Note Taker</h3>
              <select className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600">
                <option>Choose note taker...</option>
                {noteTakers.map(taker => <option key={taker}>{taker}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-[#7cff00]/30 mb-6">
            <h3 className="text-[#7cff00] font-semibold mb-4">Voice Input</h3>
            <div className="relative">
              <textarea 
                className="w-full h-40 p-4 bg-gray-800 text-white rounded-lg border border-gray-600 resize-none"
                placeholder="Click the microphone to start voice recording or type directly..."
              />
              <button className="absolute bottom-4 right-4 p-4 bg-[#7cff00] hover:bg-[#6be600] rounded-full transition-all transform hover:scale-105">
                <FaMicrophone className="text-black text-lg" />
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Clear
            </button>
            <button className="px-8 py-3 bg-[#7cff00] hover:bg-[#6be600] text-black font-semibold rounded-lg transition-colors">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Design Option 3: Compact Dashboard Style
  const Design3 = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-green-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Bar with Logo */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-[#7cff00]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#7cff00] rounded-lg flex items-center justify-center mr-4">
                <span className="text-black font-bold">LOGO</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Driver Notes Pro</h1>
                <p className="text-gray-400 text-sm">Real-time racing analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">Live Session</p>
                <p className="text-[#7cff00] text-sm">Connected to Google Sheets</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Compact Form Layout */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-[#7cff00]/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-[#7cff00] font-semibold mb-2">Driver</label>
              <select className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600">
                <option>Select...</option>
                {drivers.map(driver => <option key={driver}>{driver}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#7cff00] font-semibold mb-2">Note Taker</label>
              <select className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600">
                <option>Select...</option>
                {noteTakers.map(taker => <option key={taker}>{taker}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#7cff00] font-semibold mb-2">Quick Actions</label>
              <div className="flex space-x-2">
                <button className="flex-1 p-3 bg-[#7cff00] hover:bg-[#6be600] text-black font-semibold rounded-lg transition-colors">
                  Save Note
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  <FaMicrophone />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#7cff00] font-semibold mb-2">Note Content</label>
            <textarea 
              className="w-full h-32 p-4 bg-gray-800 text-white rounded-lg border border-gray-600 resize-none"
              placeholder="Voice recording will appear here, or type directly..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Design Option 4: Mobile-First Vertical Layout
  const Design4 = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Mobile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#7cff00] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-black font-bold text-2xl">LOGO</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Racing Notes</h1>
          <p className="text-gray-400">Quick driver observations</p>
        </div>

        {/* Vertical Form Stack */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-[#7cff00]/30 shadow-lg">
            <h3 className="text-[#7cff00] font-semibold mb-3 flex items-center">
              <FaCar className="mr-2" />
              Driver Selection
            </h3>
            <select className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-600 text-lg">
              <option>Choose driver...</option>
              {drivers.map(driver => <option key={driver}>{driver}</option>)}
            </select>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-[#7cff00]/30 shadow-lg">
            <h3 className="text-[#7cff00] font-semibold mb-3 flex items-center">
              <FaUsers className="mr-2" />
              Note Taker
            </h3>
            <select className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-600 text-lg">
              <option>Choose note taker...</option>
              {noteTakers.map(taker => <option key={taker}>{taker}</option>)}
            </select>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-[#7cff00]/30 shadow-lg">
            <h3 className="text-[#7cff00] font-semibold mb-3 flex items-center">
              <FaMicrophone className="mr-2" />
              Voice Notes
            </h3>
            <div className="relative">
              <textarea 
                className="w-full h-40 p-4 bg-gray-800 text-white rounded-lg border border-gray-600 resize-none text-lg"
                placeholder="Tap microphone to record..."
              />
              <button className="absolute bottom-4 right-4 p-4 bg-[#7cff00] hover:bg-[#6be600] rounded-full transition-all transform hover:scale-110 shadow-lg">
                <FaMicrophone className="text-black text-xl" />
              </button>
            </div>
          </div>

          <button className="w-full p-4 bg-[#7cff00] hover:bg-[#6be600] text-black font-bold text-lg rounded-xl transition-colors shadow-lg">
            Save to Google Sheets
          </button>
        </div>
      </div>
    </div>
  );

  const designs = [
    { id: 1, name: "Modern Cards", component: Design1 },
    { id: 2, name: "Sidebar Layout", component: Design2 },
    { id: 3, name: "Compact Dashboard", component: Design3 },
    { id: 4, name: "Mobile-First", component: Design4 }
  ];

  const SelectedDesign = designs.find(d => d.id === selectedDesign)?.component || Design1;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Design Selector */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Driver Notes App - Design Options</h1>
          <div className="flex space-x-4">
            {designs.map(design => (
              <button
                key={design.id}
                onClick={() => setSelectedDesign(design.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedDesign === design.id
                    ? 'bg-[#7cff00] text-black'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {design.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Design Preview */}
      <div className="relative">
        <div className="absolute top-4 right-4 z-10 bg-black/80 text-white px-3 py-1 rounded-lg text-sm">
          Preview: {designs.find(d => d.id === selectedDesign)?.name}
        </div>
        <SelectedDesign />
      </div>
    </div>
  );
};

export default DesignOptions; 