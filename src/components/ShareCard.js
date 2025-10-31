'use client';

import { useRef } from 'react';

export default function ShareCard({ settings, habits, stats, user }) {
  const cardRef = useRef(null);

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

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      // Use html2canvas to convert the card to an image
      const html2canvas = (await import('html2canvas')).default;
      
      const getBackgroundColor = () => {
        if (settings.theme === 'dark') return '#1f2937';
        if (settings.theme === 'gradient') return '#9333ea'; // purple-600
        return '#ffffff';
      };

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: getBackgroundColor(),
        scale: 3, // Higher resolution for better quality
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 600
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `habit-streaks-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Failed to download card:', error);
      alert('Failed to download card. Please try again.');
    }
  };

  const copyShareLink = async () => {
    // Generate a simple share text
    const shareText = `🔥 My habit streaks!\n\n${habits.map(h => 
      `${getStreakEmoji(h.current_streak)} ${h.title}: ${h.current_streak} days`
    ).join('\n')}\n\n💪 Keep building those habits!`;

    try {
      await navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy share text.');
    }
  };

  const generatePublicLink = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/share/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: settings,
          habits: habits.map(h => ({
            id: h.id,
            title: h.title,
            current_streak: h.current_streak,
            longest_streak: h.longest_streak
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        const shareUrl = `${window.location.origin}/public/${data.shareId}`;
        await navigator.clipboard.writeText(shareUrl);
        alert('Public share link copied to clipboard!');
      } else {
        throw new Error('Failed to create share link');
      }
    } catch (error) {
      console.error('Failed to generate public link:', error);
      alert('Failed to generate public link. Using text share instead.');
      copyShareLink();
    }
  };

  const selectedHabits = habits.slice(0, 6); // Limit to 6 for better layout
  const totalCurrentStreak = selectedHabits.reduce((sum, h) => sum + (h.current_streak || 0), 0);
  const bestStreak = Math.max(...selectedHabits.map(h => h.longest_streak || 0), 0);

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
    <div className="space-y-4">
      {/* Share Card Preview */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-black mb-4">Share Card Preview</h3>
        
        <div 
          ref={cardRef}
          className={`w-full max-w-sm mx-auto p-8 rounded-3xl shadow-xl ${cardClasses} relative overflow-hidden`}
          style={{ aspectRatio: '2/3', width: '400px' }}
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
                {new Date().toLocaleDateString('en-US', { 
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
            {selectedHabits.length > 0 && (
              <div className="space-y-4">
                <div className="text-center text-base font-semibold opacity-90 mb-4">
                  Active Streaks
                </div>
                
                {selectedHabits.map((habit) => (
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

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={downloadCard}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Share Card</span>
        </button>
        
        <button
          onClick={generatePublicLink}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>Copy Public Link</span>
        </button>
        
        <button
          onClick={copyShareLink}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy Share Text</span>
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Sharing Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Perfect for Instagram stories or social media posts</li>
          <li>• Share your progress to inspire others</li>
          <li>• Use the copy text feature for quick social posts</li>
          <li>• Download the card to save your milestone moments</li>
        </ul>
      </div>
    </div>
  );
}