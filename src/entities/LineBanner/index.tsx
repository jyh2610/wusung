import React from 'react';
import { colors } from '@/design-tokens';
import { VerticalLine } from '@/shared/ui/VerticalLine';
import { mainLineBannerData } from './const';
import { LineBannerStyles } from './index.css';
import { LineBannerContent } from './ui/LineBannerContent';

export function LineBanner() {
  return (
    <div className={LineBannerStyles}>
      {mainLineBannerData.map((data, index) => (
        <React.Fragment key={index}>
          <LineBannerContent content={data.content} link={data.link} />
          {index < mainLineBannerData.length - 1 && (
            <VerticalLine
              height="78px"
              thickness="1px"
              color={colors.brand[100]}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
