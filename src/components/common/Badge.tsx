interface BadgeProps {
  children: string;
  className?: string;
  variant?: 'light' | 'medium';
}

export default function Badge({ children, className = '', variant = 'light' }: BadgeProps) {
  const baseStyles = 'inline-block px-4 py-2 rounded-4xl text-xs font-syne font-medium uppercase';
  const variantStyles = {
    light: 'border border-blue-300 bg-blue-100 text-dark-blue',
    medium: 'border border-blue-300 bg-blue-200 text-dark-blue',
  };

  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</div>;
}
