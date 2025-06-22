'use client';
import { Draggable } from '@hello-pangea/dnd';
import React from 'react';
import { activityBox, activityNumber, activityContent } from './index.css';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
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
  return (
    <TooltipProvider>
      <Draggable
        draggableId={`${number}|${content}|${thumbnailUrl}`}
        index={index}
      >
        {(provided, snapshot) => (
          <Tooltip>
            <TooltipTrigger asChild>
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
                  cursor: 'pointer',
                  ...provided.draggableProps.style // 꼭 마지막에 spreading 해야 드래그 제대로 적용됨
                }}
              >
                <span className={activityNumber}>{number}</span>
                <span className={activityContent}>{content}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              align="center"
              sideOffset={5}
              className="max-w-[320px] p-3"
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '280px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <Image
                    src={thumbnailUrl}
                    alt="thumbnail"
                    fill
                    style={{
                      borderRadius: '4px',
                      objectFit: 'contain'
                    }}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML =
                        '<span style="color: #ccc;">이미지 로드 실패</span>';
                    }}
                  />
                </div>
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    wordBreak: 'break-all',
                    lineHeight: '1.2',
                    maxWidth: '120px'
                  }}
                >
                  {content}
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </Draggable>
    </TooltipProvider>
  );
}
