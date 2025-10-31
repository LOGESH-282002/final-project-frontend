'use client';

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { CheckCircleIcon, CalendarIcon, ChartBarIcon, ShareIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: CheckCircleIcon,
      title: "Track Daily Habits",
      description: "Create and monitor your daily, weekly, or monthly habits with customizable targets and progress tracking."
    },
    {
      icon: CalendarIcon,
      title: "Calendar View",
      description: "Visualize your habit completion history with an intuitive calendar interface and streak tracking."
    },
    {
      icon: ChartBarIcon,
      title: "Progress Analytics",
      description: "Get insights into your habit patterns with detailed statistics, charts, and completion rates."
    },
    {
      icon: ShareIcon,
      title: "Share Progress",
      description: "Share your habit achievements and progress with friends to stay motivated and accountable."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-50">
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Habits
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Features
                </Link>
                <Link href="#about" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  About
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {loading ? (
                  <div className="text-sm">Loading...</div>
                ) : user ? (
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="w-6 h-6" />
                  ) : (
                    <Bars3Icon className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
                <div className="space-y-4">
                  <Link
                    href="#features"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-4 py-2 transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-4 py-2 transition-colors"
                  >
                    About
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-4 py-2 transition-colors"
                  >
                    <span>{theme === 'light' ? '🌙' : '☀️'}</span>
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    {loading ? (
                      <div className="px-4 py-2 text-sm">Loading...</div>
                    ) : user ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold mx-4"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-4 py-2 transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold mx-4"
                        >
                          Get Started
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Build Better
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600"> Habits</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your life one habit at a time. Track, analyze, and share your progress with our intuitive habit tracking platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : user ? (
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/login"
                    className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full text-lg font-semibold hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to help you build lasting habits and achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-shadow duration-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="about" className="py-20 bg-gradient-to-r from-orange-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join thousands building better habits
            </h2>
            <p className="text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
              Start your journey today and see the difference consistent habits can make.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-orange-100">Habits Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">85%</div>
                <div className="text-orange-100">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">30 Days</div>
                <div className="text-orange-100">Average Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to transform your life?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Start building better habits today. It's free to get started.
          </p>
          
          {!user && (
            <Link
              href="/register"
              className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
            >
              Start Your Journey
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
