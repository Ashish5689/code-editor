import { NextRequest, NextResponse } from 'next/server';
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

// Map of language IDs to their versions in Piston
const languageVersions: Record<string, string> = {
  'nodejs': '18.15.0',
  'typescript': '5.0.3',
  'python3': '3.10.0',
  'python2': '2.7.18',
  'java': '19.0.2',
  'c': '10.2.0',
  'cpp': '10.2.0',
  'csharp': '6.12.0',
  'ruby': '3.2.1',
  'go': '1.20.2',
  'rust': '1.68.2',
  'php': '8.2.3',
  'swift': '5.8',
  'kotlin': '1.8.10'
};

// Function to execute code using Piston API
async function executeCodeWithPiston(code: string, language: string, input: string = ''): Promise<string> {
  try {
    // Skip execution for JavaScript and TypeScript as they'll be handled client-side
    if (language === 'javascript' || language === 'typescript') {
      return `For ${language}, execution happens in the browser console. Check your browser's console output.`;
    }
    
    const languageId = languageToPistonId[language];
    
    if (!languageId) {
      return `Language '${language}' is not supported by Piston.`;
    }
    
    console.log(`Using Piston API at: https://emkc.org/api/v2/piston/execute`);
    console.log(`Executing ${language} code with language_id: ${languageId}`);
    
    // Process code based on language requirements
    let processedCode = code;
    
    // Language-specific processing
    if (languageId === 'java') {
      // Check if there's a public class that's not named Main
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      if (classMatch && classMatch[1] !== 'Main') {
        // Replace the class name with Main
        processedCode = code.replace(/public\s+class\s+\w+/, 'public class Main');
        console.log('Renamed Java class to Main');
      } else if (!classMatch) {
        // If no public class is found, wrap the code in a Main class
        processedCode = `
public class Main {
    public static void main(String[] args) {
        ${code}
    }
}`;
        console.log('Wrapped Java code in Main class');
      }
    }
    
    // Get the specific version for this language
    const version = languageVersions[languageId] || ''; 
    
    // Create the submission payload
    const payload = {
      language: languageId,
      version: version,
      files: [
        {
          name: getFilenameForLanguage(languageId),
          content: processedCode
        }
      ],
      stdin: input || '',
      args: [],
      compile_timeout: 10000,
      run_timeout: 5000,
      compile_memory_limit: -1,
      run_memory_limit: -1
    };
    
    console.log('Submission payload:', JSON.stringify({...payload, files: [{...payload.files[0], content: '...content...'}]})); // Log without huge code content
    
    // Create a submission
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Piston response:', response.data);
    
    if (response.data.run) {
      // Check for errors
      if (response.data.run.stderr) {
        return `Runtime Error: ${response.data.run.stderr}`;
      }
      
      // Check for compilation errors
      if (response.data.compile && response.data.compile.stderr) {
        return `Compilation Error: ${response.data.compile.stderr}`;
      }
      
      // Return the output
      return response.data.run.stdout || 'Program executed successfully, but no output was produced.';
    } else {
      return 'Error: Failed to execute code with Piston API.';
    }
  } catch (error) {
    console.error('Error executing code with Piston:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      return `Piston API Error: ${error.response?.data?.message || error.message || 'Unknown error'}`;
    }
    return `Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`;
  }
}

// Helper function to get the appropriate filename for each language
function getFilenameForLanguage(language: string): string {
  const filenameMap: Record<string, string> = {
    'nodejs': 'script.js',
    'typescript': 'script.ts',
    'python3': 'script.py',
    'python2': 'script.py',
    'java': 'Main.java',
    'c': 'main.c',
    'cpp': 'main.cpp',
    'csharp': 'Main.cs',
    'ruby': 'script.rb',
    'go': 'main.go',
    'rust': 'main.rs',
    'php': 'script.php',
    'swift': 'main.swift',
    'kotlin': 'Main.kt'
  };
  
  return filenameMap[language] || 'code.txt';
}

// Fallback function to simulate output for common code patterns
function getFallbackOutput(code: string, language: string): string {
  try {
    // Simple pattern matching for common output patterns
    if (language === 'python') {
      // Match print statements in Python
      const printMatches = code.match(/print\s*\((["'].*?["'])\)/g);
      if (printMatches) {
        return printMatches
          .map(match => {
            // Extract the string inside the print statement
            const stringMatch = match.match(/print\s*\((["'])(.*?)\1\)/);
            return stringMatch ? stringMatch[2] : '';
          })
          .join('\n');
      }
    } else if (language === 'javascript') {
      // Match console.log statements in JavaScript
      const logMatches = code.match(/console\.log\s*\((["'].*?["'])\)/g);
      if (logMatches) {
        return logMatches
          .map(match => {
            // Extract the string inside the console.log statement
            const stringMatch = match.match(/console\.log\s*\((["'])(.*?)\1\)/);
            return stringMatch ? stringMatch[2] : '';
          })
          .join('\n');
      }
    } else if (language === 'java') {
      // Match System.out.println statements in Java
      const printMatches = code.match(/System\.out\.println\s*\((["'].*?["'])\)/g);
      if (printMatches) {
        return printMatches
          .map(match => {
            // Extract the string inside the println statement
            const stringMatch = match.match(/System\.out\.println\s*\((["'])(.*?)\1\)/);
            return stringMatch ? stringMatch[2] : '';
          })
          .join('\n');
      }
    }
    
    // If no patterns match, return a generic message
    return "(Fallback output simulation not available for this code)";
  } catch (error) {
    console.error('Error in fallback output generation:', error);
    return "(Error generating fallback output)";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, input } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }
    
    console.log(`Received request to execute ${language} code`);
    
    // Execute code using Piston
    const output = await executeCodeWithPiston(code, language, input || '');
    
    console.log(`Execution completed. Output length: ${output.length}`);
    
    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
