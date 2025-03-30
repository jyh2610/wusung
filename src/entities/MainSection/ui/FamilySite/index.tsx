import React from 'react';
import { Header } from '../Header';
import { noticeContainer } from '../Notice/index.css';
import { Sites } from './ui';

export function FamilySite() {
  return (
    <div className={noticeContainer}>
      <Header title={'Family Site'} content={'연계기업'} />
      <div>
        <Sites />
      </div>
    </div>
  );
}
