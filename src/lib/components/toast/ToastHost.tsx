import { Portal, Toast } from '@skeletonlabs/skeleton-react';
import { useTranslation } from 'react-i18next';
import ToastContent from './ToastContent';
import { getToaster, toastPlacements, toastTypes, type ToastKind } from './toaster';

export default function ToastHost() {
  const { t } = useTranslation();

  return (
    <Portal>
      {toastPlacements.map((placement) => (
        <Toast.Group key={placement} toaster={getToaster(placement)} className="site-toast-group" aria-label={t("toasters", { context: "group" })}>
          {(toast) => {
            const type: ToastKind = toastTypes.includes(toast.type as ToastKind) ? toast.type as ToastKind : 'info';
            return (
              <Toast toast={toast} key={toast.id} className="site-toast" data-kind={type}>
                <ToastContent
                  type={type}
                  title={<Toast.Title className="site-toast-title">{toast.title}</Toast.Title>}
                  description={<Toast.Description className="site-toast-description">{toast.description}</Toast.Description>}
                  close={toast.closable !== false && (
                    <Toast.CloseTrigger className="site-toast-close" aria-label={t('closeToast')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
                    </Toast.CloseTrigger>
                  )}
                />
              </Toast>
            );
          }}
        </Toast.Group>
      ))}
    </Portal>
  );
}
