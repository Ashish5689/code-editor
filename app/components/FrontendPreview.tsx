'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

interface FrontendPreviewProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

const FrontendPreview = ({ htmlCode, cssCode, jsCode }: FrontendPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [autoPreview, setAutoPreview] = useState<boolean>(false);
  const [previewKey, setPreviewKey] = useState<number>(0);

  useEffect(() => {
    if (autoPreview) {
      updatePreview();
    }
  }, [htmlCode, cssCode, jsCode, autoPreview]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument;
    
    if (!document) return;

    // Clear the iframe
    document.open();
    
    // Create a complete HTML document with the user's code
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${extractBodyContent(htmlCode)}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
    
    // Write the content to the iframe
    document.write(fullHtml);
    document.close();
    
    // Force a re-render of the iframe
    setPreviewKey(prev => prev + 1);
  };

  // Helper function to extract body content from HTML
  const extractBodyContent = (html: string) => {
    // If the HTML contains a body tag, extract its content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      return bodyMatch[1];
    }
    
    // If no body tag is found, remove any doctype, html, head tags and return the rest
    let content = html
      .replace(/<!DOCTYPE[^>]*>/i, '')
      .replace(/<html[^>]*>|<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/i, '');
      
    // Also remove body tags if they exist without content
    content = content.replace(/<body[^>]*>|<\/body>/gi, '');
    
    return content;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={updatePreview}
            className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-md transition-colors shadow-md mr-2"
          >
            <ArrowPathIcon className="h-5 w-5 mr-1" />
            <span>Preview</span>
          </button>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoPreview"
              checked={autoPreview}
              onChange={() => setAutoPreview(!autoPreview)}
              className="mr-2"
            />
            <label htmlFor="autoPreview" className="text-sm text-gray-300">Auto Preview</label>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full glass-dark rounded-lg shadow-lg overflow-hidden border border-gray-700/30">
        <iframe
          key={previewKey}
          ref={iframeRef}
          title="Frontend Preview"
          className="w-full h-full bg-white"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default FrontendPreview;
