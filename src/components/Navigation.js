'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Today', href: '/today' },
  { name: 'Habits', href: '/habits' },
  { name: 'Notes', href: '/notes' },
  { name: 'Share', href: '/share' },
  { name: 'Profile', href: '/profile' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <nav className="page-header sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-xl font-bold text-primary-700 dark:text-primary-400">
              Habits
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-tab ${pathname === item.href ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost px-3 py-2"
              aria-label="Toggle theme"
            >
              Theme
            </button>
            
            <div className="flex items-center space-x-2">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn btn-ghost text-red-600 dark:text-red-400"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn btn-ghost px-3 py-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-slide-up">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-tab w-full justify-start ${pathname === item.href ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <button
                onClick={toggleTheme}
                className="btn btn-ghost w-full justify-start"
              >
                Theme
              </button>
              
              <div className="flex items-center space-x-3 px-4 py-2">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn btn-ghost w-full justify-start text-red-600 dark:text-red-400"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}