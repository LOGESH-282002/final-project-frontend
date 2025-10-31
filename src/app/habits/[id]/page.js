'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import EditHabitModal from '@/components/EditHabitModal';

export default function HabitDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const habitId = params.id;

  const [habit, setHabit] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && habitId) {
      fetchHabitDetails();
    }
  }, [user, habitId]);

  const fetchHabitDetails = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('No authentication token found');
        setIsLoading(false);
        return;
      }
      
      // Fetch habit details
      const habitResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habits/${habitId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (habitResponse.ok) {
        const habitData = await habitResponse.json();
        setHabit(habitData.habit);
      } else {
        setError('Habit not found');
        return;
      }

      // Fetch habit logs
      const logsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habits/${habitId}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(logsData.logs);
      }
    } catch (error) {
      console.error('Error fetching habit details:', error);
      setError('Failed to fetch habit details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHabit = async (habitData) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habits/${habitId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        const data = await response.json();
        setHabit(data.habit);
        setShowEditModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update habit');
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      setError('Failed to update habit');
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habits/${habitId}/logs/${logId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setLogs(logs.filter(log => log.id !== logId));
      } else {
        setError('Failed to delete log entry');
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      setError('Failed to delete log entry');
    }
  };



  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error || 'Access denied'}</div>
      </div>
    );
  }

  if (!habit) {
    return null;
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/habits" className="text-blue-600 hover:text-blue-800">
                ← Back to Habits
              </Link>
              <h1 className="text-xl font-semibold">{habit.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Edit Habit
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Habit Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: habit.color }}>
                <h2 className="text-xl font-semibold mb-4">Habit Details</h2>
                
                {habit.description && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-black mb-1">Description</h3>
                    <p className="text-black">{habit.description}</p>
                  </div>
                )}

                {habit.category && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-black mb-1">Category</h3>
                    <span className="inline-block px-2 py-1 text-sm font-medium bg-gray-100 text-black rounded-full">
                      {habit.category}
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-black">Type:</span>
                    <span className="ml-2 text-sm text-black">Daily Habit</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-black">Created:</span>
                    <span className="ml-2 text-sm text-black">
                      {new Date(habit.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-black mb-3">Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-black">Total Completions:</span>
                      <span className="text-sm font-medium text-black">{logs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-black">Current Streak:</span>
                      <span className="text-sm font-medium text-black flex items-center">
                        🔥 {habit.current_streak || 0} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-black">Longest Streak:</span>
                      <span className="text-sm font-medium text-black flex items-center">
                        🏆 {habit.longest_streak || 0} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Completion History</h2>
                
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-black">
                    No completions logged yet
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {logs.map((log) => (
                      <div key={log.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-black">
                              {new Date(log.completed_at).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-black">
                              {new Date(log.completed_at).toLocaleTimeString()}
                            </span>
                          </div>
                          {log.notes && (
                            <p className="text-sm text-black mt-1">{log.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-gray-400 hover:text-red-600 ml-4"
                          title="Delete log entry"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showEditModal && (
        <EditHabitModal
          habit={habit}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateHabit}
        />
      )}
    </div>
  );
}