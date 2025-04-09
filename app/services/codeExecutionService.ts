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
    
    // Check if the server suggests using client-side fallback
    if (response.data.useClientFallback) {
      return executeCodeInBrowser(code, response.data.language, input);
    }
    
    return response.data.output;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return `Error: ${error.response.data.error || 'Failed to execute code'}`;
    }
    return `Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`;
  }
};

// Execute code in browser using WebAssembly-based solutions
const executeCodeInBrowser = async (code: string, language: string, input?: string): Promise<string> => {
  switch (language) {
    case 'python':
      return executePythonInBrowser(code, input);
    case 'cpp':
      return executeCppInBrowser(code, input);
    case 'c':
      return executeCInBrowser(code, input);
    case 'java':
      return executeJavaInBrowser(code, input);
    case 'ruby':
      return executeRubyInBrowser(code, input);
    default:
      return `Client-side execution for ${language} is not supported yet.`;
  }
};

// Python execution in browser using Pyodide
const executePythonInBrowser = async (code: string, input?: string): Promise<string> => {
  try {
    // Check if Pyodide is already loaded
    if (!(window as any).loadPyodide) {
      // Inform the user we need to load the Pyodide runtime
      console.log("Loading Python interpreter (Pyodide)...");
      // Load Pyodide script
      await loadScript('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js');
    }
    
    // Check again if Pyodide loaded successfully
    if (!(window as any).loadPyodide) {
      return "Failed to load Python interpreter (Pyodide).";
    }
    
    // Load Pyodide if it hasn't been loaded yet
    if (!(window as any).pyodide) {
      (window as any).pyodide = await (window as any).loadPyodide();
    }
    
    // Set up stdin simulation if input is provided
    if (input) {
      const inputLines = input.split('\n');
      let lineIndex = 0;
      
      // Override input function
      await (window as any).pyodide.runPythonAsync(`
      import builtins
      import io
      import sys
      
      class StringReader:
          def __init__(self, string):
              self.string = string.split('\\n')
              self.position = 0
              
          def readline(self):
              if self.position < len(self.string):
                  line = self.string[self.position]
                  self.position += 1
                  return line + '\\n'
              return ''
      
      sys.stdin = StringReader("""${input}""")
      
      # Capture stdout
      sys.stdout = io.StringIO()
      `);
    } else {
      // Just capture stdout without stdin override
      await (window as any).pyodide.runPythonAsync(`
      import io
      import sys
      sys.stdout = io.StringIO()
      `);
    }
    
    // Run the Python code
    try {
      await (window as any).pyodide.runPythonAsync(code);
      // Get the captured output
      const output = await (window as any).pyodide.runPythonAsync(`sys.stdout.getvalue()`);
      return output || "Program executed successfully, but no output was produced.";
    } catch (error) {
      return `Python Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  } catch (error) {
    return `Error setting up Python environment: ${error instanceof Error ? error.message : String(error)}`;
  }
};

// C++ execution using WASM-based solution
const executeCppInBrowser = async (code: string, input?: string): Promise<string> => {
  return "C++ browser execution is in development. Please try again later.\n\nYou can use a free online C++ compiler in the meantime, such as:\n- https://www.programiz.com/cpp-programming/online-compiler/\n- https://www.onlinegdb.com/online_c++_compiler";
};

// C execution using WASM-based solution
const executeCInBrowser = async (code: string, input?: string): Promise<string> => {
  return "C browser execution is in development. Please try again later.\n\nYou can use a free online C compiler in the meantime, such as:\n- https://www.programiz.com/c-programming/online-compiler/\n- https://www.onlinegdb.com/online_c_compiler";
};

// Java execution using Java2WASM or similar
const executeJavaInBrowser = async (code: string, input?: string): Promise<string> => {
  return "Java browser execution is in development. Please try again later.\n\nYou can use a free online Java compiler in the meantime, such as:\n- https://www.online-java.com/\n- https://www.jdoodle.com/online-java-compiler/";
};

// Ruby execution using Ruby.wasm
const executeRubyInBrowser = async (code: string, input?: string): Promise<string> => {
  return "Ruby browser execution is in development. Please try again later.\n\nYou can use a free online Ruby compiler in the meantime, such as:\n- https://www.onlinegdb.com/online_ruby_compiler\n- https://replit.com/languages/ruby";
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
      
      // Restore original console.log
      console.log = originalConsoleLog;
      
      resolve(output || 'Program executed successfully, but no output was produced.');
    } catch (error) {
      // Restore original console.log
      console.log = originalConsoleLog;
      
      resolve(`JavaScript Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};

// Utility function to dynamically load a script
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (error) => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};
