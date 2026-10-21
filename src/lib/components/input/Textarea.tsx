import type { ComponentPropsWithRef } from 'react';
import './input.css';

export type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
};

export default function Textarea({ variant = 'primary', size = 'md', className = '', ...props }: TextareaProps) {
  return <textarea {...props} data-variant={variant} data-size={size} className={`site-input site-text-field site-textarea ${className}`} />;
}
