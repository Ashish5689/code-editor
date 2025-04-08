'use client';

import { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

interface FrontendPreviewProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

const FrontendPreview = ({ htmlCode, cssCode, jsCode }: FrontendPreviewProps) => {
  const [autoPreview, setAutoPreview] = useState<boolean>(true);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Update preview when code changes and autoPreview is enabled
  useEffect(() => {
    if (autoPreview) {
      updatePreview();
    }
  }, [htmlCode, cssCode, jsCode, autoPreview]);

  // Initial preview when component mounts
  useEffect(() => {
    updatePreview();
  }, []);

  const updatePreview = () => {
    try {
      setError(null);
      
      // Create a complete HTML document with the user's code
      const fullHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
${cssCode}
    </style>
  </head>
  <body>
${extractBodyContent(htmlCode)}
    <script>
${jsCode}
    </script>
  </body>
</html>
      `.trim();
      
      setPreviewContent(fullHtml);
    } catch (error) {
      console.error('Error updating preview:', error);
      setError(`Preview error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
        {error ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-red-400 p-4">
            <p>{error}</p>
          </div>
        ) : (
          <iframe
            srcDoc={previewContent}
            title="Frontend Preview"
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin"
            loading="eager"
          />
        )}
      </div>
    </div>
  );
};

export default FrontendPreview;
