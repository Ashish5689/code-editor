'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const { user } = useAuth();
  const [theme, setTheme] = useState('vs-dark');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Profile updated successfully');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset email sent. Please check your inbox.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    }
  };

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${theme === 'vs-dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${theme === 'vs-dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <Link href="/dashboard" className={`flex items-center text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500 mr-4`}>
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className={`text-2xl font-bold ${theme === 'vs-dark' ? 'text-white' : 'text-gray-900'}`}>
              Your Profile
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            {message && (
              <div className={`mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded ${theme === 'vs-dark' ? 'bg-opacity-20' : ''}`}>
                {message}
              </div>
            )}
            
            {error && (
              <div className={`mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded ${theme === 'vs-dark' ? 'bg-opacity-20' : ''}`}>
                {error}
              </div>
            )}
            
            <div className={`rounded-lg shadow-md p-6 mb-6 ${theme === 'vs-dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h2 className="text-xl font-medium mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <p className={`text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className={`text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-500'}`}>User ID</p>
                  <p className="font-medium">{user?.id}</p>
                </div>
                <div>
                  <p className={`text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-500'}`}>Last Sign In</p>
                  <p className="font-medium">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className={`rounded-lg shadow-md p-6 mb-6 ${theme === 'vs-dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h2 className="text-xl font-medium mb-4">Update Profile</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className={`block text-sm font-medium ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`block w-full px-3 py-2 border ${theme === 'vs-dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="John Doe"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
            
            <div className={`rounded-lg shadow-md p-6 ${theme === 'vs-dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h2 className="text-xl font-medium mb-4">Security</h2>
              <div className="space-y-4">
                <div>
                  <p className={`text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Password</p>
                  <button
                    onClick={handleUpdatePassword}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
