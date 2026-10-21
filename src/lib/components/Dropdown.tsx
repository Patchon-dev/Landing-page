import { Fragment, useRef, useState } from 'react';
import { Menu, Portal } from '@skeletonlabs/skeleton-react';
import useMobile from '../hooks/useMobile';

type DropdownProps<T extends string | number> = {
  id: string;
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
};

export default function Dropdown<T extends string | number>({ id, label, value, options, onChange, name, disabled = false, className = '' }: DropdownProps<T>) {
  const isMobile = useMobile();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement>();
  function selectValue(selected: string) {
    if (disabled || trigger.current?.matches(':disabled')) return;
    const option = options.find((option) => String(option.value) === selected);
    if (option) onChange(option.value);
  }

  if (isMobile) {
    return (
      <select id={id} name={name} disabled={disabled} aria-label={label} className={`component-control-input component-native-select ${className}`} value={value} onChange={(event) => selectValue(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    );
  }

  return (
    <>
      <Menu ids={{ trigger: id }} open={open && !disabled} onOpenChange={({ open: next }) => {
        if (next && (disabled || trigger.current?.matches(':disabled'))) return;
        if (next) setPortalTarget(trigger.current?.closest<HTMLElement>('[data-scope="dialog"][data-part="content"]') ?? undefined);
        setOpen(next);
      }} positioning={{ placement: 'bottom-start', sameWidth: true, gutter: 6, strategy: 'fixed' }} onSelect={({ value: selected }) => selectValue(selected)}>
        <Menu.Trigger ref={trigger} type="button" disabled={disabled} aria-label={label} className={`component-control-input component-menu-trigger ${className}`}>
          <span className="component-menu-value">{options.find((option) => option.value === value)?.label}</span>
          <svg className="component-menu-chevron" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </Menu.Trigger>
        <Portal target={portalTarget}>
          <Menu.Positioner className="component-menu-positioner">
            <Menu.Content aria-label={label} className="component-menu-content">
              {options.map((option) => (
                <Fragment key={option.value}>
                  <Menu.OptionItem value={String(option.value)} type="radio" checked={option.value === value} className="component-menu-item">
                    <Menu.ItemText>{option.label}</Menu.ItemText>
                    <Menu.ItemIndicator>
                      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4 10-10" /></svg>
                    </Menu.ItemIndicator>
                  </Menu.OptionItem>
                </Fragment>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu>
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
    </>
  );
}
