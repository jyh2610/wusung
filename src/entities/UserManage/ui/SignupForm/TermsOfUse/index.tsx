import Image from 'next/image';
import React from 'react';
import { inputContainer } from '../index.css';
import {
  iconSize,
  labelContainer,
  selectBox,
  selectContainer
} from './index.css';

export function TermsOfUse() {
  return (
    <div className={inputContainer}>
      <div className={selectContainer}>
        <div className={labelContainer}>
          <span>이용약관동의</span>
        </div>
        <div>
          <div className={selectBox}>
            <div className={iconSize}>
              <Image fill src={'/images/check_circle.png'} alt={'확인아이콘'} />
            </div>
            <span>전체 동의</span>
          </div>
          <div className={selectBox}>
            <div className={iconSize}>
              <Image fill src={'/images/check_circle.png'} alt={'확인아이콘'} />
            </div>
            <div>
              <span>이용약관 동의 (필수)</span>

              <span></span>
            </div>
          </div>
          <div className={selectBox}>
            <div className={iconSize}>
              <Image fill src={'/images/check_circle.png'} alt={'확인아이콘'} />
            </div>
            <div>
              <span>개인정보 처리방침 동의 (필수)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
