import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({ label, error, className = '', ...props }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-syne font-medium text-dark-blue">{label}</label>
      <input
        className={`w-full border rounded-xl px-4 py-3 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-orange-400 ${error ? 'border-red-400' : 'border-gray-200'} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
