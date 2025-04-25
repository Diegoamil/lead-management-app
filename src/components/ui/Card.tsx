import React from 'react';

type CardProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function Card({ children, onClick, className = '' }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm p-4 transition-all duration-200 border border-gray-300 ${onClick ? 'cursor-pointer active:bg-gray-50' : ''} ${className}`}
    >
      {children}
    </div>
  );
}