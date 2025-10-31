'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Layout from '@/components/Layout';
import TodayChecklist from '@/components/TodayChecklist';
import WeeklyPreview from '@/components/WeeklyPreview';
import ExportButton from '@/components/ExportButton';

export default function TodayPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
        // Only show active habits on today screen
        const activeHabits = data.habits.filter(habit => habit.is_active);
        setHabits(activeHabits);
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

  const handleToggleHabit = async (habitId, date, notes = '') => {
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

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const completed = habits.filter(habit => 
      habit.recent_completions?.some(log => log.completed_date === today)
    ).length;
    const total = habits.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

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
    return null; // Will redirect
  }

  const stats = getTodayStats();
  const today = new Date();

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Today's Header */}
          <div className="card mb-6">
            <div className="card-content">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {today.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {stats.completed} of {stats.total} habits completed
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <ExportButton habits={habits} />
                  </div>
                </div>
              
              {/* Progress Circle */}
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={stats.percentage === 100 ? "text-green-500" : "text-blue-500"}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={`${stats.percentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.percentage}%</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    stats.percentage === 100 ? 'bg-green-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {habits.length === 0 ? (
            <div className="card">
              <div className="card-content text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No active habits
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create some habits to start tracking your daily progress!
                </p>
                <Link
                  href="/habits"
                  className="btn btn-primary"
                >
                  Create Your First Habit
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Checklist - Takes up 2 columns */}
              <div className="lg:col-span-2">
                <TodayChecklist 
                  habits={habits}
                  onToggleHabit={handleToggleHabit}
                />
              </div>

              {/* Weekly Preview - Takes up 1 column */}
              <div className="lg:col-span-1">
                <WeeklyPreview habits={habits} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}