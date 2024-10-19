import React from 'react';
import { companyInfo } from '@/shared/const/Info';
import { bigFeaturesContents, smallFeaturesContents } from './const';
import {
  featuresContainer,
  boxContainer,
  bigBoxContainer,
  smallBoxContainer
} from './index.css';
import { BigBox, SmallBox } from './ui';

export function Features() {
  return (
    <div className={featuresContainer}>
      <div>
        <p>Feature</p>
        <p>{companyInfo.name}이 특별한 이유</p>
      </div>
      <div className={boxContainer}>
        <div className={bigBoxContainer}>
          {bigFeaturesContents.map(feature => (
            <BigBox key={feature.title} feature={feature} />
          ))}
        </div>
        <div className={smallBoxContainer}>
          {smallFeaturesContents.map(feature => (
            <SmallBox key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
}
