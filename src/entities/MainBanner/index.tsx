'use client';

import { useState } from 'react';
import { bannerStyle, bannerHeaderStyles } from './index.css';
import { Login } from './ui';
import { ImageSlider } from '@/shared/ui';
import type { IMainBannerResponse } from './api';
import { BannerSkeleton } from './ui/BannerSkeleton';
import { ApiResponse } from '@/shared/type';

interface MainBannerProps {
  bannerData: ApiResponse<IMainBannerResponse[]> | null | undefined;
  isLoading: boolean;
}

export function MainBanner({ bannerData, isLoading }: MainBannerProps) {
  const [sliderIndex, setSliderIndex] = useState(1);

  if (isLoading) {
    return <BannerSkeleton />;
  }

  if (!bannerData?.data) {
    return null;
  }

  const images = bannerData.data.map(
    (banner: IMainBannerResponse) => banner.url
  );

  return (
    <div className={bannerStyle}>
      <ImageSlider
        images={images}
        index={sliderIndex}
        onIndexChange={setSliderIndex}
      />
      <div className={bannerHeaderStyles}>모두가 즐거운 우성인지펜</div>
      <Login />
    </div>
  );
}
