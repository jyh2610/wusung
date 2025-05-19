import React from 'react';
import { Id } from './Id';
import { Password } from './Password';
import { container, title } from './index.css';

export const FindInfoComponent = ({ type }: { type: string }) => {
  return (
    <div style={{ width: '600px' }}>
      <div className={title}>
        {type === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
      </div>
      <div className={container}>{type === 'id' ? <Id /> : <Password />}</div>
    </div>
  );
};
