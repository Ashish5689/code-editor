'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Home from '../page';

export default function CodePage() {
  const router = useRouter();
  
  // Force the editor to be shown when this page is loaded
  useEffect(() => {
    // This is a client-side only effect
    const editorState = localStorage.getItem('showEditor');
    if (editorState !== 'true') {
      localStorage.setItem('showEditor', 'true');
      // Force a refresh to ensure the editor is shown
      window.location.reload();
    }
  }, []);

  // We're reusing the Home component but ensuring the editor is shown
  return <Home initialShowEditor={true} />;
}
