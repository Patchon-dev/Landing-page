import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react';
import { Dialog, Portal } from '@skeletonlabs/skeleton-react';
import { useTranslation } from 'react-i18next';
import './modal.css';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSuccess: (data: FormData) => void | Promise<void>;
  onCancel: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  submitLabel?: string;
  cancelLabel?: string;
}

type ModalFormProps = ModalProps & { busyRef: RefObject<boolean> };

/** A fresh form session per opening also isolates late async responses. */
function ModalForm({ title, description, children, onSuccess, onCancel, onOpenChange, variant = 'primary', submitLabel, cancelLabel, busyRef }: ModalFormProps) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      busyRef.current = false;
    };
  }, [busyRef]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    const data = new FormData(event.currentTarget);
    busyRef.current = true;
    setPending(true);
    setFailed(false);
    try {
      await onSuccess(data);
      if (active.current) onOpenChange(false);
    } catch {
      if (active.current) setFailed(true);
    } finally {
      if (active.current) {
        busyRef.current = false;
        setPending(false);
      }
    }
  }

  return (
    <form className="modal-form" onSubmit={(event) => { void submit(event); }} aria-busy={pending}>
      <header className="modal-header">
        <div className="modal-heading">
          <Dialog.Title className="modal-title">{title}</Dialog.Title>
          {description && <Dialog.Description className="modal-description">{description}</Dialog.Description>}
        </div>
        <Dialog.CloseTrigger type="button" className="modal-close" aria-label={t('modalClose')} disabled={pending}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </Dialog.CloseTrigger>
      </header>
      <div className="modal-body">
        <fieldset className="modal-fields" disabled={pending}>{children}</fieldset>
        {failed && <p role="alert" className="modal-error">{t('modalSubmitError')}</p>}
      </div>
      <footer className="modal-footer">
        <button type="button" className="site-button" data-variant="outline" disabled={pending} onClick={onCancel}>{cancelLabel ?? t('cancel')}</button>
        <button type="submit" className="site-button" data-variant={variant} disabled={pending}>
          {pending && <span className="modal-spinner" aria-hidden="true" />}
          <span>{pending ? t('modalSubmitting') : submitLabel ?? t('modalConfirm')}</span>
        </button>
      </footer>
    </form>
  );
}

/** Closing with X, Escape, backdrop or Cancel invokes onCancel once. */
export default function Modal(props: ModalProps) {
  const busyRef = useRef(false);
  const { open, onOpenChange, onCancel } = props;

  function cancel() {
    if (busyRef.current) return;
    onCancel();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={({ open: next }) => {
      if (busyRef.current) return;
      if (!next) cancel();
      else onOpenChange(next);
    }} onEscapeKeyDown={(event) => { if (busyRef.current) event.preventDefault(); }}
      onInteractOutside={(event) => { if (busyRef.current) event.preventDefault(); }}>
      <Portal>
        <Dialog.Backdrop className="modal-backdrop" />
        <Dialog.Positioner className="modal-positioner">
          <Dialog.Content className="modal-panel" data-size={props.size ?? 'md'}>
            {open && <ModalForm {...props} onCancel={cancel} busyRef={busyRef} />}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog>
  );
}
