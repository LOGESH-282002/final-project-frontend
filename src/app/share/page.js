'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Layout from '@/components/Layout';
import StreakStats from '@/components/StreakStats';
import ShareCard from '@/components/ShareCard';
import ShareSettings from '@/components/ShareSettings';
import ProgressChart from '@/components/ProgressChart';

export default function SharePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareSettings, setShareSettings] = useState({
    username: '',
    showUsername: true,
    theme: 'light',
    showBestStreak: true,
    showHabitNames: true,
    selectedHabits: []
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchHabits();
      // Set default username from user profile
      setShareSettings(prev => ({
        ...prev,
        username: user.name || ''
      }));
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
        // Only show active habits with streaks
        const activeHabits = data.habits.filter(habit => 
          habit.is_active && (habit.current_streak > 0 || habit.longest_streak > 0)
        );
        setHabits(activeHabits);
        
        // Auto-select top 3 habits by current streak
        const topHabits = activeHabits
          .sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0))
          .slice(0, 3)
          .map(h => h.id);
        
        setShareSettings(prev => ({
          ...prev,
          selectedHabits: topHabits
        }));
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

  const getStreakStats = () => {
    const activeHabits = habits.filter(h => h.is_active);
    const totalCurrentStreak = activeHabits.reduce((sum, h) => sum + (h.current_streak || 0), 0);
    const totalBestStreak = activeHabits.reduce((sum, h) => sum + (h.longest_streak || 0), 0);
    const avgCurrentStreak = activeHabits.length > 0 ? Math.round(totalCurrentStreak / activeHabits.length) : 0;
    const longestSingleStreak = Math.max(...activeHabits.map(h => h.longest_streak || 0), 0);
    const activeStreaks = activeHabits.filter(h => (h.current_streak || 0) > 0).length;
    
    return {
      totalCurrentStreak,
      totalBestStreak,
      avgCurrentStreak,
      longestSingleStreak,
      activeStreaks,
      totalHabits: activeHabits.length
    };
  };

  const handleSettingsChange = (newSettings) => {
    setShareSettings(prev => ({ ...prev, ...newSettings }));
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
    return null;
  }

  const stats = getStreakStats();
  const selectedHabitsData = habits.filter(h => shareSettings.selectedHabits.includes(h.id));

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Share Progress
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create beautiful cards to share your habit streaks and progress
            </p>
          </div>
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {habits.length === 0 ? (
            <div className="card">
              <div className="card-content text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No streaks to share yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Build some habit streaks first, then come back to share your progress!
                </p>
                <Link
                  href="/habits"
                  className="btn btn-primary"
                >
                  Start Building Habits
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Stats and Settings */}
              <div className="space-y-6">
                {/* Streak Statistics */}
                <StreakStats stats={stats} habits={habits} />
                
                {/* Progress Chart */}
                <ProgressChart habits={habits} timeframe="7d" />
                
                {/* Share Settings */}
                <ShareSettings 
                  settings={shareSettings}
                  habits={habits}
                  onSettingsChange={handleSettingsChange}
                />
              </div>

              {/* Right Column - Share Card Preview */}
              <div className="lg:sticky lg:top-6">
                <ShareCard 
                  settings={shareSettings}
                  habits={selectedHabitsData}
                  stats={stats}
                  user={user}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}