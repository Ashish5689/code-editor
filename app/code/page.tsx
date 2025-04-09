'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CodeEditor from '../components/CodeEditor';
import OutputConsole from '../components/OutputConsole';
import LanguageSelector from '../components/LanguageSelector';
import { SUPPORTED_LANGUAGES, getDefaultCode } from '../utils/codeTemplates';
import { executeCode } from '../services/codeExecutionService';
import { PlayIcon, DocumentDuplicateIcon, ArrowPathIcon, ArrowDownTrayIcon, CodeBracketIcon, CommandLineIcon } from '@heroicons/react/24/solid';
import { SunIcon, MoonIcon, LightBulbIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function CodePage() {
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [editorTheme, setEditorTheme] = useState<string>('vs-dark');
  const [stdin, setStdin] = useState<string>('');
  const [showStdin, setShowStdin] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [isLoadingWasm, setIsLoadingWasm] = useState<boolean>(false);
  const router = useRouter();

  // Set default code when language changes or component mounts
  useEffect(() => {
    setCode(getDefaultCode(selectedLanguage.id));
  }, [selectedLanguage]);

  const handleLanguageChange = (language: typeof SUPPORTED_LANGUAGES[0]) => {
    setSelectedLanguage(language);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput('');
    const startTime = performance.now();
    
    try {
      // Show loading message for WebAssembly-based languages that might need extra loading time
      if (['python', 'c', 'cpp', 'java', 'ruby'].includes(selectedLanguage.id)) {
        setOutput('Preparing execution environment...');
        setIsLoadingWasm(true);
      }
      
      const result = await executeCode(code, selectedLanguage.id, stdin);
      setOutput(result);
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setExecutionTime(null);
    } finally {
      setIsExecuting(false);
      setIsLoadingWasm(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    // Show a toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out';
    toast.textContent = 'Code copied to clipboard!';
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get language-specific tips
  const getLanguageTips = () => {
    const tips = {
      javascript: [
        "Use console.log() for debugging",
        "Try using arrow functions for cleaner code",
        "Remember to handle promises with async/await"
      ],
      python: [
        "Use list comprehensions for concise code",
        "Remember indentation is important",
        "Try f-strings for string formatting"
      ],
      java: [
        "Don't forget to include a main method",
        "Use System.out.println() for output",
        "Classes should match filename"
      ],
      cpp: [
        "Include iostream for input/output",
        "Remember to use std namespace",
        "Use cout for output"
      ]
    };
    
    return tips[selectedLanguage.id as keyof typeof tips] || [
      "Write clean, readable code",
      "Add comments to explain complex logic",
      "Test your code with different inputs"
    ];
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${editorTheme === 'vs-dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-100 to-white'}`}>
      <main className={`container mx-auto px-4 py-6 ${isFullscreen ? 'max-w-none' : ''}`}>
        {/* Header with title and language selector */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <CodeBracketIcon className={`h-8 w-8 ${editorTheme === 'vs-dark' ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
            <h1 className={`text-2xl font-bold ${editorTheme === 'vs-dark' ? 'text-white' : 'text-gray-800'}`}>
              Code<span className="text-blue-500">Surfer</span> Editor
            </h1>
            <div className="ml-4">
              <LanguageSelector
                languages={SUPPORTED_LANGUAGES}
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTips(!showTips)}
              className={`p-2 rounded-full ${editorTheme === 'vs-dark' ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-yellow-600 hover:bg-gray-300'} transition-colors`}
              title="Show Tips"
            >
              <LightBulbIcon className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className={`p-2 rounded-full ${editorTheme === 'vs-dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} transition-colors`}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="h-5 w-5" />
              ) : (
                <ArrowsPointingOutIcon className="h-5 w-5" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full ${editorTheme === 'vs-dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} transition-colors`}
              title={editorTheme === 'vs-dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {editorTheme === 'vs-dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Tips panel */}
        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 rounded-xl overflow-hidden ${editorTheme === 'vs-dark' ? 'bg-yellow-900/30 border border-yellow-800/50' : 'bg-yellow-50 border border-yellow-200'} shadow-lg`}
            >
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <LightBulbIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  <h3 className={`text-lg font-medium ${editorTheme === 'vs-dark' ? 'text-yellow-100' : 'text-yellow-800'}`}>
                    Tips for {selectedLanguage.name}
                  </h3>
                </div>
                <ul className={`list-disc pl-5 ${editorTheme === 'vs-dark' ? 'text-yellow-100/80' : 'text-yellow-700'}`}>
                  {getLanguageTips().map((tip, index) => (
                    <li key={index} className="mb-1">{tip}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main editor and output area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
          {/* Code editor section */}
          <div className={`h-full flex flex-col rounded-xl overflow-hidden ${editorTheme === 'vs-dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-300'} shadow-lg transition-all`}>
            <div className={`flex items-center justify-between px-4 py-2 ${editorTheme === 'vs-dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-300'}`}>
              <div className="flex items-center">
                <CodeBracketIcon className="h-4 w-4 text-blue-500 mr-2" />
                <span className={`text-sm font-medium ${editorTheme === 'vs-dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  {selectedLanguage.name} Code
                </span>
              </div>
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                language={selectedLanguage.value}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme={editorTheme}
              />
            </div>
            <div className="flex justify-between p-2 border-t border-gray-700">
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-md transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Run</span>
                </motion.button>
              </div>
              
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
                >
                  <DocumentDuplicateIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Copy</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetCode}
                  className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Reset</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadCode}
                  className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Download</span>
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Output console section */}
          <div className={`h-full flex flex-col rounded-xl overflow-hidden ${editorTheme === 'vs-dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-300'} shadow-lg transition-all`}>
            <div className={`flex items-center justify-between px-4 py-2 ${editorTheme === 'vs-dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-300'}`}>
              <div className="flex items-center">
                <CommandLineIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className={`text-sm font-medium ${editorTheme === 'vs-dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Console Output
                </span>
              </div>
              {executionTime !== null && (
                <span className={`text-xs ${editorTheme === 'vs-dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Execution time: {executionTime.toFixed(2)}ms
                </span>
              )}
            </div>
            <div className="flex-1 min-h-0">
              <OutputConsole 
                output={output} 
                isLoading={isExecuting} 
                isLoadingWasm={isLoadingWasm}
              />
            </div>
            
            <div className="flex justify-between p-2 border-t border-gray-700">
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-md transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Run</span>
                </motion.button>
              </div>
              
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
                >
                  <DocumentDuplicateIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Copy</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetCode}
                  className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Reset</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadCode}
                  className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Download</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}