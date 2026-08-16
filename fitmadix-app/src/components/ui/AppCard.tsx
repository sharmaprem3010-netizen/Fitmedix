import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'glass' | 'gradient' | 'bordered';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'dark',
  onClick,
}) => {
  const variantStyles = {
    dark: 'bg-zinc-950 border border-zinc-800 text-white',
    glass: 'bg-zinc-900/60 backdrop-blur-md border border-zinc-800 text-white',
    gradient: 'bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 text-white',
    bordered: 'bg-black border border-zinc-800 text-white',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 transition-all ${variantStyles[variant]} ${onClick ? 'cursor-pointer hover:border-zinc-700 active:scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
