import type { ComponentPropsWithRef } from 'react';

export type SwitchProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'onChange' | 'onClick' | 'role' | 'aria-checked' | 'type'> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export default function Switch({ checked, onCheckedChange, className = '', ...props }: SwitchProps) {
  return <button {...props} type="button" role="switch" aria-checked={checked} onClick={() => onCheckedChange(!checked)} className={`component-toggle ${className}`}>
    <span className="component-toggle-thumb" aria-hidden="true" />
  </button>;
}
