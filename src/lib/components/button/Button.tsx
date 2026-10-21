import type { ComponentPropsWithRef } from 'react';
import { Link } from 'react-router-dom';
import './button.css';

type ButtonStyle = {
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'gradient-secondary' | 'border-gradient' | 'border-gradient-secondary';
  size?: 'sm' | 'md' | 'lg';
};
export type ButtonProps = ButtonStyle & (
  | (ComponentPropsWithRef<'button'> & { to?: never })
  | (ComponentPropsWithRef<typeof Link> & { to: ComponentPropsWithRef<typeof Link>['to'] })
);

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const styles = { className: `site-button ${className}`, 'data-variant': variant, 'data-size': size };
  if ('to' in props && props.to !== undefined) return <Link {...props} {...styles} />;
  return <button type="button" {...props as ComponentPropsWithRef<'button'>} {...styles} />;
}
