'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserCircleIcon, ArrowRightOnRectangleIcon, HomeIcon, CodeBracketIcon, Squares2X2Icon, BeakerIcon } from '@heroicons/react/24/outline';

export default function Navigation({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-opacity-80" style={{ background: 'var(--header-bg)' }}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link 
            href="/"
            className="flex items-center cursor-pointer" 
            role="button"
            tabIndex={0}
            aria-label="Go to home page"
          >
            <CodeBracketIcon className="h-6 w-6 text-blue-500 mr-2" />
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              CodeSurfer
            </div>
          </Link>
          <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-1 rounded-full text-white">Beta</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className={`text-sm hover:text-blue-400 transition-colors flex items-center ${
              pathname === '/' ? 'text-blue-400' : ''
            }`}
          >
            <HomeIcon className="h-4 w-4 mr-1" />
            Home
          </Link>
          
          <Link 
            href="/dashboard" 
            className={`text-sm hover:text-blue-400 transition-colors flex items-center ${
              pathname === '/dashboard' ? 'text-blue-400' : ''
            }`}
          >
            <Squares2X2Icon className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          
          <Link 
            href="/code" 
            className={`text-sm hover:text-blue-400 transition-colors flex items-center ${
              pathname === '/code' || pathname.startsWith('/code/') ? 'text-blue-400' : ''
            }`}
          >
            <CodeBracketIcon className="h-4 w-4 mr-1" />
            Code
          </Link>
          
          <Link 
            href="/frontend" 
            className={`text-sm hover:text-blue-400 transition-colors flex items-center ${
              pathname === '/frontend' || pathname.startsWith('/frontend/') ? 'text-blue-400' : ''
            }`}
          >
            <BeakerIcon className="h-4 w-4 mr-1" />
            Frontend
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Theme toggle button removed */}
          
          {user ? (
            <div className="flex items-center space-x-2">
              <Link href="/profile" className="hidden sm:flex items-center text-sm hover:text-blue-400 transition-colors">
                <UserCircleIcon className="h-5 w-5 mr-1" />
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="hidden sm:flex items-center bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-all"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" className="hidden sm:block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-all">
              Sign In
            </Link>
          )}
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <HomeIcon className="h-5 w-5 inline mr-1" />
              Home
            </Link>
            
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/dashboard'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Squares2X2Icon className="h-5 w-5 inline mr-1" />
              Dashboard
            </Link>
            
            <Link
              href="/code"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/code' || pathname.startsWith('/code/')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <CodeBracketIcon className="h-5 w-5 inline mr-1" />
              Code
            </Link>
            
            <Link
              href="/frontend"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/frontend' || pathname.startsWith('/frontend/')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <BeakerIcon className="h-5 w-5 inline mr-1" />
              Frontend
            </Link>
          </div>
          
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user.email?.split('@')[0]}</div>
                  <div className="text-sm font-medium text-gray-400">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="px-2 space-y-1">
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
