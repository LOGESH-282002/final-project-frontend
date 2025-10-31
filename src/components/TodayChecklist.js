'use client';

import { useState } from 'react';

export default function TodayChecklist({ habits, onToggleHabit }) {
  const [notes, setNotes] = useState({});
  const [showNotes, setShowNotes] = useState({});
  const [isUpdating, setIsUpdating] = useState({});

  const today = new Date().toISOString().split('T')[0];

  // Check if a habit is completed today
  const isHabitCompleted = (habit) => {
    return habit.recent_completions?.some(log => log.completed_date === today) || false;
  };

  // Get notes for a habit today
  const getHabitNotes = (habit) => {
    const log = habit.recent_completions?.find(log => log.completed_date === today);
    return log?.notes || '';
  };

  // Handle toggling a habit
  const handleToggle = async (habitId) => {
    setIsUpdating(prev => ({ ...prev, [habitId]: true }));
    
    try {
      await onToggleHabit(habitId, today, notes[habitId] || '');
      // Clear notes after successful toggle
      setNotes(prev => ({ ...prev, [habitId]: '' }));
      setShowNotes(prev => ({ ...prev, [habitId]: false }));
    } catch (error) {
      console.error('Error toggling habit:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [habitId]: false }));
    }
  };

  // Handle notes change
  const handleNotesChange = (habitId, value) => {
    setNotes(prev => ({ ...prev, [habitId]: value }));
  };

  // Toggle notes visibility
  const toggleNotes = (habitId) => {
    setShowNotes(prev => ({ ...prev, [habitId]: !prev[habitId] }));
    // Pre-fill with existing notes if any
    if (!notes[habitId]) {
      const existingNotes = getHabitNotes(habits.find(h => h.id === habitId));
      if (existingNotes) {
        setNotes(prev => ({ ...prev, [habitId]: existingNotes }));
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black">Today's Habits</h3>
        <p className="text-sm text-black mt-1">
          Complete your daily habits and build consistency
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {habits.map((habit) => {
          const isCompleted = isHabitCompleted(habit);
          const existingNotes = getHabitNotes(habit);
          const currentNotes = notes[habit.id] || existingNotes;
          const isLoading = isUpdating[habit.id];
          const showNotesForHabit = showNotes[habit.id];

          return (
            <div key={habit.id} className="p-6">
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(habit.id)}
                  disabled={isLoading}
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${isCompleted
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 hover:border-green-400'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {isCompleted && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Habit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className={`font-medium ${isCompleted ? 'text-green-700 line-through' : 'text-black'}`}>
                        {habit.title}
                      </h4>
                      
                      {/* Category Badge */}
                      {habit.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-black rounded-full">
                          {habit.category}
                        </span>
                      )}
                    </div>

                    {/* Streak Counter */}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-orange-600">
                        <span>🔥</span>
                        <span className="font-medium">{habit.current_streak || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <span>🏆</span>
                        <span className="font-medium">{habit.longest_streak || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {habit.description && (
                    <p className="text-sm text-black mb-2">{habit.description}</p>
                  )}

                  {/* Existing Notes Display */}
                  {existingNotes && !showNotesForHabit && (
                    <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium text-black">Note: </span>
                      <span className="text-black">{existingNotes}</span>
                    </div>
                  )}

                  {/* Notes Section */}
                  {showNotesForHabit && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={currentNotes}
                        onChange={(e) => handleNotesChange(habit.id, e.target.value)}
                        placeholder="Add a note for today..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none text-black"
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggle(habit.id)}
                          disabled={isLoading}
                          className={`
                            px-3 py-1 rounded-md text-sm font-medium transition-colors
                            ${isCompleted
                              ? 'bg-gray-600 hover:bg-gray-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                            }
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {isLoading 
                            ? 'Updating...' 
                            : isCompleted 
                              ? 'Update & Mark Incomplete' 
                              : 'Save Note & Complete'
                          }
                        </button>
                        <button
                          onClick={() => toggleNotes(habit.id)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!showNotesForHabit && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => toggleNotes(habit.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {existingNotes ? 'Edit Note' : 'Add Note'}
                      </button>
                      
                      {isCompleted && (
                        <span className="text-sm text-green-600 font-medium">✓ Completed</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="p-6 text-center text-black">
          <p>No active habits to display.</p>
        </div>
      )}
    </div>
  );
}