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
    });
  };

  return (
    <div className="h-full w-full border border-gray-700 rounded-md overflow-hidden">
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
        loading={<div className="text-center p-4">Loading editor...</div>}
      />
    </div>
  );
};

export default CodeEditor;
