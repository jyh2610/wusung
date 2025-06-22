'use client';
import { Draggable } from '@hello-pangea/dnd';
import React from 'react';
import { activityBox, activityNumber, activityContent } from './index.css';
import { Tooltip } from '@/shared/ui/tooltip';
import Image from 'next/image';

interface IProps {
  number: number;
  content: string;
  index: number;
  thumbnailUrl: string;
  isAdmin: boolean;
}

export function Activity({
  number,
  content,
  index,
  thumbnailUrl,
  isAdmin
}: IProps) {
  const tooltipContent = (
    <div style={{ width: '150px', height: '250px', position: 'relative' }}>
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
  );

  return (
    <Draggable
      draggableId={`${number}|${content}|${thumbnailUrl}`}
      index={index}
    >
      {(provided, snapshot) => (
        <Tooltip content={tooltipContent}>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={activityBox}
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
          </div>
        </Tooltip>
      )}
    </Draggable>
  );
}
