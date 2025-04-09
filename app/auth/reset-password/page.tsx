'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('vs-dark');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for the password reset link');
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'vs-dark' ? 'gradient-animation' : 'bg-gray-50'} flex flex-col`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md p-8 rounded-xl shadow-lg ${theme === 'vs-dark' ? 'glass-dark' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className={`mt-2 ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Enter your email to receive a reset link
            </p>
          </div>
          
          {error && (
            <div className={`mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded ${theme === 'vs-dark' ? 'bg-opacity-20' : ''}`}>
              {error}
            </div>
          )}
          
          {message && (
            <div className={`mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded ${theme === 'vs-dark' ? 'bg-opacity-20' : ''}`}>
              {message}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${theme === 'vs-dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
          
          <p className={`mt-8 text-center text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Remember your password?{' '}
            <Link href="/auth/signin" className="font-medium text-blue-500 hover:text-blue-400">
              Sign in
            </Link>
          </p>
          
          <div className="mt-6 flex justify-center">
            <Link href="/" className={`flex items-center text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}>
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
