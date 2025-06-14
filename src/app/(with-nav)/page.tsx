'use client';

import { MainBanner, LineBanner, MainSection } from '@/entities';
import { MainStyles } from './style.css';
import { FloatingBar } from '@/entities/MainBanner/ui/FloatingBar';
import { NoticePopupWrapper } from '@/components/NoticePopupWrapper';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const toastMessage = searchParams.get('toast');
    if (toastMessage) {
      const decodedMessage = decodeURIComponent(toastMessage);
      toast.info(decodedMessage);
    }
  }, [searchParams]);

  return (
    <main className={MainStyles}>
      <NoticePopupWrapper />
      <section>
        <MainBanner />
        <LineBanner />
      </section>
      <MainSection />
      <FloatingBar />
    </main>
  );
}
