import React from 'react';
import { Id } from './Id';
import { Password } from './Password';
import { container, title } from './index.css';

export const FindInfoComponent = ({ type }: { type: string }) => {
  return (
    <div style={{ width: '600px' }}>
      {type === 'id' ? <Id /> : <Password />}
    </div>
  );
};
