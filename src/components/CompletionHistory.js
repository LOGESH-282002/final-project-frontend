'use client';

export default function CompletionHistory({ habit, onToggleDay }) {
  // Generate last 14 days
  const getLast14Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
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

  const isCompleted = (dateStr) => {
    return habit.recent_completions?.some(log => log.completed_date === dateStr) || false;
  };

  const handleDayClick = (dateStr) => {
    onToggleDay(habit.id, dateStr);
  };

  const days = getLast14Days();

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-black mb-2">Last 14 Days</h4>
      <div className="flex space-x-1 overflow-x-auto pb-2">
        {days.map((day) => {
          const completed = isCompleted(day.date);

          return (
            <button
              key={day.date}
              onClick={() => handleDayClick(day.date)}
              className={`
                flex-shrink-0 w-8 h-8 rounded-full text-xs font-medium transition-all duration-200
                ${completed
                  ? 'text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-black hover:bg-gray-200 border border-gray-300'
                }
                ${day.isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
              `}
              style={{
                backgroundColor: completed ? habit.color : undefined
              }}
              title={`${day.dayName} ${day.dayNumber} - ${completed ? 'Completed' : 'Not completed'}`}
            >
              {day.dayNumber}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-2 text-xs text-black">
        <span>2 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}