import React from 'react';
import { controlContainer, buttonStyle } from './index.css';
import { LuUndo2, LuRedo2 } from 'react-icons/lu';
import { IoReload } from 'react-icons/io5';
export function Control() {
  const date = new Date();
  const month = date.getMonth() + 1;

  return (
    <div className={controlContainer}>
      <button className={buttonStyle} type="button">
        <LuUndo2 size={24} />
        실행 취소
      </button>
      <button className={buttonStyle} type="button">
        <LuRedo2 size={24} />
        실행 복구
      </button>
      <button className={buttonStyle} type="button">
        <IoReload size={24} />
        초기화
      </button>
      <button className={buttonStyle} type="button">
        {month}월 계획안 불러오기
      </button>
    </div>
  );
}
