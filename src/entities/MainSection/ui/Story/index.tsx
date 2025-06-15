'use client';

import Image from 'next/image';
import React from 'react';
import { companyInfo } from '@/shared/const/Info';
import { BorderButton } from '@/shared/ui';
import { Header } from '../Header';
import { storyHeaderStyles, storyImage, storyContent } from './index.css';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getMainBanner } from '@/entities/MainBanner/api';

export function Story() {
  const router = useRouter();

  const { data: bannerData, isLoading } = useQuery({
    queryKey: ['story_banner'],
    queryFn: () => getMainBanner('story_banner')
  });

  const storyImageUrl = bannerData?.data?.[0]?.url || '/images/storyImage.png';

  return (
    <div className={storyHeaderStyles}>
      <div>
        <Header title={'Story'} content={`모두가 행복한 ${companyInfo.name}`} />
        <div className={storyContent}>
          모두의 뇌건강을 지키고 어르신과 가족, <br />
          각 기관에서 일하시는 관리자들이 즐겁게 생활할 수 있는
          <br />
          좋은 파트너가 될 수 있도록 노력하는 우성인지펜입니다.
        </div>
        <div
          style={{
            width: '200px',
            height: '49px',
            marginTop: '36px'
          }}
        >
          <BorderButton
            onClick={() => {
              router.push('/program/guide');
            }}
            content="더 알아보기"
            type="borderBrand"
            btnSize="medium"
          />
        </div>
      </div>
      <div className={storyImage}>
        <Image
          fill
          src={storyImageUrl}
          alt={'story image'}
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
