'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Layout from '@/components/Layout';
import HabitCard from '@/components/HabitCard';
import CreateHabitModal from '@/components/CreateHabitModal';
import HabitFilters from '@/components/HabitFilters';
import QuickFilters from '@/components/QuickFilters';

export default function HabitsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const filtersRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  // Initialize filtered habits when habits change
  useEffect(() => {
    if (habits.length > 0 && filteredHabits.length === 0) {
      setFilteredHabits(habits);
    }
  }, [habits, filteredHabits.length]);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('No authentication token found');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habits`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHabits(data.habits);
      } else {
        setError('Failed to fetch habits');
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
      setError('Failed to fetch habits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateHabit = async (habitData) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        const data = await response.json();
        setHabits([data.habit, ...habits]);
        setShowCreateModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create habit');
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      setError('Failed to create habit');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setHabits(habits.filter(habit => habit.id !== habitId));
      } else {
        setError('Failed to delete habit');
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit');
    }
  };

  const handleToggleDay = async (habitId, date, notes = '') => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habits/${habitId}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, notes }),
      });

      if (response.ok) {
        // Refresh habits to get updated data
        fetchHabits();
      } else {
        setError('Failed to toggle habit completion');
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      setError('Failed to toggle habit completion');
    }
  };

  const handleFiltersChange = useCallback((filtered, filters) => {
    setFilteredHabits(filtered);
    setCurrentFilters(filters);
  }, []);

  const handleQuickFilter = useCallback((quickFilterOptions) => {
    if (filtersRef.current) {
      // Apply quick filter by updating the filters component
      Object.keys(quickFilterOptions).forEach(key => {
        filtersRef.current.handleFilterChange(key, quickFilterOptions[key]);
      });
    }
  }, []);

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                My Habits
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track and manage your daily habits
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Add Habit
            </button>
          </div>
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Quick Filters */}
          {habits.length > 0 && (
            <QuickFilters
              habits={habits}
              onQuickFilter={handleQuickFilter}
            />
          )}

          {/* Advanced Filters */}
          {habits.length > 0 && (
            <HabitFilters
              habits={habits}
              onFiltersChange={handleFiltersChange}
              ref={filtersRef}
            />
          )}

          {habits.length === 0 ? (
            <div className="card">
              <div className="card-content text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No habits yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first habit to start building better routines
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  Create Your First Habit
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              {filteredHabits.length !== habits.length && (
                <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                  <p className="text-sm text-primary-800 dark:text-primary-200">
                    Showing {filteredHabits.length} of {habits.length} habits
                    {currentFilters.completion !== 'all' && (
                      <span className="ml-1">
                        • {currentFilters.completion === 'completed' ? 'Completed today' : 'Not completed today'}
                      </span>
                    )}
                    {currentFilters.category !== 'all' && (
                      <span className="ml-1">• Category: {currentFilters.category}</span>
                    )}
                    {currentFilters.status !== 'active' && (
                      <span className="ml-1">• Status: {currentFilters.status}</span>
                    )}
                  </p>
                </div>
              )}

              {filteredHabits.length === 0 ? (
                <div className="card">
                  <div className="card-content text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No habits match your filters
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your filters or create a new habit.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onDelete={handleDeleteHabit}
                      onToggleDay={handleToggleDay}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateHabitModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateHabit}
        />
      )}
    </Layout>
  );
}