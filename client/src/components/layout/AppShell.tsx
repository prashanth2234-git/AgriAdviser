import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-stone-900">
      <Navbar />
      <main className="flex-1 w-full pb-12">{children}</main>
      <Footer />
    </div>
  );
};

export const PageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}> = ({ children, className = '', maxWidth = 'xl' }) => {
  const maxWidthMap = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${maxWidthMap[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};
