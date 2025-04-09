'use client';

import { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { DocumentDuplicateIcon, ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
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
  () => import('../components/FrontendPreview'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-800/70 rounded-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export default function FrontendPage() {
  // Initialize with complete HTML including doctype, html, head and body tags
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
  text-align: center;
  margin-bottom: 20px;
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
  
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [editorTheme, setEditorTheme] = useState<'vs' | 'vs-dark'>('vs-dark');
  const [previewVisible, setPreviewVisible] = useState<boolean>(true);
  
  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('editorTheme');
    if (savedTheme === 'vs' || savedTheme === 'vs-dark') {
      setEditorTheme(savedTheme);
    }
  }, []);
  
  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('editorTheme', editorTheme);
  }, [editorTheme]);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setEditorTheme(editorTheme === 'vs-dark' ? 'vs' : 'vs-dark');
  };
  
  // Copy the code from the active tab to clipboard
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
  
  // Reset the code in the active tab to default
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
  text-align: center;
  margin-bottom: 20px;
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
  
  // Download the code from the active tab
  const handleDownloadCode = () => {
    let filename = '';
    let content = '';
    
    switch (activeTab) {
      case 'html':
        filename = 'index.html';
        content = htmlCode;
        break;
      case 'css':
        filename = 'styles.css';
        content = cssCode;
        break;
      case 'js':
        filename = 'script.js';
        content = jsCode;
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
  
  // Download all code files as a zip
  const handleDownloadAll = async () => {
    const zip = new JSZip();
    
    zip.file('index.html', htmlCode);
    zip.file('styles.css', cssCode);
    zip.file('script.js', jsCode);
    
    const content = await zip.generateAsync({ type: 'blob' });
    
    const element = document.createElement('a');
    element.href = URL.createObjectURL(content);
    element.download = 'frontend-project.zip';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  // Toggle preview visibility
  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };
  
  return (
    <div className={`min-h-screen ${editorTheme === 'vs-dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${editorTheme === 'vs-dark' ? 'text-white' : 'text-gray-900'}`}>
            Frontend Playground
          </h1>
          <p className={`mt-1 ${editorTheme === 'vs-dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Create and preview HTML, CSS, and JavaScript in real-time
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)]">
          {/* Editor Section */}
          <div className={`flex flex-col h-full overflow-hidden ${previewVisible ? 'lg:w-1/2' : 'lg:w-full'}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-t-md ${
                    activeTab === 'html'
                      ? editorTheme === 'vs-dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-blue-600'
                      : editorTheme === 'vs-dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setActiveTab('css')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-t-md ${
                    activeTab === 'css'
                      ? editorTheme === 'vs-dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-blue-600'
                      : editorTheme === 'vs-dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  CSS
                </button>
                <button
                  onClick={() => setActiveTab('js')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-t-md ${
                    activeTab === 'js'
                      ? editorTheme === 'vs-dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-blue-600'
                      : editorTheme === 'vs-dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  JavaScript
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={togglePreview}
                  className={`p-1.5 rounded-md flex items-center gap-1 ${
                    editorTheme === 'vs-dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={previewVisible ? 'Hide Preview' : 'Show Preview'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {previewVisible ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                  <span className="text-sm hidden sm:inline">{previewVisible ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
                
                <button
                  onClick={handleDownloadAll}
                  className={`p-1.5 rounded-md ${
                    editorTheme === 'vs-dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="Download All Files as ZIP"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </button>
                
                <button
                  onClick={toggleTheme}
                  className={`p-1.5 rounded-md ${
                    editorTheme === 'vs-dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={editorTheme === 'vs-dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                >
                  {editorTheme === 'vs-dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className={`flex-1 rounded-md overflow-hidden ${
              editorTheme === 'vs-dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
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
            
            <div className="flex flex-wrap gap-2 mt-3">
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
            </div>
          </div>
          
          {/* Preview Section - Only shown when previewVisible is true */}
          {previewVisible && (
            <div className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg lg:w-1/2">
              <div className={`px-4 py-2 flex items-center justify-between border-b ${editorTheme === 'vs-dark' ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-200 border-gray-300'} rounded-t-lg`}>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className={`text-xs font-mono ${editorTheme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Preview
                  </span>
                </div>
              </div>
              <div className={`flex-1 overflow-hidden ${editorTheme === 'vs-dark' ? 'bg-white' : 'bg-gray-50'} rounded-b-lg`}>
                <FrontendPreview 
                  htmlCode={htmlCode}
                  cssCode={cssCode}
                  jsCode={jsCode}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
