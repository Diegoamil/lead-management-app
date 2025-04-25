import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
};

export function Header({ title, showBackButton = false, rightAction }: HeaderProps) {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 flex items-center">
      <div className="flex-1 flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="mr-3 p-1 rounded-full hover:bg-gray-100 active:bg-gray-200"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
}