'use client';

export default function ShareSettings({ settings, habits, onSettingsChange }) {
  const handleInputChange = (key, value) => {
    onSettingsChange({ [key]: value });
  };

  const handleHabitToggle = (habitId) => {
    const currentSelected = settings.selectedHabits || [];
    const newSelected = currentSelected.includes(habitId)
      ? currentSelected.filter(id => id !== habitId)
      : [...currentSelected, habitId];
    
    onSettingsChange({ selectedHabits: newSelected });
  };

  const selectTopHabits = (count) => {
    const topHabits = habits
      .filter(h => h.current_streak > 0)
      .sort((a, b) => b.current_streak - a.current_streak)
      .slice(0, count)
      .map(h => h.id);
    
    onSettingsChange({ selectedHabits: topHabits });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-black mb-4">Customize Your Share Card</h3>
      
      <div className="space-y-6">
        {/* Username Settings */}
        <div>
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={settings.showUsername}
              onChange={(e) => handleInputChange('showUsername', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-black">Show username</span>
          </label>
          
          {settings.showUsername && (
            <input
              type="text"
              value={settings.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter username or @handle"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Theme</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleInputChange('theme', 'light')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                settings.theme === 'light'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-6 bg-white rounded mb-2 border"></div>
              <div className="text-xs text-black">Light</div>
            </button>
            
            <button
              onClick={() => handleInputChange('theme', 'dark')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                settings.theme === 'dark'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-6 bg-gray-800 rounded mb-2"></div>
              <div className="text-xs text-black">Dark</div>
            </button>

            <button
              onClick={() => handleInputChange('theme', 'gradient')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                settings.theme === 'gradient'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded mb-2"></div>
              <div className="text-xs text-black">Gradient</div>
            </button>
          </div>
        </div>

        {/* Display Options */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Display Options</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showBestStreak}
                onChange={(e) => handleInputChange('showBestStreak', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-black">Show best streak</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showHabitNames}
                onChange={(e) => handleInputChange('showHabitNames', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-black">Show habit names</span>
            </label>
          </div>
        </div>

        {/* Habit Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-black">Select Habits to Share</label>
            <div className="flex space-x-1">
              <button
                onClick={() => selectTopHabits(3)}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Top 3
              </button>
              <button
                onClick={() => selectTopHabits(5)}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Top 5
              </button>
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2">
            {habits.map((habit) => (
              <label key={habit.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={settings.selectedHabits?.includes(habit.id) || false}
                  onChange={() => handleHabitToggle(habit.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-black truncate">{habit.title}</div>
                  <div className="text-xs text-gray-600">
                    Current: {habit.current_streak} days • Best: {habit.longest_streak} days
                  </div>
                </div>
              </label>
            ))}
          </div>
          
          <div className="mt-2 text-xs text-gray-600">
            {settings.selectedHabits?.length || 0} of {habits.length} habits selected
          </div>
        </div>
      </div>
    </div>
  );
}