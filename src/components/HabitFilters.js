'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const HabitFilters = forwardRef(({ habits, onFiltersChange }, ref) => {
  const [filters, setFilters] = useState({
    completion: 'all', // all, completed, not-completed
    category: 'all', // all, or specific category
    status: 'active', // active, archived, all
    sortBy: 'name', // name, streak, created
    sortOrder: 'asc' // asc, desc
  });

  const [availableCategories, setAvailableCategories] = useState([]);

  // Extract unique categories from habits
  useEffect(() => {
    const categories = [...new Set(
      habits
        .filter(habit => habit.category && habit.category.trim())
        .map(habit => habit.category.trim())
    )].sort();
    setAvailableCategories(categories);
  }, [habits]);

  // Apply filters and sorting whenever filters change
  useEffect(() => {
    const filteredAndSorted = applyFiltersAndSort(habits, filters);
    onFiltersChange(filteredAndSorted, filters);
  }, [habits, filters, onFiltersChange]);

  const applyFiltersAndSort = (habitsList, currentFilters) => {
    let filtered = [...habitsList];

    // Filter by completion status (today)
    if (currentFilters.completion !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(habit => {
        const isCompletedToday = habit.recent_completions?.some(
          log => log.completed_date === today
        );
        return currentFilters.completion === 'completed' ? isCompletedToday : !isCompletedToday;
      });
    }

    // Filter by category
    if (currentFilters.category !== 'all') {
      filtered = filtered.filter(habit => 
        habit.category === currentFilters.category
      );
    }

    // Filter by status (active/archived)
    if (currentFilters.status !== 'all') {
      filtered = filtered.filter(habit => 
        currentFilters.status === 'active' ? habit.is_active : !habit.is_active
      );
    }

    // Sort habits
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (currentFilters.sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'streak':
          comparison = (b.current_streak || 0) - (a.current_streak || 0);
          break;
        case 'created':
          comparison = new Date(b.created_at) - new Date(a.created_at);
          break;
        default:
          comparison = 0;
      }

      return currentFilters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleFilterChange,
    resetFilters,
    setFilters
  }));

  const resetFilters = () => {
    setFilters({
      completion: 'all',
      category: 'all',
      status: 'active',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.completion !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.status !== 'active') count++; // active is default
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Completion Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-black mb-1">Today's Status</label>
            <select
              value={filters.completion}
              onChange={(e) => handleFilterChange('completion', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Habits</option>
              <option value="completed">Completed Today</option>
              <option value="not-completed">Not Completed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-black mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-black mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-black mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name (A-Z)</option>
              <option value="streak">Current Streak</option>
              <option value="created">Recently Created</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-black mb-1">Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">
                {filters.sortBy === 'name' ? 'A → Z' : 
                 filters.sortBy === 'streak' ? 'Low → High' : 
                 'Oldest → Newest'}
              </option>
              <option value="desc">
                {filters.sortBy === 'name' ? 'Z → A' : 
                 filters.sortBy === 'streak' ? 'High → Low' : 
                 'Newest → Oldest'}
              </option>
            </select>
          </div>

          {/* Reset Button */}
          {getActiveFilterCount() > 0 && (
            <div className="flex flex-col justify-end">
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 hover:border-blue-400 rounded-md transition-colors"
              >
                Reset ({getActiveFilterCount()})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-black">Active filters:</span>
            {filters.completion !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {filters.completion === 'completed' ? 'Completed Today' : 'Not Completed Today'}
                <button
                  onClick={() => handleFilterChange('completion', 'all')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {filters.category}
                <button
                  onClick={() => handleFilterChange('category', 'all')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status !== 'active' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {filters.status === 'archived' ? 'Archived' : 'All Status'}
                <button
                  onClick={() => handleFilterChange('status', 'active')}
                  className="ml-1 text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

HabitFilters.displayName = 'HabitFilters';

export default HabitFilters;