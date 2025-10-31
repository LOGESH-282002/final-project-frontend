'use client';

export default function MonthlyCalendar({ currentMonth, habits, onDayClick }) {
  // Get the first day of the month and calculate calendar grid
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first Sunday of the calendar grid
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks) for the calendar grid
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Get completion status for a specific date
  const getDayStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    // Don't show status for future dates
    if (dateStr > today) {
      return { type: 'future', completedCount: 0, totalCount: habits.length };
    }
    
    let completedCount = 0;
    const totalCount = habits.length;
    
    habits.forEach(habit => {
      const isCompleted = habit.recent_completions?.some(log => log.completed_date === dateStr);
      if (isCompleted) completedCount++;
    });
    
    if (totalCount === 0) {
      return { type: 'no-habits', completedCount: 0, totalCount: 0 };
    }
    
    if (completedCount === totalCount) {
      return { type: 'all-completed', completedCount, totalCount };
    } else if (completedCount > 0) {
      return { type: 'partial', completedCount, totalCount };
    } else {
      return { type: 'none', completedCount, totalCount };
    }
  };

  // Get the appropriate styling for a day based on its status
  const getDayStyles = (date, status) => {
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const isToday = date.toDateString() === new Date().toDateString();
    
    let baseClasses = "w-full h-12 flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200 relative ";
    
    // Current month vs other months
    if (!isCurrentMonth) {
      baseClasses += "text-gray-400 ";
    } else {
      baseClasses += "text-black ";
    }
    
    // Today highlight
    if (isToday) {
      baseClasses += "ring-2 ring-blue-400 ";
    }
    
    // Completion status styling
    if (status.type === 'future' || !isCurrentMonth) {
      baseClasses += "hover:bg-gray-100 ";
    } else if (status.type === 'all-completed') {
      baseClasses += "bg-green-100 hover:bg-green-200 ";
    } else if (status.type === 'partial') {
      baseClasses += "bg-yellow-100 hover:bg-yellow-200 ";
    } else if (status.type === 'none' && status.totalCount > 0) {
      baseClasses += "bg-red-50 hover:bg-red-100 ";
    } else {
      baseClasses += "hover:bg-gray-100 ";
    }
    
    return baseClasses;
  };

  // Get the completion indicator (dot or emoji)
  const getCompletionIndicator = (status) => {
    if (status.type === 'future' || status.totalCount === 0) {
      return null;
    }
    
    if (status.type === 'all-completed') {
      return (
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      );
    } else if (status.type === 'partial') {
      return (
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        </div>
      );
    } else if (status.type === 'none') {
      return (
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      );
    }
    
    return null;
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-semibold text-black">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const status = getDayStatus(date);
          const dayStyles = getDayStyles(date, status);
          
          return (
            <button
              key={index}
              onClick={() => onDayClick(date)}
              className={dayStyles}
              title={`${date.toLocaleDateString()} - ${status.completedCount}/${status.totalCount} habits completed`}
            >
              <span>{date.getDate()}</span>
              {getCompletionIndicator(status)}
            </button>
          );
        })}
      </div>
    </div>
  );
}