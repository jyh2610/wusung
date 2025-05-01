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
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export function ProgramNav() {
  const { username } = useAuthStore(state => ({
    username: state.username
  }));
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname using usePathname()

  const getButtonStyle = (route: string) => {
    return pathname === route
      ? {} // No background color change for the selected button
      : {
          backgroundColor: 'transparent',
          color: colors.gray_scale[700]
        }; // Apply transparent background for non-selected buttons
  };

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
          <div
            className={btn}
            onClick={() => router.push('/program')}
            style={getButtonStyle('/program')}
          >
            <div className={imgContainer}>
              <Image fill src={'/images/navBtn1.png'} alt={'이동 버튼'} />
            </div>
            <div className={textAlign}>이달의 인지활동지</div>
          </div>
          <div
            className={btn}
            onClick={() => router.push('/program/activity')}
            style={getButtonStyle('/program/activity')}
          >
            <div className={imgContainer}>
              <Image fill src={'/images/navBtn2.png'} alt={'이동 버튼'} />
            </div>
            <div className={textAlign}>개별 활동지</div>
          </div>

          <div
            className={btn}
            onClick={() => router.push('/program/evaluation')}
            style={getButtonStyle('/program/evaluation')}
          >
            <div className={imgContainer}>
              <Image fill src={'/images/navBtn4.png'} alt={'이동 버튼'} />
            </div>
            <div className={textAlign}>평가자료</div>
          </div>

          <div
            className={btn}
            onClick={() => router.push('/program/etc')}
            style={getButtonStyle('/program/etc')}
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
            onClick={() => router.push('/program/guide')}
            style={getButtonStyle('/program/guide')}
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
          <div className={textAlign}>{username}</div>
        </div>

        <div className={navBtnContainer}>
          <div className={btn}>
            <div className={textAlign}>사용기한 : ~2025.05.01</div>
          </div>
        </div>

        <div className={navBtnContainer}>
          <div className={btn} onClick={() => router.push('/')}>
            <div className={textAlign}>프로그램 종료</div>
          </div>
        </div>
      </div>
    </div>
  );
}
