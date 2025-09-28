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
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore, useFreeCountStore } from '@/shared/stores';
import { useIsFree } from '@/components/hooks/useIsFree';
import { FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
export function ProgramNav() {
  const { username, checkAuthentication, endDate } = useAuthStore();
  const isFree = useIsFree();

  // Zustand 스토어에서 상태와 액션들을 가져옴
  const { usedCount, isStillTrial, fetchFreeCount, calculateIsStillTrial } =
    useFreeCountStore();

  useEffect(() => {
    calculateIsStillTrial(isFree);
  }, [isFree, usedCount, calculateIsStillTrial]);

  useEffect(() => {
    checkAuthentication();
    fetchFreeCount();
  }, [checkAuthentication, fetchFreeCount]);

  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname using usePathname()
  const searchParams = useSearchParams(); // Get current search params

  const getButtonStyle = (route: string) => {
    return pathname === route
      ? {} // No background color change for the selected button
      : {
          backgroundColor: 'transparent',
          color: colors.gray_scale[700]
        }; // Apply transparent background for non-selected buttons
  };

  const handleLockedMenuClick = () => {
    toast.info('유료 회원만 이용 가능한 서비스입니다.');
  };

  // 쿼리 파라미터를 유지하면서 라우팅하는 함수
  const navigateWithParams = (path: string) => {
    const currentParams = searchParams.toString();
    const url = currentParams ? `${path}?${currentParams}` : path;
    router.push(url);
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
            cursor: 'pointer',
            height: '57px'
          }}
          onClick={() => router.push('/')}
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
            onClick={() => navigateWithParams('/program')}
            style={getButtonStyle('/program')}
          >
            <div className={imgContainer}>
              <Image fill src={'/images/navBtn1.png'} alt={'이동 버튼'} />
            </div>
            <div className={textAlign}>이달의 인지활동지</div>
          </div>
          <div
            className={btn}
            onClick={() => navigateWithParams('/program/activity')}
            style={getButtonStyle('/program/activity')}
          >
            <div className={imgContainer}>
              <Image fill src={'/images/navBtn2.png'} alt={'이동 버튼'} />
            </div>
            <div className={textAlign}>개별 활동지</div>
          </div>

          <div
            className={btn}
            onClick={() =>
              isFree
                ? handleLockedMenuClick()
                : navigateWithParams('/program/etc')
            }
            style={getButtonStyle('/program/etc')}
          >
            <div className={imgContainer}>
              {isFree ? (
                <FaLock size={24} color={colors.gray_scale[500]} />
              ) : (
                <Image
                  fill
                  sizes="100%"
                  src={'/images/navBtn4.png'}
                  alt={'이동 버튼'}
                />
              )}
            </div>
            <div className={textAlign}>기타 자료</div>
          </div>

          <div
            className={btn}
            onClick={() =>
              isFree
                ? handleLockedMenuClick()
                : navigateWithParams('/program/evaluation')
            }
            style={getButtonStyle('/program/evaluation')}
          >
            <div className={imgContainer}>
              {isFree ? (
                <FaLock size={24} color={colors.gray_scale[500]} />
              ) : (
                <Image fill src={'/images/navBtn4.png'} alt={'이동 버튼'} />
              )}
            </div>
            <div className={textAlign}>평가자료</div>
          </div>

          <div
            className={btn}
            onClick={() => navigateWithParams('/program/guide')}
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
            color: colors.gray_scale[700],
            cursor: 'default'
          }}
        >
          <div className={imgContainer}>
            <Image fill src={'/images/ProfilePic.png'} alt={'프로필 썸네일'} />
          </div>
          <div className={textAlign}>{username}</div>
        </div>

        {isFree ? (
          <div className={btn} style={{ cursor: 'default' }}>
            <div className={textAlign}>
              사용 횟수 : {usedCount?.usedCount} / {usedCount?.totalCount}
            </div>
          </div>
        ) : (
          <div className={navBtnContainer}>
            <div className={btn} style={{ cursor: 'default' }}>
              <div className={textAlign}>사용기한 : {endDate}</div>
            </div>
          </div>
        )}
        <div className={navBtnContainer}>
          <div className={btn} onClick={() => router.push('/')}>
            <div className={textAlign}>프로그램 종료</div>
          </div>
        </div>
      </div>
    </div>
  );
}
