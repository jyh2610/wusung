import React from 'react';
import { activityBox, activityNumber, activityContent } from './index.css';

interface IProps {
  number: number;
  content: string;
}

export function Activity({ number, content }: IProps) {
  return (
    <div className={activityBox}>
      <span className={activityNumber}>{number}</span>
      <span className={activityContent}>{content}</span>
    </div>
  );
}
