'use client';

import { useEffect, useRef } from 'react';

interface OutputConsoleProps {
  output: string;
  isLoading: boolean;
}

const OutputConsole = ({ output, isLoading }: OutputConsoleProps) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-gray-800 text-white px-4 py-2 font-medium rounded-t-md">
        Output
      </div>
      <div
        ref={consoleRef}
        className="flex-1 bg-gray-900 text-white font-mono p-4 overflow-auto rounded-b-md"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            <span>Running code...</span>
          </div>
        ) : output ? (
          <pre className="whitespace-pre-wrap">{output}</pre>
        ) : (
          <span className="text-gray-400">Run your code to see the output here</span>
        )}
      </div>
    </div>
  );
};

export default OutputConsole;
