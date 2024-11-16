import React from 'react';
import { CustomImage } from '@/shared/ui';
import { selectTypeStyle } from './index.css';

export function SelectType({ title, logo }: { logo: string; title: string }) {
  return (
    <div className={selectTypeStyle}>
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
