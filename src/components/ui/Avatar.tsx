import React from 'react';

type AvatarProps = {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function Avatar({ name, imageUrl, size = 'md' }: AvatarProps) {
  // Get the first letter of the name
  const initial = name.charAt(0).toUpperCase();
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  
  // Generate a consistent background color based on the name
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-teal-500'
  ];
  
  // Simple hash function to get a consistent color for a name
  const getColorIndex = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % colors.length;
  };
  
  const bgColor = colors[getColorIndex(name)];
  
  return (
    <>
      {imageUrl ? (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={`${sizeClasses[size]} rounded-full ${bgColor} text-white flex items-center justify-center font-medium flex-shrink-0`}>
          {initial}
        </div>
      )}
    </>
  );
}
