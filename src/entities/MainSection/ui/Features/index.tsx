import React from 'react';
import { companyInfo } from '@/shared/const/Info';
import { Header } from '../Header';
import { bigFeaturesContents, smallFeaturesContents } from './const';
import {
  sectionContainer,
  featuresContainer,
  boxContainer,
  bigBoxContainer,
  smallBoxContainer
} from './index.css';
import { BigBox, SmallBox } from './ui';

export function Features() {
  return (
    <div className={sectionContainer}>
      <div className={featuresContainer}>
        <Header
          title={'Feature'}
          content={`${companyInfo.name}이 특별한 이유`}
        />
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
    </div>
  );
}
