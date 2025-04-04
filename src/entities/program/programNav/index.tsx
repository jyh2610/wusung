'use client';

import { AppBar } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import {
  container,
  imgContainer,
  navBtnContainer,
  textAlign,
  userInfoContainer
} from './index.css';
import { btn } from './ui/navBtn/index.css';

export function ProgramNav() {
  const [id, setId] = useState('');

  useEffect(() => {
    const rawData = localStorage?.getItem('userInfo');
    const userInfo = rawData ? JSON.parse(rawData) : null;
    setId(userInfo?.username);
  }, []);

  return (
    <div className={container}>
      <div
        style={{
          display: 'flex',
          gap: '32px'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '127px',
            height: '57px'
          }}
        >
          <Image
            fill
            src={'/images/program-logo.png'}
            alt={'completeCheck image'}
          />
        </div>

        <div className={navBtnContainer}>
          <div className={btn}>
            <div className={imgContainer}>
              <Image fill src={'/images/navBtn1.png'} alt={'이동 버튼'} />
            </div>
            <div className={textAlign}>이달의 인지활동지</div>
          </div>
          <div className={btn}>
            <div className={imgContainer}>
              <Image fill src={'/images/navBtn2.png'} alt={'이동 버튼'} />
            </div>
            <div className={textAlign}>영역별 활동지</div>
          </div>
          <div
            className={btn}
            style={{
              backgroundColor: 'transparent',
              color: colors.gray_scale[700]
            }}
          >
            <div className={imgContainer}>
              <Image
                fill
                sizes="100%"
                src={'/images/navBtn4.png'}
                alt={'이동 버튼'}
              />
            </div>
            <div className={textAlign}>기타 자료</div>
          </div>
          <div
            className={btn}
            style={{
              backgroundColor: 'transparent',
              color: colors.gray_scale[700]
            }}
          >
            <div className={imgContainer}>
              <Image fill src={'/images/navBtn3.png'} alt={'이동 버튼'} />
            </div>
            <div className={textAlign}>사용 가이드</div>
          </div>
        </div>
      </div>

      <div className={userInfoContainer}>
        <div
          className={btn}
          style={{
            backgroundColor: 'transparent',
            color: colors.gray_scale[700]
          }}
        >
          <div className={imgContainer}>
            <Image fill src={'/images/ProfilePic.png'} alt={'프로필 썸네일'} />
          </div>
          <div className={textAlign}>{id}</div>
        </div>

        <div className={navBtnContainer}>
          <div className={btn}>
            <div className={textAlign}>사용기한 : ~2025.05.01</div>
          </div>
        </div>

        <div className={navBtnContainer}>
          <div className={btn}>
            <div className={textAlign}>프로그램 종료</div>
          </div>
        </div>
      </div>
    </div>
  );
}
