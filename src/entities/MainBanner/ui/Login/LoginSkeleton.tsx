// components/LoginSkeleton.tsx
import { SkeletonBox } from '@/shared/ui/Skeleton/SkeletonBox';
import { LoginStyles, LoginBodyStyles, LoginBottomStyles } from './Login.css';

export function LoginSkeleton() {
  return (
    <div className={LoginStyles}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SkeletonBox width="120px" height="20px" />
        <SkeletonBox width="180px" height="20px" />
      </div>
      <div className={LoginBodyStyles}>
        <SkeletonBox width="160px" height="20px" />
        <SkeletonBox width="100px" height="20px" />
      </div>
      <div className={LoginBottomStyles}>
        <SkeletonBox width="100%" height="44px" />
        <SkeletonBox width="100%" height="44px" />
      </div>
    </div>
  );
}
