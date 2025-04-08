'use client';

import { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import Header from '../components/Header';
import { BeakerIcon, DocumentDuplicateIcon, ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import dynamic from 'next/dynamic';
import JSZip from 'jszip';

// Define the props interface for FrontendPreview
interface FrontendPreviewProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

// Dynamically import the FrontendPreview component with no SSR
const FrontendPreview = dynamic<FrontendPreviewProps>(
  () => import('@/app/components/FrontendPreview'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export default function FrontendPage() {
  const [htmlCode, setHtmlCode] = useState<string>(
    `<!DOCTYPE html>
<html>
<head>
  <title>My Web Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Welcome to my interactive web page.</p>
  <button id="changeColor">Change Color</button>
</body>
</html>`
  );
  
  const [cssCode, setCssCode] = useState<string>(
    `body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 20px;
  padding: 0;
}

h1 {
  color: #333;
  text-align: center;
}

p {
  color: #666;
  line-height: 1.6;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 20px auto;
}

button:hover {
  background-color: #45a049;
}`
  );
  
  const [jsCode, setJsCode] = useState<string>(
    `document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('changeColor');
  
  if (button) {
    button.addEventListener('click', function() {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
      document.body.style.backgroundColor = randomColor;
    });
  }
});`
  );
  
  const [activeTab, setActiveTab] = useState<string>('html');
  const [editorTheme, setEditorTheme] = useState<string>('vs-dark');
  
  const toggleTheme = () => {
    setEditorTheme(editorTheme === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };
  
  const handleCopyCode = () => {
    let codeToCopy = '';
    
    switch (activeTab) {
      case 'html':
        codeToCopy = htmlCode;
        break;
      case 'css':
        codeToCopy = cssCode;
        break;
      case 'js':
        codeToCopy = jsCode;
        break;
    }
    
    navigator.clipboard.writeText(codeToCopy);
  };
  
  const handleResetCode = () => {
    switch (activeTab) {
      case 'html':
        setHtmlCode(`<!DOCTYPE html>
<html>
<head>
  <title>My Web Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Welcome to my interactive web page.</p>
  <button id="changeColor">Change Color</button>
</body>
</html>`);
        break;
      case 'css':
        setCssCode(`body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 20px;
  padding: 0;
}

h1 {
  color: #333;
  text-align: center;
}

p {
  color: #666;
  line-height: 1.6;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 20px auto;
}

button:hover {
  background-color: #45a049;
}`);
        break;
      case 'js':
        setJsCode(`document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('changeColor');
  
  if (button) {
    button.addEventListener('click', function() {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
      document.body.style.backgroundColor = randomColor;
    });
  }
});`);
        break;
    }
  };
  
  const handleDownloadCode = () => {
    let content = '';
    let filename = '';
    
    switch (activeTab) {
      case 'html':
        content = htmlCode;
        filename = 'index.html';
        break;
      case 'css':
        content = cssCode;
        filename = 'styles.css';
        break;
      case 'js':
        content = jsCode;
        filename = 'script.js';
        break;
    }
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleDownloadAll = () => {
    // Create a zip file with all the code
    const zip = new JSZip();
    zip.file('index.html', htmlCode);
    zip.file('styles.css', cssCode);
    zip.file('script.js', jsCode);
    
    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const element = document.createElement('a');
      element.href = URL.createObjectURL(content);
      element.download = 'web-project.zip';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  };
  
  return (
    <div className="min-h-screen gradient-animation text-white">
      <Header 
        theme={editorTheme} 
        toggleTheme={toggleTheme} 
        showThemeToggle={true}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Frontend Playground</h1>
          <p className="text-gray-300">Write HTML, CSS, and JavaScript to create and preview web pages in real-time.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 'calc(100vh - 240px)' }}>
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex mb-2 bg-gray-800/50 rounded-t-lg overflow-hidden">
              <button 
                className={`px-4 py-2 ${activeTab === 'html' ? 'bg-blue-600' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
              <button 
                className={`px-4 py-2 ${activeTab === 'css' ? 'bg-pink-600' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}
                onClick={() => setActiveTab('css')}
              >
                CSS
              </button>
              <button 
                className={`px-4 py-2 ${activeTab === 'js' ? 'bg-yellow-600' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}
                onClick={() => setActiveTab('js')}
              >
                JavaScript
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {activeTab === 'html' && (
                <div className="h-full">
                  <CodeEditor
                    language="html"
                    value={htmlCode}
                    onChange={(value) => setHtmlCode(value || '')}
                    theme={editorTheme}
                  />
                </div>
              )}
              {activeTab === 'css' && (
                <div className="h-full">
                  <CodeEditor
                    language="css"
                    value={cssCode}
                    onChange={(value) => setCssCode(value || '')}
                    theme={editorTheme}
                  />
                </div>
              )}
              {activeTab === 'js' && (
                <div className="h-full">
                  <CodeEditor
                    language="javascript"
                    value={jsCode}
                    onChange={(value) => setJsCode(value || '')}
                    theme={editorTheme}
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
              >
                <DocumentDuplicateIcon className="h-5 w-5" />
                <span>Copy</span>
              </button>
              
              <button
                onClick={handleResetCode}
                className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Reset</span>
              </button>
              
              <button
                onClick={handleDownloadCode}
                className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Download</span>
              </button>
              
              <button
                onClick={handleDownloadAll}
                className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-2 rounded-md transition-colors shadow-md"
              >
                <BeakerIcon className="h-5 w-5" />
                <span>Export All</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col h-full overflow-hidden">
            <div className="bg-gray-800/50 px-4 py-2 flex items-center justify-between border-b border-gray-700/30 rounded-t-lg mb-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-400 font-mono">Preview</span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <FrontendPreview 
                htmlCode={htmlCode}
                cssCode={cssCode}
                jsCode={jsCode}
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className={`py-4 text-center ${editorTheme === 'vs-dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
        <div className="container mx-auto">
          <p> {new Date().getFullYear()} CodeSurfer | Built with Next.js and Monaco Editor</p>
        </div>
      </footer>
    </div>
  );
}
