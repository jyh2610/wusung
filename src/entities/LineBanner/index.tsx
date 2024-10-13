import { VerticalLine } from '@/shared/ui/VerticalLine';
import { mainLineBannerData } from './const';
import { LineBannerStyles } from './index.css';
import { LineBannerContent } from './ui/LineBannerContent';
import { colors } from '@/design-tokens';

export function LineBanner() {
  return (
    <div className={LineBannerStyles}>
      {mainLineBannerData.map((data, index) => (
        <>
          <LineBannerContent
            key={data.content}
            content={data.content}
            link={data.link}
          />
          {(index === 0 || 1) && (
            <VerticalLine
              height="78px"
              thickness="1px"
              color={colors.brand[100]}
            />
          )}
        </>
      ))}
    </div>
  );
}
