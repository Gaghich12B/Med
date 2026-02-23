import React from 'react';
import { SessionProvider } from 'your-session-library'; // Adjust the import based on your session library
import './globals.css'; // Import your global styles

export const metadata = {
  title: 'Your Page Title',
  description: 'Your Page Description',
};

const Layout = ({ children }) => {
  return (
    <SessionProvider>
      <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>{children}</body>
      </html>
    </SessionProvider>
  );
};

export default Layout;