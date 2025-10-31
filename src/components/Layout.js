'use client';

import Navigation from './Navigation';

export default function Layout({ children }) {
  return (
    <div className="page-content">
      <Navigation />
      <main className="animate-fade-in">
        {children}
      </main>
    </div>
  );
}