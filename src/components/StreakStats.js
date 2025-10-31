'use client';

export default function StreakStats({ stats, habits }) {
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

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-red-600';
    if (streak >= 14) return 'text-orange-600';
    if (streak >= 7) return 'text-yellow-600';
    if (streak >= 3) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStreakBadge = (streak) => {
    if (streak >= 100) return { emoji: '💯', label: 'Century Club', color: 'bg-purple-100 text-purple-800' };
    if (streak >= 50) return { emoji: '🚀', label: 'Rocket', color: 'bg-blue-100 text-blue-800' };
    if (streak >= 30) return { emoji: '⭐', label: 'Star', color: 'bg-yellow-100 text-yellow-800' };
    if (streak >= 14) return { emoji: '💪', label: 'Strong', color: 'bg-orange-100 text-orange-800' };
    if (streak >= 7) return { emoji: '✨', label: 'Sparkle', color: 'bg-green-100 text-green-800' };
    if (streak >= 3) return { emoji: '🔥', label: 'Fire', color: 'bg-red-100 text-red-800' };
    return { emoji: '🌱', label: 'Growing', color: 'bg-gray-100 text-gray-800' };
  };

  const topHabits = habits
    .filter(h => h.current_streak > 0)
    .sort((a, b) => b.current_streak - a.current_streak)
    .slice(0, 5);

  // Calculate weekly progress (last 7 days)
  const getWeeklyProgress = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate completion data (in real app, this would come from actual completion data)
      const completions = habits.filter(h => h.current_streak > i).length;
      const percentage = habits.length > 0 ? (completions / habits.length) * 100 : 0;
      
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        percentage: Math.round(percentage),
        completions
      });
    }
    
    return weekData;
  };

  const weeklyData = getWeeklyProgress();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-black mb-4">Your Streak Stats</h3>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
          <div className="text-2xl mb-1">{getStreakEmoji(stats.longestSingleStreak)}</div>
          <div className="text-2xl font-bold text-black">{stats.longestSingleStreak}</div>
          <div className="text-sm text-black">Best Streak</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-2xl font-bold text-black">{stats.activeStreaks}</div>
          <div className="text-sm text-black">Active Streaks</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-2xl font-bold text-black">{stats.avgCurrentStreak}</div>
          <div className="text-sm text-black">Avg Streak</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-black">{stats.totalCurrentStreak}</div>
          <div className="text-sm text-black">Total Days</div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mb-6">
        <h4 className="font-medium text-black mb-3">This Week's Progress</h4>
        <div className="flex items-end justify-between space-x-2 h-24">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t flex-1 flex items-end">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300"
                  style={{ height: `${day.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-black mt-1 font-medium">{day.day}</div>
              <div className="text-xs text-gray-600">{day.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Badges */}
      {stats.longestSingleStreak > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-black mb-3">Achievement Badges</h4>
          <div className="flex flex-wrap gap-2">
            {topHabits.map((habit) => {
              const badge = getStreakBadge(habit.current_streak);
              return (
                <div key={habit.id} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                  <span className="mr-1">{badge.emoji}</span>
                  {badge.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Performing Habits */}
      {topHabits.length > 0 && (
        <div>
          <h4 className="font-medium text-black mb-3">Top Performing Habits</h4>
          <div className="space-y-2">
            {topHabits.map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{getStreakEmoji(habit.current_streak)}</div>
                  <div>
                    <div className="font-medium text-black">{habit.title}</div>
                    {habit.category && (
                      <div className="text-xs text-gray-600">{habit.category}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getStreakColor(habit.current_streak)}`}>
                    {habit.current_streak} days
                  </div>
                  <div className="text-xs text-gray-600">
                    Best: {habit.longest_streak}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Chart (Simple Visual) */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-black mb-3">Streak Distribution</h4>
        <div className="space-y-2">
          {[
            { label: '30+ days', count: habits.filter(h => h.current_streak >= 30).length, color: 'bg-red-500' },
            { label: '14-29 days', count: habits.filter(h => h.current_streak >= 14 && h.current_streak < 30).length, color: 'bg-orange-500' },
            { label: '7-13 days', count: habits.filter(h => h.current_streak >= 7 && h.current_streak < 14).length, color: 'bg-yellow-500' },
            { label: '1-6 days', count: habits.filter(h => h.current_streak >= 1 && h.current_streak < 7).length, color: 'bg-blue-500' },
            { label: 'No streak', count: habits.filter(h => h.current_streak === 0).length, color: 'bg-gray-300' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded ${item.color}`}></div>
              <div className="flex-1 text-sm text-black">{item.label}</div>
              <div className="text-sm font-medium text-black">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}