import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`rounded-card border-input bg-surface text-foreground focus-visible:border-ring focus-visible:outline-ring w-full border px-3 py-2 text-sm transition-colors outline-none focus-visible:outline-2 ${className}`}
        {...props}
      />
    );
  },
);
