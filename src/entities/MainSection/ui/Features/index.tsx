import React from 'react';
import { featuresContainer } from './index.css';
import { companyInfo } from '@/shared/const/Info';

export function Features() {
  return (
    <div className={featuresContainer}>
      <div>
        <p>Feature</p>
        <p>{companyInfo.name}이 특별한 이유</p>
      </div>
      <div></div>
    </div>
  );
}
