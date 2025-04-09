'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserCircleIcon, ArrowRightOnRectangleIcon, HomeIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

export default function Navigation({ theme }: { theme: string }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={`${theme === 'vs-dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <CodeBracketIcon className={`h-8 w-8 ${theme === 'vs-dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`ml-2 text-xl font-bold ${theme === 'vs-dark' ? 'text-white' : 'text-gray-900'}`}>
                  CodeSurfer
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? `${theme === 'vs-dark' ? 'border-blue-400 text-white' : 'border-blue-500 text-gray-900'}`
                    : `${theme === 'vs-dark' ? 'border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                }`}
              >
                <HomeIcon className="h-5 w-5 mr-1" />
                Home
              </Link>
              
              {user && (
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/dashboard'
                      ? `${theme === 'vs-dark' ? 'border-blue-400 text-white' : 'border-blue-500 text-gray-900'}`
                      : `${theme === 'vs-dark' ? 'border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                    theme === 'vs-dark'
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  Profile
                </Link>
                
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                    theme === 'vs-dark'
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </Link>
                
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                theme === 'vs-dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className={`pt-2 pb-3 space-y-1 ${theme === 'vs-dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/'
                  ? `${theme === 'vs-dark' ? 'bg-gray-900 border-blue-400 text-white' : 'bg-blue-50 border-blue-500 text-blue-700'}`
                  : `${theme === 'vs-dark' ? 'border-transparent text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-300' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300'}`
              }`}
            >
              Home
            </Link>
            
            {user && (
              <Link
                href="/dashboard"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname === '/dashboard'
                    ? `${theme === 'vs-dark' ? 'bg-gray-900 border-blue-400 text-white' : 'bg-blue-50 border-blue-500 text-blue-700'}`
                    : `${theme === 'vs-dark' ? 'border-transparent text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-300' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300'}`
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>
          
          {user ? (
            <div className={`pt-4 pb-3 border-t ${theme === 'vs-dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserCircleIcon className={`h-10 w-10 ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div className="ml-3">
                  <div className={`text-base font-medium ${theme === 'vs-dark' ? 'text-white' : 'text-gray-800'}`}>
                    {user.email?.split('@')[0]}
                  </div>
                  <div className={`text-sm font-medium ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/profile"
                  className={`block px-4 py-2 text-base font-medium ${
                    theme === 'vs-dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Your Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className={`block w-full text-left px-4 py-2 text-base font-medium ${
                    theme === 'vs-dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className={`pt-4 pb-3 border-t ${theme === 'vs-dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="space-y-1">
                <Link
                  href="/auth/signin"
                  className={`block px-4 py-2 text-base font-medium ${
                    theme === 'vs-dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className={`block px-4 py-2 text-base font-medium ${
                    theme === 'vs-dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
