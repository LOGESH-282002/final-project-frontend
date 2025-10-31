'use client';

export default function WeeklyPreview({ habits }) {
  // Get the last 7 days including today
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: i === 0
      });
    }
    
    return days;
  };

  // Check if a habit is completed on a specific date
  const isHabitCompleted = (habit, dateStr) => {
    return habit.recent_completions?.some(log => log.completed_date === dateStr) || false;
  };

  // Get completion stats for a specific day
  const getDayStats = (dateStr) => {
    const completed = habits.filter(habit => isHabitCompleted(habit, dateStr)).length;
    const total = habits.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Get overall week stats
  const getWeekStats = () => {
    const days = getLast7Days();
    let totalCompletions = 0;
    let totalPossible = habits.length * 7;
    
    days.forEach(day => {
      const dayStats = getDayStats(day.date);
      totalCompletions += dayStats.completed;
    });
    
    const weekPercentage = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
    
    return {
      totalCompletions,
      totalPossible,
      weekPercentage,
      averagePerDay: totalPossible > 0 ? Math.round(totalCompletions / 7 * 10) / 10 : 0
    };
  };

  const days = getLast7Days();
  const weekStats = getWeekStats();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black">Weekly Overview</h3>
        <p className="text-sm text-black mt-1">
          Last 7 days performance
        </p>
      </div>

      <div className="p-6">
        {/* Week Stats Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-black">{weekStats.weekPercentage}%</div>
              <div className="text-xs text-black">Week Average</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">{weekStats.averagePerDay}</div>
              <div className="text-xs text-black">Avg per Day</div>
            </div>
          </div>
          <div className="mt-3 text-center text-sm text-black">
            {weekStats.totalCompletions} of {weekStats.totalPossible} completed
          </div>
        </div>

        {/* Daily Grid Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((day) => (
            <div key={day.date} className="text-center">
              <div className="text-xs font-medium text-black">{day.dayName}</div>
              <div className="text-xs text-black">{day.dayNumber}</div>
            </div>
          ))}
        </div>

        {/* Habits Grid */}
        <div className="space-y-2">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center space-x-1">
              {/* Habit Name */}
              <div className="w-20 text-xs text-black truncate" title={habit.title}>
                {habit.title}
              </div>
              
              {/* Daily Completion Grid */}
              <div className="flex-1 grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const isCompleted = isHabitCompleted(habit, day.date);
                  const isFuture = day.date > new Date().toISOString().split('T')[0];
                  
                  return (
                    <div
                      key={day.date}
                      className={`
                        w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                        ${isFuture 
                          ? 'bg-gray-100 text-gray-400' 
                          : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-100 text-red-600'
                        }
                        ${day.isToday ? 'ring-2 ring-blue-400' : ''}
                      `}
                      title={`${habit.title} - ${day.dayName} ${day.dayNumber}: ${
                        isFuture ? 'Future' : isCompleted ? 'Completed' : 'Not completed'
                      }`}
                    >
                      {isFuture ? '·' : isCompleted ? '✓' : '✗'}
                    </div>
                  );
                })}
              </div>
              
              {/* Streak Counter */}
              <div className="w-8 text-xs text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span>🔥</span>
                  <span className="font-medium text-black">{habit.current_streak || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Summary Row */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <div className="w-20 text-xs font-medium text-black">Daily %</div>
            <div className="flex-1 grid grid-cols-7 gap-1">
              {days.map((day) => {
                const dayStats = getDayStats(day.date);
                const isFuture = day.date > new Date().toISOString().split('T')[0];
                
                return (
                  <div
                    key={day.date}
                    className={`
                      w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                      ${isFuture 
                        ? 'bg-gray-100 text-gray-400' 
                        : dayStats.percentage === 100 
                          ? 'bg-green-500 text-white' 
                          : dayStats.percentage >= 50 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-red-500 text-white'
                      }
                      ${day.isToday ? 'ring-2 ring-blue-400' : ''}
                    `}
                    title={`${day.dayName} ${day.dayNumber}: ${dayStats.completed}/${dayStats.total} (${dayStats.percentage}%)`}
                  >
                    {isFuture ? '·' : dayStats.percentage}
                  </div>
                );
              })}
            </div>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-black mb-2 font-medium">Legend:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-black">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 rounded"></div>
              <span className="text-black">Not completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <span className="text-black">Future date</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-blue-400 rounded"></div>
              <span className="text-black">Today</span>
            </div>
          </div>
        </div>
      </div>

      {habits.length === 0 && (
        <div className="p-6 text-center text-black">
          <p>No habits to preview.</p>
        </div>
      )}
    </div>
  );
}