'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CodeEditor from '../components/CodeEditor';
import OutputConsole from '../components/OutputConsole';
import LanguageSelector from '../components/LanguageSelector';
import { SUPPORTED_LANGUAGES, getDefaultCode } from '../utils/codeTemplates';
import { executeCode } from '../services/codeExecutionService';
import { PlayIcon, DocumentDuplicateIcon, ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function CodePage() {
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [editorTheme, setEditorTheme] = useState<string>('vs-dark');
  const [stdin, setStdin] = useState<string>('');
  const [showStdin, setShowStdin] = useState<boolean>(false);
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
    <div className={`min-h-screen ${editorTheme === 'vs-dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
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
              className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-md transition-colors shadow-md disabled:opacity-50"
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
    </div>
  );
}
