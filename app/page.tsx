'use client';

import { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputConsole from './components/OutputConsole';
import LanguageSelector from './components/LanguageSelector';
import { SUPPORTED_LANGUAGES, getDefaultCode } from './utils/codeTemplates';
import { executeCode } from './services/codeExecutionService';
import { PlayIcon, DocumentDuplicateIcon, ArrowPathIcon, ArrowDownTrayIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

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

  // Set default code when language changes or component mounts
  useEffect(() => {
    setCode(getDefaultCode(selectedLanguage.id));
  }, [selectedLanguage]);

  // Save editor state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showEditor', showEditor.toString());
    }
  }, [showEditor]);

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
    setShowEditor(true);
  };

  const goToLandingPage = () => {
    setShowEditor(false);
  };

  if (!showEditor) {
    return (
      <div className="min-h-screen gradient-animation text-white">
        {/* Navigation component removed as it's now in the root layout */}
        
        <main className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-8 animate-bounce">
              <CodeBracketIcon className="h-16 w-16 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Code. Create. <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">Innovate.</span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-200">
              A modern, multi-language code editor and compiler with real-time execution. Write, test, and share your code instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button 
                onClick={startCoding}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg transition-colors"
              >
                Start Coding Now
              </button>
              {user ? (
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-md shadow-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => window.location.href = '/auth/signin'}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-md shadow-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Write Code</h3>
                <p className="text-gray-300 text-center">
                  Write code in multiple programming languages with syntax highlighting and intelligent code completion.
                </p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Execute Code</h3>
                <p className="text-gray-300 text-center">
                  Run your code instantly in the cloud with real-time output and error handling.
                </p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Share & Save</h3>
                <p className="text-gray-300 text-center">
                  Save your code snippets to your account and share them with others easily.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="py-4 text-center bg-gray-800 text-gray-300 mt-16">
          <div className="container mx-auto">
            <p> {new Date().getFullYear()} CodeSurfer | Built with Next.js and Monaco Editor</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${editorTheme === 'vs-dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header removed as it's now in the root layout via NavigationWrapper */}
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4 mb-4">
          {/* Editor Controls - Improved layout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:w-64">
              <LanguageSelector
                languages={SUPPORTED_LANGUAGES}
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <PlayIcon className="h-5 w-5" />
                <span>Run</span>
              </button>
              
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
              >
                <DocumentDuplicateIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Copy</span>
              </button>
              
              <button
                onClick={handleResetCode}
                className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              
              <button
                onClick={handleDownloadCode}
                className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Download</span>
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors shadow-md"
                title={editorTheme === 'vs-dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
              >
                {editorTheme === 'vs-dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
          <div className="h-full overflow-hidden">
            <CodeEditor
              language={selectedLanguage.value}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={editorTheme}
            />
          </div>
          
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0">
              <OutputConsole output={output} isLoading={isExecuting} />
            </div>
            
            {showStdin && (
              <div className="mt-4 max-h-[30%]">
                <div className="bg-gray-800/50 px-4 py-2 font-medium rounded-t-md border-t border-l border-r border-gray-700/30">
                  Standard Input
                </div>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  className="w-full h-32 bg-gray-900/60 text-white font-mono p-4 rounded-b-md resize-none border-b border-l border-r border-gray-700/30"
                  placeholder="Enter input for your program here..."
                />
              </div>
            )}
            
            <button
              onClick={() => setShowStdin(!showStdin)}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors self-start"
            >
              {showStdin ? 'Hide stdin' : 'Show stdin'}
            </button>
          </div>
        </div>
      </main>
      
      <footer className={`py-4 text-center ${editorTheme === 'vs-dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
        <div className="container mx-auto">
          <p> {new Date().getFullYear()} CodeSurfer | Built with Next.js and Monaco Editor</p>
        </div>
      </footer>
    </div>
  );
}
