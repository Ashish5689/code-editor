import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as util from 'util';

const execPromise = util.promisify(exec);

// Function to create a temporary directory and file
async function createTempFile(code: string, language: string): Promise<{filePath: string, dirPath: string}> {
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'code-'));
  let filename = '';
  
  switch(language) {
    case 'javascript':
      filename = 'program.js';
      break;
    case 'typescript':
      filename = 'program.ts';
      // Create a basic tsconfig.json in the temp directory
      const tsConfig = {
        compilerOptions: {
          target: "es2016",
          module: "commonjs",
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          skipLibCheck: true
        }
      };
      await fs.promises.writeFile(
        path.join(tempDir, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, 2)
      );
      break;
    case 'python':
      filename = 'program.py';
      break;
    case 'java':
      // For Java, extract the public class name from the code
      const publicClassMatch = code.match(/public\s+class\s+(\w+)/);
      if (publicClassMatch && publicClassMatch[1]) {
        filename = `${publicClassMatch[1]}.java`;
      } else {
        // Default to Main.java if no public class is found
        filename = 'Main.java';
      }
      break;
    case 'c':
      filename = 'program.c';
      break;
    case 'cpp':
      filename = 'program.cpp';
      break;
    case 'csharp':
      filename = 'program.cs';
      break;
    case 'ruby':
      filename = 'program.rb';
      break;
    default:
      filename = 'program.txt';
  }
  
  const filePath = path.join(tempDir, filename);
  await fs.promises.writeFile(filePath, code);
  
  return { filePath, dirPath: tempDir };
}

// Helper function to check if a command is available
async function isCommandAvailable(command: string): Promise<boolean> {
  try {
    await execPromise(`which ${command}`);
    return true;
  } catch (error) {
    return false;
  }
}

