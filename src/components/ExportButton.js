'use client';

import { useState } from 'react';

export default function ExportButton({ habits }) {
    const [isExporting, setIsExporting] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    // Generate CSV content for habits summary
    const generateHabitsCSV = () => {
        const headers = [
            'Habit Name',
            'Category',
            'Description',
            'Current Streak',
            'Longest Streak',
            'Status',
            'Created Date'
        ];

        const rows = habits.map(habit => [
            habit.title,
            habit.category || '',
            habit.description || '',
            habit.current_streak || 0,
            habit.longest_streak || 0,
            habit.is_active ? 'Active' : 'Archived',
            new Date(habit.created_at).toLocaleDateString()
        ]);

        return [headers, ...rows];
    };

    // Generate CSV content for completion logs
    const generateLogsCSV = () => {
        const headers = [
            'Date',
            'Habit Name',
            'Category',
            'Completed',
            'Notes'
        ];

        const rows = [];

        // Get all unique dates from recent completions
        const allDates = new Set();
        habits.forEach(habit => {
            habit.recent_completions?.forEach(log => {
                allDates.add(log.completed_date);
            });
        });

        // Sort dates
        const sortedDates = Array.from(allDates).sort().reverse();

        // Generate rows for each date and habit combination
        sortedDates.forEach(date => {
            habits.forEach(habit => {
                const log = habit.recent_completions?.find(l => l.completed_date === date);
                const isCompleted = !!log;

                rows.push([
                    date,
                    habit.title,
                    habit.category || '',
                    isCompleted ? 'Yes' : 'No',
                    log?.notes || ''
                ]);
            });
        });

        return [headers, ...rows];
    };

    // Generate CSV content for detailed logs (only completed entries)
    const generateDetailedLogsCSV = () => {
        const headers = [
            'Date',
            'Habit Name',
            'Category',
            'Notes',
            'Streak at Time'
        ];

        const rows = [];

        habits.forEach(habit => {
            habit.recent_completions?.forEach(log => {
                rows.push([
                    log.completed_date,
                    habit.title,
                    habit.category || '',
                    log.notes || '',
                    '' // We don't have historical streak data, but could be added
                ]);
            });
        });

        // Sort by date (newest first)
        rows.sort((a, b) => new Date(b[0]) - new Date(a[0]));

        return [headers, ...rows];
    };

    // Convert array data to CSV string
    const arrayToCSV = (data) => {
        return data.map(row =>
            row.map(field => {
                // Escape quotes and wrap in quotes if contains comma, quote, or newline
                const stringField = String(field);
                if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                    return `"${stringField.replace(/"/g, '""')}"`;
                }
                return stringField;
            }).join(',')
        ).join('\n');
    };

    // Download CSV file
    const downloadCSV = (csvContent, filename) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Handle export
    const handleExport = async (type) => {
        setIsExporting(true);
        setShowOptions(false);

        try {
            let csvData, filename;
            const timestamp = new Date().toISOString().split('T')[0];

            switch (type) {
                case 'habits':
                    csvData = generateHabitsCSV();
                    filename = `habits-summary-${timestamp}.csv`;
                    break;
                case 'logs':
                    csvData = generateLogsCSV();
                    filename = `habits-logs-${timestamp}.csv`;
                    break;
                case 'detailed':
                    csvData = generateDetailedLogsCSV();
                    filename = `habits-detailed-logs-${timestamp}.csv`;
                    break;
                default:
                    return;
            }

            const csvContent = arrayToCSV(csvData);
            downloadCSV(csvContent, filename);

        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    if (habits.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowOptions(!showOptions)}
                disabled={isExporting}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 border border-primary-300 hover:border-primary-400 rounded-md transition-colors disabled:opacity-50"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>

            {showOptions && (
                <div className="absolute top-0 left-full ml-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm font-medium text-black border-b border-gray-200">
                            Export Options
                        </div>

                        <button
                            onClick={() => handleExport('habits')}
                            className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                            <div className="font-medium">Habits Summary</div>
                            <div className="text-xs text-gray-600">Basic habit info and streaks</div>
                        </button>

                        <button
                            onClick={() => handleExport('logs')}
                            className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                            <div className="font-medium">Complete Logs</div>
                            <div className="text-xs text-gray-600">All dates with completion status</div>
                        </button>

                        <button
                            onClick={() => handleExport('detailed')}
                            className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                            <div className="font-medium">Detailed Logs</div>
                            <div className="text-xs text-gray-600">Only completed entries with notes</div>
                        </button>
                    </div>
                </div>
            )}

            {/* Overlay to close dropdown */}
            {showOptions && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowOptions(false)}
                />
            )}
        </div>
    );
}