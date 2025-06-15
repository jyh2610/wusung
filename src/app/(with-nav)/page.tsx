'use client';

import { MainBanner, LineBanner, MainSection } from '@/entities';
import { MainStyles } from './style.css';
import { FloatingBar } from '@/entities/MainBanner/ui/FloatingBar';
import { NoticePopupWrapper } from '@/components/NoticePopupWrapper';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { getMainBanner } from '@/entities/MainBanner/api';

export default function Home() {
  const searchParams = useSearchParams();

  const { data: bannerData, isLoading: isBannerLoading } = useQuery({
    queryKey: ['mainBanner', 'slide_banner'],
    queryFn: () => getMainBanner('slide_banner')
  });

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
        <MainBanner bannerData={bannerData} isLoading={isBannerLoading} />
        {!isBannerLoading && (
          <>
            <LineBanner />
            <MainSection />
            <FloatingBar />
          </>
        )}
      </section>
    </main>
  );
}
