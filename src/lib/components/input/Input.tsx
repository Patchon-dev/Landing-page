import type { ComponentPropsWithRef } from 'react';
import './input.css';

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
};

export default function Input({ variant = 'primary', size = 'md', className = '', ...props }: InputProps) {
  return <input {...props} data-variant={variant} data-size={size} className={`site-input site-text-field ${className}`} />;
}
