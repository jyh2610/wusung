'use client';

import { useSearchParams } from 'next/navigation';

export function useIsFree() {
  const searchParams = useSearchParams();
  const entryMode = searchParams.get('entrymode');
  return entryMode === 'free';
}
