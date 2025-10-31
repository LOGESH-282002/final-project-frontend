'use client';

export default function QuickFilters({ habits, onQuickFilter }) {
  const today = new Date().toISOString().split('T')[0];
  
  const getStats = () => {
    const total = habits.filter(h => h.is_active).length;
    const completedToday = habits.filter(h => 
      h.is_active && h.recent_completions?.some(log => log.completed_date === today)
    ).length;
    const notCompleted = total - completedToday;
    const archived = habits.filter(h => !h.is_active).length;
    
    return { total, completedToday, notCompleted, archived };
  };

  const stats = getStats();

  const quickFilters = [
    {
      label: 'All Active',
      count: stats.total,
      filter: { completion: 'all', status: 'active' },
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    },
    {
      label: 'Completed Today',
      count: stats.completedToday,
      filter: { completion: 'completed', status: 'active' },
      color: 'bg-green-100 text-green-800 hover:bg-green-200'
    },
    {
      label: 'Not Completed',
      count: stats.notCompleted,
      filter: { completion: 'not-completed', status: 'active' },
      color: 'bg-red-100 text-red-800 hover:bg-red-200'
    },
    {
      label: 'Archived',
      count: stats.archived,
      filter: { completion: 'all', status: 'archived' },
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {quickFilters.map((item, index) => (
        <button
          key={index}
          onClick={() => onQuickFilter(item.filter)}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${item.color}
          `}
        >
          {item.label} ({item.count})
        </button>
      ))}
    </div>
  );
}