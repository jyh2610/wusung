'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode | string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 375; // 툴팁의 예상 너비
    const tooltipHeight = 375; // 툴팁의 예상 높이

    let x = rect.left + window.scrollX;
    let y = rect.bottom + window.scrollY + 20; // 위치를 더 아래로 조정

    // 화면 오른쪽 끝을 벗어나는 경우 왼쪽으로 조정
    if (x + tooltipWidth > window.innerWidth) {
      x = rect.right + window.scrollX - tooltipWidth;
    }

    // 화면 아래쪽 끝을 벗어나는 경우 위쪽으로 조정
    if (y + tooltipHeight > window.innerHeight + window.scrollY) {
      y = rect.top + window.scrollY - tooltipHeight - 25; // 위쪽으로 이동할 때도 간격 조정
    }

    setPosition({ x, y });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100); // 100ms 지연으로 깜빡임 방지
  };

  const handleTooltipMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              zIndex: 1000,
              maxWidth: '250px',
              minWidth: '150px',
              wordBreak: 'break-all',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
