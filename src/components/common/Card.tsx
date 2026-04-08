import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseStyles = 'rounded-3xl border';
  const variantStyles = {
    default: 'border-gray-300 bg-white',
    dark: 'border-gray-300 bg-dark-blue text-white',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
