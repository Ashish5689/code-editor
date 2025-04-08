'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/solid';

interface FrontendPreviewProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

const FrontendPreview = ({ htmlCode, cssCode, jsCode }: FrontendPreviewProps) => {
  const [previewContent, setPreviewContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update preview when code changes
  useEffect(() => {
    updatePreview();
  }, [htmlCode, cssCode, jsCode]);

  // Initial preview when component mounts
  useEffect(() => {
    updatePreview();
    
    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleFullscreenChange = () => {
    setIsFullScreen(!!document.fullscreenElement);
  };

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

  const toggleFullScreen = async () => {
    try {
      if (!isFullScreen) {
        // Enter fullscreen
        if (containerRef.current) {
          if (containerRef.current.requestFullscreen) {
            await containerRef.current.requestFullscreen();
          } else if ((containerRef.current as any).webkitRequestFullscreen) {
            await (containerRef.current as any).webkitRequestFullscreen();
          } else if ((containerRef.current as any).msRequestFullscreen) {
            await (containerRef.current as any).msRequestFullscreen();
          }
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col h-full overflow-hidden`}
    >
      <div className={`flex-1 w-full glass-dark rounded-lg shadow-lg overflow-hidden border border-gray-700/30`}>
        {error ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-red-400 p-4">
            <p>{error}</p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            srcDoc={previewContent}
            title="Frontend Preview"
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin"
            loading="eager"
          />
        )}
      </div>
      
      {/* Single fullscreen icon in the top right corner */}
      <button
        onClick={toggleFullScreen}
        className="absolute top-2 right-2 bg-gray-800/70 text-white p-1.5 rounded-md shadow-lg hover:bg-gray-700 transition-colors z-10"
        aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
      >
        {isFullScreen ? (
          <ArrowsPointingInIcon className="h-5 w-5" />
        ) : (
          <ArrowsPointingOutIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default FrontendPreview;
