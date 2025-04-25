import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
  disabled?: boolean;
};

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  onClick,
  type = 'button',
  icon,
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 transform active:scale-98 focus:outline-none';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
    outline: 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-50 active:bg-gray-100',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}