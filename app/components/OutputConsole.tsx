'use client';

import { useEffect, useRef } from 'react';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface OutputConsoleProps {
  output: string;
  isLoading: boolean;
  isLoadingWasm?: boolean;
}

const OutputConsole = ({ output, isLoading, isLoadingWasm = false }: OutputConsoleProps) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  const hasError = output.toLowerCase().includes('error');

  return (
    <div className="h-full w-full flex flex-col glass-dark rounded-lg shadow-lg overflow-hidden border border-gray-700/30">
      <div className="bg-gray-800/50 px-4 py-2 flex items-center justify-between border-b border-gray-700/30 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-200">Console Output</span>
          {!isLoading && !isLoadingWasm && output && (
            <span className={`flex items-center text-xs ${hasError ? 'text-red-400' : 'text-green-400'}`}>
              {hasError ? (
                <XCircleIcon className="h-4 w-4 mr-1" />
              ) : (
                <CheckCircleIcon className="h-4 w-4 mr-1" />
              )}
              {hasError ? 'Error' : 'Success'}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400">
          {isLoadingWasm ? 'Loading WebAssembly...' : isLoading ? 'Processing...' : 'Ready'}
        </div>
      </div>
      <div
        ref={consoleRef}
        className="flex-1 bg-gray-900/60 text-white font-mono p-4 overflow-auto min-h-0"
      >
        {isLoadingWasm ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
              <span className="text-purple-400">Loading WebAssembly runtime...</span>
              <p className="text-gray-400 text-sm mt-2 text-center">
                This may take a moment for the first run
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <span className="text-blue-400">Executing code...</span>
            </div>
          </div>
        ) : output ? (
          <pre className="whitespace-pre-wrap">{output}</pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ArrowPathIcon className="h-8 w-8 mb-2" />
            <span>Run your code to see the output here</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputConsole;
