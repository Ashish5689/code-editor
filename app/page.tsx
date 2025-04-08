'use client';

import { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputConsole from './components/OutputConsole';
import LanguageSelector from './components/LanguageSelector';
import Header from './components/Header';
import { SUPPORTED_LANGUAGES, getDefaultCode } from './utils/codeTemplates';
import { executeCode } from './services/codeExecutionService';
import { PlayIcon, DocumentDuplicateIcon, ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [editorTheme, setEditorTheme] = useState<string>('vs-dark');
  const [stdin, setStdin] = useState<string>('');
  const [showStdin, setShowStdin] = useState<boolean>(false);

  // Set default code when language changes
  useEffect(() => {
    setCode(getDefaultCode(selectedLanguage.id));
  }, [selectedLanguage]);

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

  return (
    <div className={`flex flex-col min-h-screen ${editorTheme === 'vs-dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Header theme={editorTheme} toggleTheme={toggleTheme} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-64">
              <LanguageSelector
                languages={SUPPORTED_LANGUAGES}
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayIcon className="h-5 w-5" />
                <span>Run</span>
              </button>
              
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors"
              >
                <DocumentDuplicateIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Copy</span>
              </button>
              
              <button
                onClick={handleResetCode}
                className="flex items-center space-x-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              
              <button
                onClick={handleDownloadCode}
                className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[70vh]">
            <div className="h-full">
              <CodeEditor
                language={selectedLanguage.value}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme={editorTheme}
              />
            </div>
            
            <div className="h-full flex flex-col">
              <OutputConsole output={output} isLoading={isExecuting} />
              
              {showStdin && (
                <div className="mt-4">
                  <div className="bg-gray-800 text-white px-4 py-2 font-medium rounded-t-md">
                    Standard Input
                  </div>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    className="w-full h-32 bg-gray-900 text-white font-mono p-4 rounded-b-md resize-none"
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
        </div>
      </main>
      
      <footer className={`py-4 text-center ${editorTheme === 'vs-dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
        <div className="container mx-auto">
          <p> {new Date().getFullYear()} Code Surfer | Built with Next.js and Monaco Editor</p>
        </div>
      </footer>
    </div>
  );
}
