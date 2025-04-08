'use client';

import { useState, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  theme?: string;
}

const CodeEditor = ({ language, value, onChange, theme = 'vs-dark' }: CodeEditorProps) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    setIsEditorReady(true);
    
    // Add custom editor configurations here if needed
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      padding: { top: 16, bottom: 16 },
      glyphMargin: true,
      renderLineHighlight: 'all',
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
    });
  };

  return (
    <div className="h-full w-full glass-dark rounded-lg shadow-lg overflow-hidden border border-gray-700/30">
      <div className="bg-gray-800/50 px-4 py-2 flex items-center justify-between border-b border-gray-700/30">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono">{language}</span>
        </div>
        <div className="text-xs text-gray-400">
          {isEditorReady ? 'Ready' : 'Loading...'}
        </div>
      </div>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={value}
        theme={theme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly: false,
          cursorStyle: 'line',
          tabSize: 2,
        }}
        loading={
          <div className="flex items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
