import { useSyncExternalStore } from 'react';

const mobileQuery = '(max-width: 767px), (hover: none) and (pointer: coarse)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

export default function useMobile() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(mobileQuery).matches, () => false);
}
