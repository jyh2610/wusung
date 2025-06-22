'use client';

import { ReactNode, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode | string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({
  children,
  content,
  placement = 'bottom'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const margin = 10;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
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

  useLayoutEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewWidth = document.documentElement.clientWidth;
      const viewHeight = document.documentElement.clientHeight;

      let left: number;
      let top: number;

      switch (placement) {
        case 'top':
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          top = triggerRect.top - tooltipRect.height - margin;
          break;
        case 'right':
          left = triggerRect.right + margin;
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
        case 'left':
          left = triggerRect.left - tooltipRect.width - margin;
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
        case 'bottom':
        default:
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          top = triggerRect.bottom + margin;

          // ↓↓↓ 화면 아래에 가려질 경우 위로 올림
          if (top + tooltipRect.height > viewHeight - margin) {
            top = triggerRect.top - tooltipRect.height - margin;
          }
          break;
      }

      // 최종 위치 화면 범위 내로 제한
      if (top < margin) {
        top = margin;
      }
      if (top + tooltipRect.height > viewHeight - margin) {
        top = viewHeight - tooltipRect.height - margin;
      }
      if (left < margin) {
        left = margin;
      }
      if (left + tooltipRect.width > viewWidth - margin) {
        left = viewWidth - tooltipRect.width - margin;
      }

      setPosition({
        x: left + window.scrollX,
        y: top + window.scrollY
      });
    } else {
      setPosition({ x: -9999, y: -9999 });
    }
  }, [isVisible, content, placement]);

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
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
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
              wordBreak: 'break-word',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              whiteSpace: 'pre-line', // 줄바꿈을 시각적으로 보이게
              ...(position.x === -9999 && { visibility: 'hidden' })
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
