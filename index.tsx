import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './Main';

const rootElement = document.getElementById('root');

// Crash Reporter: If root is missing, show red error
if (!rootElement) {
  document.body.innerHTML = '<div style="color:red; background:black; padding: 20px; font-family:monospace; font-size: 20px;">CRITICAL ERROR: Root element (<div id="root">) not found in index.html.</div>';
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  );
} catch (e: any) {
  // Crash Reporter: If React fails to mount, show stack trace on screen
  console.error("Mounting Error:", e);
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="color:#ef4444; background:black; height:100vh; padding: 20px; font-family:monospace; overflow:auto; z-index: 9999; position: relative;">
        <h1 style="font-size:24px; margin-bottom:10px; border-bottom: 1px solid #ef4444; padding-bottom: 10px;">SYSTEM FAILURE</h1>
        <p style="margin-bottom: 20px;">The application crashed during startup.</p>
        <div style="background:#1f2937; padding:15px; border:1px solid #ef4444; border-radius: 4px;">
          <strong style="color: #fca5a5;">Error:</strong> ${e?.message || 'Unknown Error'}
        </div>
        <pre style="margin-top:20px; opacity: 0.7; font-size: 12px; white-space:pre-wrap;">${e?.stack || ''}</pre>
      </div>
    `;
  }
}
