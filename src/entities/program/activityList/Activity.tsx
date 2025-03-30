import { Draggable } from '@hello-pangea/dnd';
import React from 'react';
import { activityBox, activityNumber, activityContent } from './index.css';

interface IProps {
  number: number;
  content: string;
  index: number;
}

export function Activity({ number, content, index }: IProps) {
  return (
    <Draggable draggableId={`${number}|${content}`} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={activityBox}
        >
          <span className={activityNumber}>{number}</span>
          <span className={activityContent}>{content}</span>
        </div>
      )}
    </Draggable>
  );
}
