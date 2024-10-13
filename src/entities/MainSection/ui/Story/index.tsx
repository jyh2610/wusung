import React from 'react';
import {
  storyHeaderStyles,
  storyHeaderTextStyles,
  storyHeaderContentStyles,
  storyImage,
  storyContent
} from './index.css';
import Image from 'next/image';
import { BorderButton } from '@/shared/ui';

export function Story() {
  return (
    <div className={storyHeaderStyles}>
      <div>
        <p className={storyHeaderTextStyles}>Story</p>
        <span className={storyHeaderContentStyles}>
          모두가 행복한 우성인지펜
        </span>
        <div className={storyContent}>
          모두의 뇌건강을 지키고 어르신과 가족, <br />
          각 기관에서 일하시는 관리자들이 즐겁게 생활할 수 있는
          <br />
          좋은 파트너가 될 수 있도록 노력하는 우성인지펜입니다.
        </div>
        <div
          style={{
            width: '200px',
            marginTop: '36px'
          }}
        >
          <BorderButton
            content="더 알아보기"
            type="borderBrand"
            btnSize="medium"
          />
        </div>
      </div>
      <div className={storyImage}>
        <Image fill src={'/images/storyImage.png'} alt={'story image'} />
      </div>
    </div>
  );
}
