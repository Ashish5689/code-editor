'use client';

import axios from 'axios';

// This service handles code execution by calling our API endpoint
export const executeCode = async (code: string, language: string, input?: string): Promise<string> => {
  try {
    // For JavaScript, we can execute it directly in the browser for a better demo experience
    if (language === 'javascript') {
      return executeJavaScriptInBrowser(code, input);
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
const executeJavaScriptInBrowser = (code: string, input?: string): Promise<string> => {
  return new Promise((resolve) => {
    const originalConsoleLog = console.log;
    let output = '';
    
    // Override console.log to capture output
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalConsoleLog(...args);
    };
    
    try {
      // If input is provided, create a simple read function for processing
      if (input) {
        // Create a simple readline simulation for browser
        let inputLines = input.split('\n');
        let lineIndex = 0;
        
        // Add a global readline function
        (window as any).readline = () => {
          if (lineIndex < inputLines.length) {
            return inputLines[lineIndex++];
          }
          return '';
        };
        
        // Add prompt function that returns input
        (window as any).prompt = () => {
          if (lineIndex < inputLines.length) {
            return inputLines[lineIndex++];
          }
          return '';
        };
        
        // Add a message about the available input functions
        output += "// Input functions available: readline() and prompt()\n";
      }
      
      // Pre-process the code to remove TypeScript type annotations that might be present
      // This is a simple way to support users switching between TypeScript and JavaScript
      const cleanedCode = code
        .replace(/:\s*(string|number|boolean|any|void|Date|RegExp)\s*([,=;)])/g, '$2') // Remove basic type annotations
        .replace(/function\s+\w+\([^)]*\):\s*\w+\s*{/g, (match) => match.replace(/:\s*\w+\s*{/, ' {')) // Remove function return types
        .replace(/<[^>]+>/g, ''); // Remove generic type parameters
      
      // Using Function constructor to evaluate JavaScript
      // Note: This is not secure for production use
      new Function(cleanedCode)();
      
      // If no output was produced but code executed successfully
      if (!output) {
        output = 'Code executed successfully, but no output was produced.';
      }
    } catch (error: any) {
      // Check if the error is related to TypeScript syntax
      if (error.message.includes('type') || error.message.includes(':') || error.message.includes('interface')) {
        output = `Error: You may be using TypeScript syntax in JavaScript mode. Switch to TypeScript or remove type annotations.\n${error.message}`;
      } else {
        output = `Error: ${error.message}`;
      }
    } finally {
      // Restore console.log
      console.log = originalConsoleLog;
      
      // Clean up global readline/prompt functions if we added them
      if (input) {
        delete (window as any).readline;
        delete (window as any).prompt;
      }
    }
    
    resolve(output);
  });
};
