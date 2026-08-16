import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'blue' | 'zinc' | 'amber' | 'rose';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'zinc',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    zinc: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/50',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
