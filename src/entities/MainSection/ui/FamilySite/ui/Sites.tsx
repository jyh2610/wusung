'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CustomImage } from '@/shared/ui';
import { VerticalLine } from '@/shared/ui/VerticalLine';
import { siteInfo } from '../const';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  companyContainer,
  companyStyle,
  contentStyle,
  imageContainerStyle,
  siteStyle,
  titleStyle
} from './index.css';

export function Sites() {
  const [current, setCurrent] = useState(0);
  const total = siteInfo.length;
  const perSlide = 2;
  const maxIndex = Math.max(0, Math.ceil(total / perSlide) - 1);

  if (total === 0) return null;

  const goPrev = () => {
    if (current === 0) setCurrent(maxIndex);
    else setCurrent(current - 1);
  };
  const goNext = () => {
    if (current === maxIndex) setCurrent(0);
    else setCurrent(current + 1);
  };

  // 슬라이드에 보여줄 데이터 2개씩
  const start = current * perSlide;
  const end = start + perSlide;
  const slideData = siteInfo.slice(start, end);

  // 페이지네이션 점 개수
  const pageCount = maxIndex + 1;

  return (
    <div
      className={siteStyle}
      style={{ position: 'relative', justifyContent: 'center' }}
    >
      {/* 왼쪽 화살표 */}
      <button
        onClick={goPrev}
        style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 32,
          zIndex: 2
        }}
        aria-label="이전 기업"
      >
        <IoIosArrowBack />
      </button>
      {/* 기업 카드 2개씩 */}
      {slideData.map((data, idx) => (
        <Company
          key={start + idx}
          title={data.title}
          content={data.content}
          src={data.image}
          link={data.link}
          alt={data.alt}
        />
      ))}
      {/* 오른쪽 화살표 */}
      <button
        onClick={goNext}
        style={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 32,
          zIndex: 2
        }}
        aria-label="다음 기업"
      >
        <IoIosArrowForward />
      </button>
      {/* 페이지네이션 점 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 16,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 3
        }}
      >
        {Array.from({ length: pageCount }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: 'none',
              margin: '0 4px',
              background: current === idx ? '#e1007b' : '#ddd',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            aria-label={`슬라이드 ${idx + 1}번으로 이동`}
          />
        ))}
      </div>
    </div>
  );
}

export function Company({
  title,
  content,
  src,
  alt,
  link
}: {
  title: string;
  content: string;
  src: string;
  alt: string;
  link: string;
}) {
  return (
    <Link
      className={companyStyle}
      href={link}
      target={link ? '_blank' : undefined}
    >
      <div className={companyContainer}>
        <div>
          <p className={titleStyle}>{title}</p>
          <p className={contentStyle}>
            {content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className={imageContainerStyle}>
          <CustomImage src={src} alt={alt} />
        </div>
      </div>
    </Link>
  );
}
