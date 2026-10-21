import type { ReactNode } from 'react';
import ToastIcon from './ToastIcon';
import type { ToastKind } from './toaster';

type ToastContentProps = {
  type: ToastKind;
  title: ReactNode;
  description: ReactNode;
  close?: ReactNode;
};

export default function ToastContent({ type, title, description, close }: ToastContentProps) {
  return (
    <>
      <span className="site-toast-icon"><ToastIcon type={type} /></span>
      <div className="site-toast-copy">{title}{description}</div>
      {close}
    </>
  );
}
