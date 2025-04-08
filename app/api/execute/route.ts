import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language, input } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would connect to a secure execution environment
    // For now, we'll return a mock response based on the language
    let output = '';
    
    // This is just a mock implementation
    // In production, you would use a secure sandbox or backend service
    switch (language) {
      case 'javascript':
        output = `Executed JavaScript code:\n${code.split('\n')[0]}\nOutput: Hello, World!`;
        break;
      case 'python':
        output = `Executed Python code:\n${code.split('\n')[0]}\nOutput: Hello, World!`;
        break;
      default:
        output = `Executed ${language} code successfully.\nOutput: Hello, World!`;
    }

    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}
