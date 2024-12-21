import React from 'react';
import { CustomImage } from '@/shared/ui';
import { selectTypeStyle, selectedStyle } from './index.css';

export function SelectType({
  title,
  logo,
  onClick,
  selected
}: {
  logo: string;
  title: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <div
      className={`${selectTypeStyle} ${selected ? selectedStyle : ''}`}
      onClick={onClick}
    >
      <div
        style={{
          position: 'relative',
          width: '40px',
          height: '40px'
        }}
      >
        <CustomImage src={logo} alt={logo} />
      </div>
      <span>{title}</span>
    </div>
  );
}
