'use client';

import { usePathname } from 'next/navigation';

export function useIsAdmin() {
  const pathname = usePathname();
  return pathname.startsWith('/admin');
}
