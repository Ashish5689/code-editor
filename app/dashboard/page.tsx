'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useState('vs-dark');
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${theme === 'vs-dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${theme === 'vs-dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className={`text-2xl font-bold ${theme === 'vs-dark' ? 'text-white' : 'text-gray-900'}`}>
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white`}>
            <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
            <p>You're now signed in with Supabase authentication!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`rounded-lg shadow-md p-6 ${theme === 'vs-dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-lg font-medium mb-2">Your Profile</h3>
              <div className="flex items-center space-x-3 mb-4">
                <UserCircleIcon className="h-10 w-10 text-blue-500" />
                <div>
                  <p className="font-medium">{user?.email}</p>
                  <p className={`text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    User ID: {user?.id?.substring(0, 8)}...
                  </p>
                </div>
              </div>
              <Link 
                href="/profile" 
                className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
              >
                Edit Profile
                <ArrowRightOnRectangleIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className={`rounded-lg shadow-md p-6 ${theme === 'vs-dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-lg font-medium mb-2">Authentication Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-600'}>Status:</span>
                  <span className="text-green-500 font-medium">Authenticated</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-600'}>Provider:</span>
                  <span>Email</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-600'}>Last Sign In:</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>

            <div className={`rounded-lg shadow-md p-6 ${theme === 'vs-dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-lg font-medium mb-2">Next Steps</h3>
              <ul className={`list-disc pl-5 space-y-1 ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Complete your profile</li>
                <li>Set up two-factor authentication</li>
                <li>Explore the application features</li>
                <li>Customize your settings</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
