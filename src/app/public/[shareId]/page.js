'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function PublicSharePage() {
  const params = useParams();
  const shareId = params.shareId;
  const [shareData, setShareData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (shareId) {
      fetchShareData();
    }
  }, [shareId]);

  const fetchShareData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/share/${shareId}`);
      
      if (response.ok) {
        const data = await response.json();
        setShareData(data);
      } else if (response.status === 404) {
        setError('Share not found or has expired');
      } else {
        setError('Failed to load shared streaks');
      }
    } catch (error) {
      console.error('Error fetching share data:', error);
      setError('Failed to load shared streaks');
    } finally {
      setIsLoading(false);
    }
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 100) return '🔥💯';
    if (streak >= 50) return '🔥🚀';
    if (streak >= 30) return '🔥⭐';
    if (streak >= 14) return '🔥💪';
    if (streak >= 7) return '🔥✨';
    if (streak >= 3) return '🔥';
    if (streak >= 1) return '✨';
    return '💤';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-700">Loading shared streaks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
          >
            Start Your Own Habit Journey
          </Link>
        </div>
      </div>
    );
  }

  if (!shareData) {
    return null;
  }

  const { settings, habits, createdAt } = shareData;
  const totalCurrentStreak = habits.reduce((sum, h) => sum + (h.current_streak || 0), 0);
  const bestStreak = Math.max(...habits.map(h => h.longest_streak || 0), 0);

  const getCardClasses = () => {
    if (settings.theme === 'dark') return 'bg-gray-800 text-white';
    if (settings.theme === 'gradient') return 'bg-gradient-to-br from-purple-600 to-pink-600 text-white';
    return 'bg-white text-gray-900';
  };

  const getAccentClasses = () => {
    if (settings.theme === 'dark') return 'text-yellow-400';
    if (settings.theme === 'gradient') return 'text-yellow-300';
    return 'text-orange-600';
  };

  const cardClasses = getCardClasses();
  const accentClasses = getAccentClasses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔥</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Shared Habit Streaks</h1>
                <p className="text-sm text-gray-600">
                  Shared on {new Date(createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Share Card Display */}
          <div className="flex justify-center">
            <div 
              className={`w-full max-w-sm p-8 rounded-3xl shadow-xl ${cardClasses} relative overflow-hidden`}
              style={{ aspectRatio: '2/3' }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 text-6xl">🔥</div>
                <div className="absolute bottom-4 left-4 text-4xl">✨</div>
                <div className="absolute top-1/3 left-8 text-3xl">💪</div>
              </div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  {settings.showUsername && settings.username && (
                    <div className="text-xl font-bold mb-3 opacity-90">
                      {settings.username.startsWith('@') ? settings.username : `@${settings.username}`}
                    </div>
                  )}
                  <div className="text-3xl font-bold mb-2">My Habit Streaks</div>
                  <div className="text-sm opacity-75">
                    {new Date(createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 rounded-2xl bg-opacity-10 bg-white">
                    <div className="text-4xl mb-2">{getStreakEmoji(totalCurrentStreak)}</div>
                    <div className={`text-3xl font-bold ${accentClasses}`}>{totalCurrentStreak}</div>
                    <div className="text-sm opacity-75 font-medium">Total Days</div>
                  </div>
                  
                  {settings.showBestStreak && (
                    <div className="text-center p-4 rounded-2xl bg-opacity-10 bg-white">
                      <div className="text-4xl mb-2">🏆</div>
                      <div className={`text-3xl font-bold ${accentClasses}`}>{bestStreak}</div>
                      <div className="text-sm opacity-75 font-medium">Best Streak</div>
                    </div>
                  )}
                </div>

                {/* Habits List */}
                {habits.length > 0 && (
                  <div className="space-y-4">
                    <div className="text-center text-base font-semibold opacity-90 mb-4">
                      Active Streaks
                    </div>
                    
                    {habits.map((habit) => (
                      <div key={habit.id} className="flex items-center justify-between p-3 rounded-xl bg-opacity-10 bg-white">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <span className="text-2xl">{getStreakEmoji(habit.current_streak)}</span>
                          {settings.showHabitNames && (
                            <span className="text-base font-medium truncate">{habit.title}</span>
                          )}
                        </div>
                        <div className={`text-lg font-bold ${accentClasses}`}>
                          {habit.current_streak}d
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-opacity-20 text-center">
                  <div className="text-sm opacity-75 font-medium">
                    Building habits, one day at a time 💪
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Inspiration Message */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Inspired by these streaks? 🚀
              </h3>
              <p className="text-gray-600 mb-4">
                Building consistent habits is one of the most powerful ways to create positive change in your life. 
                Every streak starts with a single day!
              </p>
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
              >
                Start Your Own Habits
              </Link>
            </div>

            {/* Stats Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Streak Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Active Habits</span>
                  <span className="font-semibold text-gray-900">{habits.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Combined Streak Days</span>
                  <span className="font-semibold text-gray-900">{totalCurrentStreak}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Longest Single Streak</span>
                  <span className="font-semibold text-gray-900">{bestStreak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Streak Length</span>
                  <span className="font-semibold text-gray-900">
                    {habits.length > 0 ? Math.round(totalCurrentStreak / habits.length) : 0} days
                  </span>
                </div>
              </div>
            </div>

            {/* Habit Categories */}
            {habits.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Habit Performance</h3>
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getStreakEmoji(habit.current_streak)}</span>
                        <div>
                          <div className="font-medium text-gray-900">{habit.title}</div>
                          <div className="text-sm text-gray-600">
                            Best streak: {habit.longest_streak} days
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{habit.current_streak}</div>
                        <div className="text-xs text-gray-500">days</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            Ready to build your own habit streaks? 
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
              Get started for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}