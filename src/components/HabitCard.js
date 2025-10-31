'use client';

import { useState } from 'react';
import Link from 'next/link';
import CompletionHistory from './CompletionHistory';

export default function HabitCard({ habit, onDelete, onToggleDay }) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isToggling, setIsToggling] = useState(false);

  const isCompletedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return habit.recent_completions?.some(log => log.completed_date === today) || false;
  };

  const handleToggleToday = async () => {
    setIsToggling(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await onToggleDay(habit.id, today, notes);
      setNotes('');
      setShowNotes(false);
    } catch (error) {
      console.error('Error toggling habit:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      onDelete(habit.id);
    }
  };

  const completedToday = isCompletedToday();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: habit.color }}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link href={`/habits/${habit.id}`} className="hover:text-blue-600">
            <h3 className="text-lg font-semibold text-black mb-1 hover:text-blue-600 transition-colors">{habit.title}</h3>
          </Link>
          {habit.description && (
            <p className="text-sm text-black mb-2">{habit.description}</p>
          )}
          {habit.category && (
            <div className="mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-black rounded-full">
                {habit.category}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-4 text-sm text-black">
            <div className="flex items-center space-x-1">
              <span>🔥</span>
              <span>{habit.current_streak || 0} day streak</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🏆</span>
              <span>Best: {habit.longest_streak || 0}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-600 ml-2"
          title="Delete habit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Today's Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-black">Today</span>
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${completedToday 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
            }
          `}>
            {completedToday ? '✓ Completed' : 'Not completed'}
          </div>
        </div>
      </div>

      {/* 14-Day Completion History */}
      <CompletionHistory 
        habit={habit} 
        onToggleDay={onToggleDay}
      />

      {/* Action Buttons */}
      <div className="space-y-2">
        {!showNotes ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleToggleToday()}
              disabled={isToggling}
              className={`
                flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${completedToday
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }
                ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isToggling 
                ? 'Updating...' 
                : completedToday 
                  ? 'Mark Incomplete' 
                  : 'Mark Complete'
              }
            </button>
            <button
              onClick={() => setShowNotes(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
            >
              Add Note
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note (optional)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none text-black"
              rows={2}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleToggleToday}
                disabled={isToggling}
                className={`
                  flex-1 px-4 py-2 rounded-md text-sm font-medium
                  ${completedToday
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  }
                  ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isToggling 
                  ? 'Updating...' 
                  : completedToday 
                    ? 'Mark Incomplete with Note' 
                    : 'Complete with Note'
                }
              </button>
              <button
                onClick={() => {
                  setShowNotes(false);
                  setNotes('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}