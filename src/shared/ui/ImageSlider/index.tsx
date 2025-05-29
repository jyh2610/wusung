'use client';

import React, { useEffect, useRef, useState } from 'react';
import { sliderWrapper, slideImg, slider } from './index.css';

interface ImageSliderProps {
  images: string[];
  index: number;
  onIndexChange?: (newIndex: number) => void;
}

export const ImageSlider = ({
  images,
  index,
  onIndexChange
}: ImageSliderProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const totalImages = [images[images.length - 1], ...images, images[0]];

  // 트랜지션 및 무한루프 처리
  useEffect(() => {
    if (!slideRef.current) return;

    slideRef.current.style.transition = 'transform 0.3s ease-in-out';
    slideRef.current.style.transform = `translateX(-${index * 100}%)`;

    const handleTransitionEnd = () => {
      if (index === totalImages.length - 1) {
        if (!slideRef.current) return;
        slideRef.current.style.transition = 'none';
        if (onIndexChange) onIndexChange(1);
        slideRef.current.style.transform = `translateX(-100%)`;
      } else if (index === 0) {
        if (!slideRef.current) return;
        slideRef.current.style.transition = 'none';
        if (onIndexChange) onIndexChange(totalImages.length - 2);
        slideRef.current.style.transform = `translateX(-${(totalImages.length - 2) * 100}%)`;
      }
    };

    const refCurrent = slideRef.current;
    refCurrent.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      refCurrent.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [index, totalImages.length, onIndexChange]);

  return (
    <div
      className={sliderWrapper}
      style={{
        position: 'absolute',
        width: '1920px',
        height: '700px',
        backgroundSize: 'cover',
        backgroundPosition: 'left',
        overflow: 'hidden',
        borderTopLeftRadius: '120px',
        borderBottomLeftRadius: '120px',
        zIndex: 0
      }}
    >
      <div
        className={slider}
        ref={slideRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex'
        }}
      >
        {totalImages.map((src, i) => (
          <img
            key={i}
            src={src}
            className={slideImg}
            alt={`slide-${i}`}
            style={{
              width: '1920px',
              height: '700px',
              objectFit: 'cover',
              borderTopLeftRadius: '120px',
              borderBottomLeftRadius: '120px',
              flexShrink: 0
            }}
          />
        ))}
      </div>
      {/* 네비게이션 버튼 */}
      <div
        style={{
          position: 'absolute',
          left: '15%',
          bottom: 32,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 10
        }}
      >
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => onIndexChange?.(i + 1)}
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: 'none',
              background: index === i + 1 ? '#e1007b' : '#ddd',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            aria-label={`배너 ${i + 1}번으로 이동`}
          />
        ))}
      </div>
    </div>
  );
};
