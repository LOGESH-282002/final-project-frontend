'use client';

export default function ProgressChart({ habits, timeframe = '7d' }) {
  const getChartData = () => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const today = new Date();
    const chartData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calculate completion percentage for this date
      const totalHabits = habits.filter(h => h.is_active).length;
      const completedHabits = habits.filter(h => {
        return h.recent_completions?.some(log => log.completed_date === dateStr);
      }).length;
      
      const percentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
      
      chartData.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        percentage: Math.round(percentage),
        completed: completedHabits,
        total: totalHabits
      });
    }

    return chartData;
  };

  const chartData = getChartData();
  const maxHeight = 80; // pixels

  const getBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 30) return 'bg-orange-500';
    return 'bg-red-400';
  };

  const getBarHeight = (percentage) => {
    return Math.max((percentage / 100) * maxHeight, 2); // minimum 2px height
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">Progress Chart</h3>
        <div className="text-sm text-gray-600">
          {timeframe === '7d' ? 'Last 7 days' : timeframe === '30d' ? 'Last 30 days' : 'Last 90 days'}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="flex items-end justify-between space-x-1 mb-4" style={{ height: `${maxHeight + 20}px` }}>
          {chartData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative group">
                {/* Bar */}
                <div 
                  className={`w-full rounded-t transition-all duration-300 ${getBarColor(day.percentage)} hover:opacity-80`}
                  style={{ height: `${getBarHeight(day.percentage)}px` }}
                ></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {day.percentage}% ({day.completed}/{day.total})
                  <div className="text-xs opacity-75">{new Date(day.date).toLocaleDateString()}</div>
                </div>
              </div>
              
              {/* Day label */}
              <div className="text-xs text-black mt-2 font-medium">
                {timeframe === '7d' ? day.day : day.dayNum}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>90%+</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>70%+</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>50%+</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>30%+</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>&lt;30%</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-black">
              {Math.round(chartData.reduce((sum, day) => sum + day.percentage, 0) / chartData.length)}%
            </div>
            <div className="text-xs text-gray-600">Avg Completion</div>
          </div>
          <div>
            <div className="text-lg font-bold text-black">
              {chartData.filter(day => day.percentage >= 80).length}
            </div>
            <div className="text-xs text-gray-600">Great Days (80%+)</div>
          </div>
          <div>
            <div className="text-lg font-bold text-black">
              {chartData.filter(day => day.percentage === 100).length}
            </div>
            <div className="text-xs text-gray-600">Perfect Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}