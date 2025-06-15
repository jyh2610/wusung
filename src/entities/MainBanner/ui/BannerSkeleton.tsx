import { bannerStyle, bannerHeaderStyles } from '../index.css';

export function BannerSkeleton() {
  return (
    <div className={bannerStyle}>
      <div
        className="animate-pulse"
        style={{
          position: 'absolute',
          width: '1920px',
          height: '700px',
          borderTopLeftRadius: '120px',
          borderBottomLeftRadius: '120px',
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        <div className="w-full h-full bg-gray-200" />
      </div>
      <div className={bannerHeaderStyles}>
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="animate-pulse">
        <div className="h-10 w-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
