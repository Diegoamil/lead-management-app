import React from 'react';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-gray-50 px-4 pb-20 ${className}`}>
      {children}
    </div>
  );
}