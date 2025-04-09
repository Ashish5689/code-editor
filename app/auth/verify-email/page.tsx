'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const [theme, setTheme] = useState('vs-dark');
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'vs-dark' ? 'gradient-animation' : 'bg-gray-50'} flex flex-col`}>
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md p-8 rounded-xl shadow-lg ${theme === 'vs-dark' ? 'glass-dark' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Verify Your Email
            </h1>
            <p className={`mt-2 ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              We've sent a verification link to your email
            </p>
          </div>
          
          <div className={`p-4 rounded-lg mb-6 ${theme === 'vs-dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
            <p className={`text-center ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              We've sent a verification email to:
              <span className="block font-medium mt-1 text-blue-500">{email}</span>
            </p>
          </div>
          
          <div className="space-y-4">
            <p className={`text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Please check your email and click on the verification link to complete your registration. If you don't see the email, check your spam folder.
            </p>
            
            <div className="border-t border-b py-4 my-4 space-y-4">
              <p className={`text-sm font-medium ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                What happens next?
              </p>
              <ul className={`list-disc pl-5 space-y-2 text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>Click the link in the email</li>
                <li>Your email will be verified</li>
                <li>You can then sign in to your account</li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link 
                href="/auth/signin" 
                className={`text-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${theme === 'vs-dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Go to Sign In
              </Link>
              
              <Link 
                href="/" 
                className={`text-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${theme === 'vs-dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
