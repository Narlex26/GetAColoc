import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <p className="font-syne font-bold text-dark-blue text-lg mb-2">{title}</p>
      {description && <p className="text-gray-500 text-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
