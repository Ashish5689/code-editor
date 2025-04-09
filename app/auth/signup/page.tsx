'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [theme, setTheme] = useState('vs-dark');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error, data } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Redirect to a confirmation page or show a success message
        router.push('/auth/verify-email?email=' + encodeURIComponent(email));
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
              Create Account
            </h1>
            <p className={`mt-2 ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Join CodeSurfer and start coding
            </p>
          </div>
          
          {error && (
            <div className={`mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded ${theme === 'vs-dark' ? 'bg-opacity-20' : ''}`}>
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className={`block text-sm font-medium ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${theme === 'vs-dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="John Doe"
                required
              />
            </div>
            
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
              <label htmlFor="password" className={`block text-sm font-medium ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${theme === 'vs-dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="••••••••"
                required
              />
              <p className={`mt-1 text-xs ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Must be at least 8 characters with 1 uppercase, 1 number, and 1 special character
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${theme === 'vs-dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${theme === 'vs-dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${theme === 'vs-dark' ? 'bg-gray-900' : 'bg-white'} ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                  Or sign up with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${theme === 'vs-dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
                </svg>
              </button>
              
              <button
                type="button"
                className={`w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${theme === 'vs-dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <p className={`mt-8 text-center text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
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
