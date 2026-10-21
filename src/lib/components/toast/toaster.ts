import { createToaster } from "@skeletonlabs/skeleton-react";

export const toastTypes = ["success", "warning", "error", "info"] as const;
export type ToastKind = (typeof toastTypes)[number];
export const toastPlacements = [
  "top-start",
  "top",
  "top-end",
  "bottom-start",
  "bottom",
  "bottom-end",
] as const;
export type ToastPlacement = (typeof toastPlacements)[number];

// Each position owns its queue, so existing notifications keep their timers.
const toasters = new Map<ToastPlacement, ReturnType<typeof createToaster>>();

export function getToaster(placement: ToastPlacement = "top-end") {
  let instance = toasters.get(placement);
  if (!instance) {
    instance = createToaster({
      placement,
      offsets: { top: "1.5rem", right: "1rem", bottom: "1.5rem", left: "1rem" },
      max: 4,
      gap: 14,
      duration: 6000,
      overlap: false,
      pauseOnPageIdle: true,
    });
    toasters.set(placement, instance);
  }
  return instance;
}

// Keep the default API available to existing callers.
export const toaster = getToaster();

export function clearToasts() {
  for (const instance of toasters.values()) instance.remove();
}
