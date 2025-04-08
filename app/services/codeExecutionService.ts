'use client';

import axios from 'axios';

// This service handles code execution by calling our API endpoint
export const executeCode = async (code: string, language: string, input?: string): Promise<string> => {
  try {
    // For JavaScript, we can execute it directly in the browser for a better demo experience
    if (language === 'javascript') {
      return executeJavaScriptInBrowser(code);
    }
    
    // For other languages, call our API endpoint
    const response = await axios.post('/api/execute', {
      code,
      language,
      input
    });
    
    return response.data.output;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return `Error: ${error.response.data.error || 'Failed to execute code'}`;
    }
    return `Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`;
  }
};

// Execute JavaScript code directly in the browser
// Note: This is not secure for production use with untrusted code
const executeJavaScriptInBrowser = (code: string): Promise<string> => {
  return new Promise((resolve) => {
    const originalConsoleLog = console.log;
    let output = '';
    
    // Override console.log to capture output
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalConsoleLog(...args);
    };
    
    try {
      // Using Function constructor to evaluate JavaScript
      // Note: This is not secure for production use
      new Function(code)();
      
      // If no output was produced but code executed successfully
      if (!output) {
        output = 'Code executed successfully, but no output was produced.';
      }
    } catch (error: any) {
      output = `Error: ${error.message}`;
    } finally {
      // Restore console.log
      console.log = originalConsoleLog;
    }
    
    resolve(output);
  });
};
