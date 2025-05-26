import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const DesignOptions = () => {
  const [selectedOption, setSelectedOption] = useState(1);

  const designOptions = [
    {
      id: 1,
      name: "Clean Minimal",
      description: "Apple-inspired clean design with subtle shadows and rounded corners"
    },
    {
      id: 2,
      name: "Card-Based",
      description: "iOS-style cards with frosted glass effects"
    },
    {
      id: 3,
      name: "Sidebar Layout",
      description: "macOS-inspired sidebar with clean content area"
    }
  ];

  const sampleNotes = [
    {
      driver: "Kyle Larson",
      noteTaker: "Scott Speed",
      note: "Great performance in practice. Car handling well in turns 1-2. Need to work on exit speed.",
      timestamp: "2m ago",
      tags: ["practice", "handling"]
    },
    {
      driver: "Alex Bowman",
      noteTaker: "Josh Wise", 
      note: "Struggling with understeer. Adjusted front wing down 2 clicks. Driver reports better turn-in.",
      timestamp: "5m ago",
      tags: ["setup", "understeer"]
    }
  ];

  return (
    <>
      <Head>
        <title>Design Options - Wise Driver Notes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  ← Back to App
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Design Options</h1>
              </div>
              <div className="flex space-x-2">
                {designOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedOption === option.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Design Option 1: Clean Minimal */}
        {selectedOption === 1 && (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Clean Minimal Design</h2>
              <p className="text-gray-600">Apple-inspired clean design with subtle shadows and rounded corners</p>
            </div>

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">W</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">Driver Notes</h1>
                    <p className="text-sm text-gray-500">Scott Speed • Live</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Connected</span>
                </div>
              </div>
            </div>

            {/* Note Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Select driver...</option>
                  <option>Kyle Larson</option>
                  <option>Alex Bowman</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="What's happening with the driver?"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <span>Record</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                    <span>#</span>
                    <span>Tags</span>
                  </button>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">
                  Save Note
                </button>
              </div>
            </div>

            {/* Recent Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notes</h3>
              {sampleNotes.map((note, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">{note.driver.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{note.driver}</h4>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{note.noteTaker}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{note.timestamp}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{note.note}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {note.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-red-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Design Option 2: Card-Based */}
        {selectedOption === 2 && (
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Card-Based Design</h2>
              <p className="text-gray-600">iOS-style cards with frosted glass effects</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span>New Note</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-2xl text-gray-700 hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Athletes</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-2xl text-gray-700 hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>History</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Drivers</h3>
                  <div className="space-y-3">
                    {['Kyle Larson', 'Alex Bowman', 'Ross Chastain'].map((driver, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">{driver.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <span className="text-gray-700">{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Create Note</h3>
                  <div className="space-y-4">
                    <div>
                      <select className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Select driver...</option>
                        <option>Kyle Larson</option>
                        <option>Alex Bowman</option>
                      </select>
                    </div>
                    <div>
                      <textarea 
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                        placeholder="What's happening with the driver?"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {sampleNotes.map((note, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold">{note.driver.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{note.driver}</h4>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{note.timestamp}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{note.note}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              {note.tags.map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </button>
                              <button className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design Option 3: Sidebar Layout */}
        {selectedOption === 3 && (
          <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">W</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">Driver Notes</h1>
                    <p className="text-sm text-gray-500">Scott Speed</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>New Note</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>All Notes</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Athletes</span>
                  </button>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Recent Drivers</h3>
                  <div className="space-y-1">
                    {['Kyle Larson', 'Alex Bowman', 'Ross Chastain', 'Daniel Suarez'].map((driver, index) => (
                      <button key={index} className="w-full flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">{driver.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <span className="text-sm">{driver}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              <div className="bg-white border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Notes</h2>
                <p className="text-gray-500">Latest driver feedback and observations</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Driver</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Select driver...</option>
                          <option>Kyle Larson</option>
                          <option>Alex Bowman</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Select category...</option>
                          <option>Performance</option>
                          <option>Setup</option>
                          <option>Health</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Enter your note here..."
                      />
                    </div>
                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Save Note
                      </button>
                    </div>
                  </div>

                  {sampleNotes.map((note, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">{note.driver.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{note.driver}</h4>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{note.noteTaker}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{note.timestamp}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{note.note}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              {note.tags.map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DesignOptions; 