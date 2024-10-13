import { mainLineBannerData } from './const';
import { LineBannerStyles } from './index.css';
import { LineBannerContent } from './ui/LineBannerContent';

export function LineBanner() {
  return (
    <div className={LineBannerStyles}>
      {mainLineBannerData.map(data => (
        <LineBannerContent
          key={data.content}
          content={data.content}
          link={data.link}
        />
      ))}
    </div>
  );
}
