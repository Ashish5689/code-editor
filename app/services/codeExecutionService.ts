'use client';

import axios from 'axios';

// Map of language names to Piston language IDs
const languageToPistonId: Record<string, string> = {
  'javascript': 'nodejs',
  'typescript': 'typescript',
  'python': 'python3',
  'python2': 'python2',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'csharp': 'csharp',
  'ruby': 'ruby',
  'go': 'go',
  'rust': 'rust',
  'php': 'php',
  'swift': 'swift',
  'kotlin': 'kotlin'
};

// This service handles code execution by calling our API endpoint
export const executeCode = async (code: string, language: string, input?: string): Promise<string> => {
  try {
    // For JavaScript and TypeScript, execute in the browser
    if ((language === 'javascript' || language === 'typescript') && typeof window !== 'undefined') {
      return executeInBrowser(code, language, input);
    }
    
    // For other languages, use Piston API
    return executeCodeWithPiston(code, language, input);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return `Error: ${error.response.data.error || 'Failed to execute code'}`;
    }
    return `Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`;
  }
};

// Execute JavaScript/TypeScript code directly in the browser
const executeInBrowser = (code: string, language: string, input?: string): Promise<string> => {
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
      
      // Pre-process the code to remove TypeScript type annotations if needed
      let processedCode = code;
      if (language === 'typescript') {
        processedCode = code
          .replace(/:\s*(string|number|boolean|any|void|Date|RegExp)\s*([,=;)])/g, '$2') // Remove basic type annotations
          .replace(/function\s+\w+\([^)]*\):\s*\w+\s*{/g, (match) => match.replace(/:\s*\w+\s*{/, ' {')) // Remove function return types
          .replace(/<[^>]+>/g, ''); // Remove generic type parameters
      }
      
      // Using Function constructor to evaluate JavaScript
      new Function(processedCode)();
      
      // Restore original console.log
      console.log = originalConsoleLog;
      
      resolve(output || 'Program executed successfully, but no output was produced.');
    } catch (error) {
      // Restore original console.log
      console.log = originalConsoleLog;
      
      resolve(`${language === 'typescript' ? 'TypeScript' : 'JavaScript'} Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};

// Execute code using Piston API
const executeCodeWithPiston = async (code: string, language: string, input?: string): Promise<string> => {
  try {
    // Get Piston language ID
    const languageId = languageToPistonId[language];
    
    if (!languageId) {
      return `Language '${language}' is not supported by Piston.`;
    }
    
    // Call our API endpoint that will communicate with Piston
    const response = await axios.post('/api/execute', {
      code,
      language,
      input
    });
    
    return response.data.output;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return `Error: ${error.response.data.error || 'Failed to execute code with Piston'}`;
    }
    return `Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`;
  }
};
