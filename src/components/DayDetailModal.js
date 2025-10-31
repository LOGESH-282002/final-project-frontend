'use client';

import { useState } from 'react';

export default function DayDetailModal({ date, habits, onClose, onToggleHabit }) {
  const [notes, setNotes] = useState({});
  const [isUpdating, setIsUpdating] = useState({});

  const dateStr = date.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  const isFuture = dateStr > today;

  // Check if a habit is completed on this date
  const isHabitCompleted = (habit) => {
    return habit.recent_completions?.some(log => log.completed_date === dateStr) || false;
  };

  // Get notes for a habit on this date
  const getHabitNotes = (habit) => {
    const log = habit.recent_completions?.find(log => log.completed_date === dateStr);
    return log?.notes || '';
  };

  // Handle toggling a habit completion
  const handleToggle = async (habitId) => {
    setIsUpdating(prev => ({ ...prev, [habitId]: true }));
    
    try {
      await onToggleHabit(habitId, dateStr, notes[habitId] || '');
      // Clear notes after successful toggle
      setNotes(prev => ({ ...prev, [habitId]: '' }));
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

  // Get completion summary
  const getCompletionSummary = () => {
    const completed = habits.filter(habit => isHabitCompleted(habit)).length;
    const total = habits.length;
    return { completed, total };
  };

  const summary = getCompletionSummary();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-black">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <p className="text-sm text-black mt-1">
              {summary.completed} of {summary.total} habits completed
              {isFuture && <span className="text-blue-600 ml-2">(Future date)</span>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-black">No habits to track yet.</p>
              <p className="text-sm text-black mt-2">
                Create some habits to start tracking your progress!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => {
                const isCompleted = isHabitCompleted(habit);
                const existingNotes = getHabitNotes(habit);
                const currentNotes = notes[habit.id] || existingNotes;
                const isLoading = isUpdating[habit.id];

                return (
                  <div
                    key={habit.id}
                    className="border border-gray-200 rounded-lg p-4"
                    style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{habit.title}</h3>
                        {habit.description && (
                          <p className="text-sm text-black mt-1">{habit.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <span className="text-primary-600 text-sm font-medium">Completed</span>
                        )}
                        
                        <button
                          onClick={() => handleToggle(habit.id)}
                          disabled={isLoading || isFuture}
                          className={`
                            px-3 py-1 rounded-md text-sm font-medium transition-colors
                            ${isCompleted
                              ? 'bg-gray-600 hover:bg-gray-700 text-white'
                              : 'bg-primary-600 hover:bg-primary-700 text-white'
                            }
                            ${(isLoading || isFuture) ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {isLoading 
                            ? 'Updating...' 
                            : isCompleted 
                              ? 'Mark Incomplete' 
                              : 'Mark Complete'
                          }
                        </button>
                      </div>
                    </div>

                    {/* Notes section */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-black mb-1">
                        Notes (optional)
                      </label>
                      <textarea
                        value={currentNotes}
                        onChange={(e) => handleNotesChange(habit.id, e.target.value)}
                        placeholder="Add a note for this day..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none text-black"
                        rows={2}
                        disabled={isFuture}
                      />
                      {existingNotes && !notes[habit.id] && (
                        <p className="text-xs text-black mt-1">
                          Current note: "{existingNotes}"
                        </p>
                      )}
                    </div>

                    {/* Quick toggle with notes */}
                    {currentNotes && currentNotes !== existingNotes && (
                      <div className="mt-2">
                        <button
                          onClick={() => handleToggle(habit.id)}
                          disabled={isLoading || isFuture}
                          className={`
                            w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
                            ${isCompleted
                              ? 'bg-gray-600 hover:bg-gray-700 text-white'
                              : 'bg-primary-600 hover:bg-primary-700 text-white'
                            }
                            ${(isLoading || isFuture) ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {isLoading 
                            ? 'Updating...' 
                            : isCompleted 
                              ? 'Update & Mark Incomplete' 
                              : 'Save Note & Mark Complete'
                          }
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}