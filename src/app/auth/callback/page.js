'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        
        if (error) {
          console.error('OAuth error:', error);
          router.push('/login?error=oauth_failed');
          return;
        }
        
        if (token) {
          // Set the token in storage
          authAPI.setTokenFromUrl(token);
          
          // Small delay to ensure token is set
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Check auth to update the context
          await checkAuth();
          
          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          // No token, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        router.push('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [searchParams, router, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}