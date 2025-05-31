import React, { useState } from 'react';
import { DriverNote } from '../types/interfaces';
import { drivers } from '../data/drivers';
import { athleteProfiles, AthleteProfile } from '../data/athleteProfiles';
import DriverLogo from './DriverLogo';
import { formatTimestamp } from '../utils/helpers';

interface AthleteDashboardProps {
  selectedAthlete: string;
  athleteNotes: DriverNote[];
  loadingAthleteData: boolean;
  onSelectAthlete: (athlete: string) => void;
  onClose: () => void;
  onFetchAthleteData: (athlete: string) => void;
  onDeleteNote: (note: DriverNote) => void;
  hapticFeedback: () => void;
}

const AthleteDashboard: React.FC<AthleteDashboardProps> = ({
  selectedAthlete,
  athleteNotes,
  loadingAthleteData,
  onSelectAthlete,
  onClose,
  onFetchAthleteData,
  onDeleteNote,
  hapticFeedback
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProfiles, setEditedProfiles] = useState<{ [key: string]: Partial<AthleteProfile> }>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const toggleEditMode = () => {
    if (!isEditMode && selectedAthlete && athleteProfiles[selectedAthlete]) {
      setEditedProfiles({
        [selectedAthlete]: {
          crewChief: athleteProfiles[selectedAthlete].crewChief,
          spotter: athleteProfiles[selectedAthlete].spotter,
          phone: athleteProfiles[selectedAthlete].phone,
          email: athleteProfiles[selectedAthlete].email
        }
      });
    }
    setIsEditMode(!isEditMode);
    hapticFeedback();
  };

  const updateProfileField = (athlete: string, field: string, value: string) => {
    setEditedProfiles(prev => ({
      ...prev,
      [athlete]: {
        ...prev[athlete],
        [field]: value
      }
    }));
  };

  const saveProfileChanges = async () => {
    setIsSavingProfile(true);
    hapticFeedback();
    
    // Here you would normally save to a backend
    // For now, we'll just simulate the save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you'd update the athleteProfiles data
    console.log('Saving profile changes:', editedProfiles);
    
    setIsSavingProfile(false);
    setIsEditMode(false);
    setEditedProfiles({});
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    if (selectedAthlete && editedProfiles[selectedAthlete]) {
      const { [selectedAthlete]: removed, ...rest } = editedProfiles;
      setEditedProfiles(rest);
    }
    hapticFeedback();
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => { onClose(); hapticFeedback(); }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Athletes Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="h-screen pt-16 pb-20">
        {selectedAthlete ? (
          /* Individual Athlete Profile */
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              {/* Athlete Header */}
              <div className="flex items-center space-x-4 mb-6">
                <DriverLogo driverName={selectedAthlete} size="lg" />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedAthlete}</h3>
                  <p className="text-gray-600">Professional Driver</p>
                </div>
                <div className="flex items-center space-x-3">
                  {isEditMode ? (
                    <>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveProfileChanges}
                        disabled={isSavingProfile}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isSavingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={toggleEditMode}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center space-x-2"
                    >
                      <i className="fas fa-edit text-sm"></i>
                      <span>Edit</span>
                    </button>
                  )}
                  <button
                    onClick={() => { onSelectAthlete(''); hapticFeedback(); }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Back to Athletes
                  </button>
                </div>
              </div>

              {/* Focus Items */}
              {(() => {
                const focusItems = athleteNotes.filter(note => note.Type === 'Focus');
                return focusItems.length > 0 ? (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <i className="fas fa-bullseye text-white text-lg"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-orange-900">Current Focus Areas</h4>
                        <p className="text-orange-700 text-sm">Priority items for {selectedAthlete}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {focusItems.map((focusItem, index) => (
                        <div key={index} className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm font-medium text-orange-800">
                                Focus Item #{index + 1}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-xs text-orange-600">
                                <span>{focusItem['Note Taker']}</span>
                                <span>•</span>
                                <span>{formatTimestamp(focusItem.Timestamp)}</span>
                              </div>
                              <button 
                                className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                                onClick={() => onDeleteNote(focusItem)}
                              >
                                <i className="fas fa-times text-sm"></i>
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-800 leading-relaxed">
                            {focusItem.Note.split('#').map((textPart, j) => 
                              j === 0 ? textPart : <span key={j}><span className="text-orange-600 font-medium">#{textPart.split(' ')[0]}</span>{textPart.substring(textPart.indexOf(' '))}</span>
                            )}
                          </p>
                          {focusItem.Tags && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {focusItem.Tags.split(',').map((tag: string, tagIndex: number) => (
                                <span key={tagIndex} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                  #{tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-calendar text-blue-500"></i>
                    <span className="text-sm font-medium text-gray-600">Next Race</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">TBD</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-flag-checkered text-blue-500"></i>
                    <span className="text-sm font-medium text-gray-600">Last Race</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">TBD</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-trophy text-blue-500"></i>
                    <span className="text-sm font-medium text-gray-600">Avg Finish</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">TBD</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-star text-blue-500"></i>
                    <span className="text-sm font-medium text-gray-600">Points</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">TBD</p>
                </div>
              </div>

              {/* Athlete Details */}
              {athleteProfiles[selectedAthlete] && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Personal Info */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <i className="fas fa-user text-blue-500 mr-2"></i>
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Birthday:</span>
                        <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].birthday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gym Time:</span>
                        <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].gymTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <i className="fas fa-users text-blue-500 mr-2"></i>
                      Team Information
                      {isEditMode && (
                        <span className="ml-2 text-sm text-blue-500 font-normal">
                          (Editing)
                        </span>
                      )}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crew Chief:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editedProfiles[selectedAthlete]?.crewChief || ''}
                            onChange={(e) => updateProfileField(selectedAthlete, 'crewChief', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                            placeholder="Enter crew chief name"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].crewChief || 'TBD'}</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spotter:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editedProfiles[selectedAthlete]?.spotter || ''}
                            onChange={(e) => updateProfileField(selectedAthlete, 'spotter', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                            placeholder="Enter spotter name"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{athleteProfiles[selectedAthlete].spotter || 'TBD'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <i className="fas fa-phone text-blue-500 mr-2"></i>
                      Contact Information
                      {isEditMode && (
                        <span className="ml-2 text-sm text-blue-500 font-normal">
                          (Editing)
                        </span>
                      )}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Phone:</span>
                        {isEditMode ? (
                          <input
                            type="tel"
                            value={editedProfiles[selectedAthlete]?.phone || ''}
                            onChange={(e) => updateProfileField(selectedAthlete, 'phone', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <a 
                            href={`tel:${athleteProfiles[selectedAthlete].phone}`}
                            className="font-medium text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            {athleteProfiles[selectedAthlete].phone}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Email:</span>
                        {isEditMode ? (
                          <input
                            type="email"
                            value={editedProfiles[selectedAthlete]?.email || ''}
                            onChange={(e) => updateProfileField(selectedAthlete, 'email', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                            placeholder="Enter email address"
                          />
                        ) : (
                          <a 
                            href={`mailto:${athleteProfiles[selectedAthlete].email}`}
                            className="font-medium text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            {athleteProfiles[selectedAthlete].email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Notes */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-clipboard-list text-blue-500 mr-2"></i>
                  Recent Notes ({athleteNotes.filter(note => note.Type !== 'Focus').length})
                </h4>
                {loadingAthleteData ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600">Loading notes...</span>
                    </div>
                  </div>
                ) : (() => {
                  const regularNotes = athleteNotes.filter(note => note.Type !== 'Focus');
                  return regularNotes.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {regularNotes.map((note, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">{note['Note Taker']}</span>
                              {note.Type && note.Type !== 'Note' && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {note.Type}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{formatTimestamp(note.Timestamp)}</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {note.Note.split('#').map((textPart, j) => 
                              j === 0 ? textPart : <span key={j}><span className="text-blue-500 font-medium">#{textPart.split(' ')[0]}</span>{textPart.substring(textPart.indexOf(' '))}</span>
                            )}
                          </p>
                          {note.Tags && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {note.Tags.split(',').map((tag: string, tagIndex: number) => (
                                <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  #{tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No regular notes available for this athlete.</p>
                  );
                })()}
              </div>
            </div>
          </div>
        ) : (
          /* Athletes Grid */
          <div className="h-full overflow-y-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {drivers.map((driver) => (
                <button
                  key={driver}
                  onClick={() => { 
                    onSelectAthlete(driver); 
                    onFetchAthleteData(driver);
                    hapticFeedback(); 
                  }}
                  className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500 rounded-2xl p-4 transition-all duration-200 text-left group shadow-sm"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <DriverLogo driverName={driver} size="md" />
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-500 transition-colors text-sm">
                        {driver}
                      </h3>
                      {athleteProfiles[driver] && (
                        <p className="text-xs text-gray-500 mt-1">
                          Age {athleteProfiles[driver].age}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteDashboard; 