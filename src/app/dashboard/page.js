'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      title: "Today's Focus",
      description: "Complete today's habits and see weekly progress",
      href: "/today"
    },
    {
      title: "Manage Habits",
      description: "Create and track your daily habits",
      href: "/habits"
    },
    {
      title: "Notes & Reflections",
      description: "Capture thoughts and insights",
      href: "/notes"
    },
    {
      title: "Share Progress",
      description: "Create shareable streak cards and stats",
      href: "/share"
    }
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="card mb-8">
            <div className="card-content">
              <div className="flex items-center space-x-4 mb-6">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-16 w-16 rounded-full"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ready to build great habits today?
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Member since:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="card hover:scale-105 transition-transform duration-200 group"
                >
                  <div className="card-content">
                  <div className="flex items-start space-x-0">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats Preview */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Quick Stats
              </h2>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    0
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Habits
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    0
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Completed Today
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    0
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current Streak
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}