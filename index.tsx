import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './Main';

const rootElement = document.getElementById('root');

// Crash Reporter: If root is missing, show red error
if (!rootElement) {
  document.body.innerHTML = '<div style="color:red; background:black; padding: 20px; font-family:monospace;">CRITICAL ERROR: Root element not found.</div>';
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
  // Crash Reporter: If React fails to mount, show stack trace
  console.error("Mounting Error:", e);
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="color:#ef4444; background:black; height:100vh; padding: 20px; font-family:monospace; overflow:auto;">
        <h1 style="font-size:24px; margin-bottom:10px;">SYSTEM FAILURE</h1>
        <p>The application crashed during startup.</p>
        <pre style="background:#1f2937; padding:10px; border:1px solid #ef4444; margin-top:20px; white-space:pre-wrap;">${e?.message}\n\n${e?.stack}</pre>
      </div>
    `;
  }
}
