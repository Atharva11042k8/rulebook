import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({ fullWidth, className = '', ...props }) => {
  return (
    <input
      className={`
        bg-zinc-900/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 
        rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500
        transition-all duration-200
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    />
  );
};