'use client';

import { useState } from 'react';
import { bannerStyle, bannerHeaderStyles } from './index.css';
import { Login } from './ui';
import { BeforeLogIn } from './ui/Login/BeforeLogIn';
import { ImageSlider } from '@/shared/ui';

export function MainBanner() {
  const images = [
    '/images/banner1.png',
    '/images/banne.',
    '/images/banner1.png'
  ];
  // 인덱스 상태 (초기값 1)
  const [sliderIndex, setSliderIndex] = useState(1);

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
