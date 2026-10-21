import type { ToastKind } from './toaster';

export default function ToastIcon({ type, className }: { type: ToastKind; className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {type === 'success' && <path d="m6 12 4 4 8-8" />}
      {type === 'warning' && <><path d="m10.3 4.4-8 13.9A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-2.7l-8-13.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></>}
      {type === 'error' && <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>}
      {type === 'info' && <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></>}
    </svg>
  );
}
