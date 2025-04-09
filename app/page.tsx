'use client';

import { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputConsole from './components/OutputConsole';
import LanguageSelector from './components/LanguageSelector';
import { SUPPORTED_LANGUAGES, getDefaultCode } from './utils/codeTemplates';
import { executeCode } from './services/codeExecutionService';
import { PlayIcon, DocumentDuplicateIcon, ArrowPathIcon, ArrowDownTrayIcon, CodeBracketIcon, BeakerIcon } from '@heroicons/react/24/solid';
import { SunIcon, MoonIcon, ChevronRightIcon, CheckCircleIcon, CommandLineIcon, CubeIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function Home({ initialShowEditor = false }: { initialShowEditor?: boolean }) {
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [editorTheme, setEditorTheme] = useState<string>('vs-dark');
  const [stdin, setStdin] = useState<string>('');
  const [showStdin, setShowStdin] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(initialShowEditor);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Set default code when language changes or component mounts
  useEffect(() => {
    setCode(getDefaultCode(selectedLanguage.id));
  }, [selectedLanguage]);

  // Redirect to /code if showEditor is true
  useEffect(() => {
    if (showEditor && pathname === '/') {
      router.push('/code');
    }
  }, [showEditor, router, pathname]);

  const handleLanguageChange = (language: typeof SUPPORTED_LANGUAGES[0]) => {
    setSelectedLanguage(language);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput('');
    
    try {
      const result = await executeCode(code, selectedLanguage.id);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleResetCode = () => {
    setCode(getDefaultCode(selectedLanguage.id));
    setOutput('');
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${selectedLanguage.extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleTheme = () => {
    setEditorTheme(editorTheme === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };

  const startCoding = () => {
    router.push('/code');
  };

  const goToLandingPage = () => {
    router.push('/');
  };

  // Only render the landing page on the home route
  if (pathname === '/') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <main className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center text-center mb-20">
            <div className="mb-6 animate-float">
              <CodeBracketIcon className="h-20 w-20 text-blue-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Code<span className="text-blue-400">Surfer</span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-3xl mb-8 text-gray-200">
              A modern, all-in-one development platform for code execution and frontend design
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                href="/code"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg transition-colors flex items-center justify-center"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Coding
              </Link>
              
              <Link 
                href="/frontend"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-lg transition-colors flex items-center justify-center"
              >
                <BeakerIcon className="h-5 w-5 mr-2" />
                Frontend Playground
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <span className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                Multi-language
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              <span className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                Real-time execution
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              <span className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                Frontend tools
              </span>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Powerful Features
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-blue-500 transition-all hover:shadow-blue-900/20 hover:shadow-lg">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <CommandLineIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Code Execution</h3>
                <p className="text-gray-300">
                  Write and execute code in multiple programming languages with real-time output. Perfect for testing algorithms and solving coding challenges.
                </p>
                <Link 
                  href="/code"
                  className="mt-4 text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium"
                >
                  Try it now <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-purple-500 transition-all hover:shadow-purple-900/20 hover:shadow-lg">
                <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BeakerIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Frontend Playground</h3>
                <p className="text-gray-300">
                  Design and build web interfaces with our interactive HTML, CSS, and JavaScript editor. See your changes in real-time with live preview.
                </p>
                <Link 
                  href="/frontend"
                  className="mt-4 text-purple-400 hover:text-purple-300 flex items-center text-sm font-medium"
                >
                  Explore frontend tools <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-green-500 transition-all hover:shadow-green-900/20 hover:shadow-lg">
                <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <PuzzlePieceIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Developer Tools</h3>
                <p className="text-gray-300">
                  Access a suite of developer tools including code formatting, syntax highlighting, and file management to streamline your workflow.
                </p>
                <Link 
                  href="/dashboard"
                  className="mt-4 text-green-400 hover:text-green-300 flex items-center text-sm font-medium"
                >
                  View dashboard <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Code + Frontend Preview Section */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Powerful Code Editor
                  </span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Our advanced code editor supports multiple programming languages with syntax highlighting, auto-completion, and error detection. Write, test, and debug your code all in one place.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Support for 10+ programming languages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Real-time code execution</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Syntax highlighting and auto-completion</span>
                  </li>
                </ul>
                <Link 
                  href="/code"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg transition-colors flex items-center"
                >
                  Start coding now <ChevronRightIcon className="h-5 w-5 ml-1" />
                </Link>
              </div>
              
              <div className="bg-gray-800 bg-opacity-70 p-4 rounded-xl shadow-xl border border-gray-700">
                <div className="bg-gray-900 rounded-t-lg p-2 flex items-center border-b border-gray-700">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-xs text-gray-400">code-editor.py</div>
                </div>
                <div className="p-4 font-mono text-sm text-gray-300 overflow-hidden">
                  <pre className="language-python">
                    <code>
{`def fibonacci(n):
    """Generate Fibonacci sequence up to n"""
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

# Generate first 10 Fibonacci numbers
fib_sequence = fibonacci(100)
print(f"Fibonacci sequence: {fib_sequence}")

# Calculate sum of the sequence
total = sum(fib_sequence)
print(f"Sum of sequence: {total}")
`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
          
          {/* Frontend Section */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gray-800 bg-opacity-70 p-4 rounded-xl shadow-xl border border-gray-700">
                  <div className="bg-gray-900 rounded-t-lg p-2 flex items-center border-b border-gray-700">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-xs text-gray-400">frontend-editor.html</div>
                  </div>
                  <div className="p-4 font-mono text-sm text-gray-300 overflow-hidden">
                    <pre className="language-html">
                      <code>
{`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      margin: 0;
      padding: 20px;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Frontend Playground</h1>
    <p>Design beautiful interfaces with HTML, CSS, and JavaScript</p>
  </div>
</body>
</html>`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                    Frontend Development
                  </span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Build stunning web interfaces with our frontend playground. Edit HTML, CSS, and JavaScript with instant preview to see your changes in real-time.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <span>Interactive HTML, CSS, and JavaScript editor</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <span>Real-time preview of your designs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <span>Export and share your frontend projects</span>
                  </li>
                </ul>
                <Link 
                  href="/frontend"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-lg transition-colors flex items-center inline-flex"
                >
                  Try frontend playground <ChevronRightIcon className="h-5 w-5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 md:p-12 shadow-xl border border-blue-800">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to start coding?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who use CodeSurfer to build amazing projects. Sign up for free and start coding today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link 
                    href="/code"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg transition-colors"
                  >
                    Start Coding Now
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/auth/signin"
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth/signup"
                      className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md shadow-lg transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
        
        <footer className="py-8 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <CodeBracketIcon className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  CodeSurfer
                </span>
              </div>
              
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  About
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
              <p> {new Date().getFullYear()} CodeSurfer | Built with Next.js and Monaco Editor</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // If we're not on the home route, redirect to the appropriate page
  useEffect(() => {
    if (pathname === '/') {
      // We're already handling this case above
    } else if (pathname !== '/code') {
      // If we're not on the home or code route, don't render anything
      // The appropriate page component will handle the rendering
    } else {
      // If we're on the code route, redirect to the dedicated code page
      router.push('/code');
    }
  }, [pathname, router]);

  // Return null while redirecting or if we're not on the home route
  return null;
}
