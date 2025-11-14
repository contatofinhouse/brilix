
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
      <HelmetProvider>
    <LanguageProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </LanguageProvider>
     </HelmetProvider>
  </React.StrictMode>
);