'use client';
import { Draggable } from '@hello-pangea/dnd';
import React, { useRef, useState } from 'react';
import {
  activityBox,
  activityNumber,
  activityContent,
  thumbnailPopup,
  thumbnailPopupLeft
} from './index.css';
import Image from 'next/image';

interface IProps {
  number: number;
  content: string;
  index: number;
  thumbnailUrl: string;
}

export function Activity({ number, content, index, thumbnailUrl }: IProps) {
  const [showThumbnail, setShowThumbnail] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowThumbnail(true);
    }, 500); // 0.5초 뒤에 썸네일 보여줌
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setShowThumbnail(false);
  };

  return (
    <Draggable draggableId={`${number}|${content}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={activityBox}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'relative',
            zIndex: snapshot.isDragging ? 1000 : 'auto',
            backgroundColor: 'white',
            boxShadow: snapshot.isDragging
              ? '0 4px 12px rgba(0, 0, 0, 0.15)'
              : 'none',
            ...provided.draggableProps.style // 꼭 마지막에 spreading 해야 드래그 제대로 적용됨
          }}
        >
          <span className={activityNumber}>{number}</span>
          <span className={activityContent}>{content}</span>

          {showThumbnail && (
            <div
              className={index % 5 === 0 ? thumbnailPopupLeft : thumbnailPopup}
              onMouseEnter={handleMouseLeave}
            >
              <Image
                src={thumbnailUrl}
                alt="thumbnail"
                fill
                style={{
                  borderRadius: '8px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