// Function to execute code based on language
async function executeCode(filePath: string, language: string, input: string = ''): Promise<string> {
  let cmd = '';
  const dirPath = path.dirname(filePath);
  const timeoutMs = 10000; // 10 second timeout for execution
  
  try {
    switch(language) {
      case 'javascript':
        // Check if Node.js is installed
        if (!(await isCommandAvailable('node'))) {
          return "Node.js is not installed on the server. To run JavaScript code, you need to install Node.js.";
        }
        cmd = `node "${filePath}"`;
        break;
      case 'typescript':
        // Since we're having issues with npx tsc, let's use a simpler approach
        // Create a transpiled JS version by stripping type annotations
        try {
          const tsCode = await fs.promises.readFile(filePath, 'utf8');
          // Basic TypeScript to JavaScript conversion by stripping type annotations
          const jsCode = tsCode
            .replace(/:\s*(string|number|boolean|any|void|Date|RegExp)\s*([,=;)])/g, '$2')
            .replace(/function\s+\w+\([^)]*\):\s*\w+\s*{/g, (match) => match.replace(/:\s*\w+\s*{/, ' {'))
            .replace(/<[^>]+>/g, '')
            .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
            .replace(/type\s+\w+\s*=\s*[^;]*;/g, '');
          
          const jsFilePath = filePath.replace('.ts', '.js');
          await fs.promises.writeFile(jsFilePath, jsCode);
          cmd = `node "${jsFilePath}"`;
        } catch (error: any) {
          return `TypeScript Error: ${error.message}`;
        }
        break;
      case 'python':
        // Check if Python is installed
        if (!(await isCommandAvailable('python3'))) {
          return "Python 3 is not installed on the server. To run Python code, you need to install Python 3.";
        }
        cmd = `python3 "${filePath}"`;
        break;
      case 'java':
        // Check if Java is installed
        if (!(await isCommandAvailable('javac'))) {
          return "Java is not installed on the server. To run Java code, you need to install JDK.";
        }
        // Compile Java first, then run
        try {
          await execPromise(`javac "${filePath}"`);
        } catch (error: any) {
          return `Compilation Error: ${error.stderr || error.message}`;
        }
        // Extract class name from file path (without .java extension)
        const className = path.basename(filePath, '.java');
        cmd = `java -cp "${dirPath}" ${className}`;
        break;
      case 'c':
        // Check if gcc is installed
        if (!(await isCommandAvailable('gcc'))) {
          return "GCC is not installed on the server. To run C code, you need to install GCC.";
        }
        // Compile C, then run
        const cOutput = path.join(dirPath, 'program');
        try {
          await execPromise(`gcc "${filePath}" -o "${cOutput}"`);
        } catch (error: any) {
          return `Compilation Error: ${error.stderr || error.message}`;
        }
        cmd = `"${cOutput}"`;
        break;
      case 'cpp':
        // Check if g++ is installed
        if (!(await isCommandAvailable('g++'))) {
          return "G++ is not installed on the server. To run C++ code, you need to install G++.";
        }
        // Compile C++, then run
        const cppOutput = path.join(dirPath, 'program');
        try {
          await execPromise(`g++ "${filePath}" -o "${cppOutput}"`);
        } catch (error: any) {
          return `Compilation Error: ${error.stderr || error.message}`;
        }
        cmd = `"${cppOutput}"`;
        break;
      case 'csharp':
        // For C#, return a more user-friendly message about installation requirements
        return `C# execution requires the .NET SDK to be installed on the server.
To run C# code locally, you need to install:
1. .NET SDK: https://dotnet.microsoft.com/download
2. Then run: dotnet build your-file.cs && dotnet run

For now, here's your code:
\`\`\`csharp
${await fs.promises.readFile(filePath, 'utf8')}
\`\`\``;
      case 'ruby':
        // Check if Ruby is installed
        if (!(await isCommandAvailable('ruby'))) {
          return "Ruby is not installed on the server. To run Ruby code, you need to install Ruby.";
        }
        cmd = `ruby "${filePath}"`;
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
    
    // Add any input through stdin if provided
    const inputOption = input ? { input } : {};
    const { stdout, stderr } = await execPromise(cmd, { 
      timeout: timeoutMs,
      ...inputOption
    });
    
    if (stderr && stderr.trim().length > 0) {
      return `Runtime Error: ${stderr}`;
    }
    
    return stdout || 'Program executed successfully, but no output was produced.';
  } catch (error: any) {
    if (error.killed && error.signal === 'SIGTERM') {
      return 'Error: Execution timed out. Your program took too long to complete.';
    } else if (error.stderr) {
      return `Runtime Error: ${error.stderr}`;
    }
    return `Error: ${error.message || 'Unknown error occurred'}`;
  }
}

// Function to clean up temporary files
async function cleanupTempFiles(dirPath: string): Promise<void> {
  try {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    console.error('Failed to clean up temporary files:', error);
  }
}

export async function POST(request: NextRequest) {
  let tempDirPath = '';
  
  try {
    const { code, language, input } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }
    
    // For JavaScript, we can handle it without creating temp files
    if (language === 'javascript') {
      // Browser-side execution is already handled in the client
      // This is just a fallback for server-side execution
      const { filePath, dirPath } = await createTempFile(code, language);
      tempDirPath = dirPath;
      const output = await executeCode(filePath, language, input || '');
      return NextResponse.json({ output });
    }
    
    // For other languages, create temporary files and execute
    const { filePath, dirPath } = await createTempFile(code, language);
    tempDirPath = dirPath;
    
    // If input is provided for languages that need stdin files
    if (input && ['c', 'cpp', 'python', 'ruby'].includes(language)) {
      // Create input file for languages that don't handle stdin well
      const inputFilePath = path.join(dirPath, 'input.txt');
      await fs.promises.writeFile(inputFilePath, input);
    }
    
    const output = await executeCode(filePath, language, input || '');
    
    // If we get an error about language not being installed, suggest client-side WebAssembly alternative
    if (output.includes("is not installed on the server")) {
      // Suggest client-side WebAssembly alternative
      return NextResponse.json({ 
        output: output,
        useClientFallback: true,
        language: language
      });
    }
    
    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  } finally {
    // Clean up temporary files
    if (tempDirPath) {
      await cleanupTempFiles(tempDirPath);
    }
  }
}
