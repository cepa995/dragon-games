import { forwardRef } from 'react';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = '', ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`rounded-card border-input bg-surface text-foreground focus-visible:border-ring focus-visible:outline-ring w-full border px-3 py-2 text-sm transition-colors outline-none focus-visible:outline-2 ${className}`}
      {...props}
    />
  );
});
