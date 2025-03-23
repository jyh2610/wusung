'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation'; // ✅ useRouter 추가
import { Button } from '@/shared/ui';
import { layoutContainer } from '../introduce/layout.css';
import {
  btncontainer,
  buttonStyle,
  container,
  description,
  imageContainer,
  title
} from './index.css';

function Complete() {
  const router = useRouter(); // ✅ Next.js 라우터 사용

  return (
    <section className={layoutContainer}>
      <div className={container}>
        <div className={imageContainer}>
          <Image
            fill
            src={'/images/complete.png'}
            alt={'completeCheck image'}
          />
        </div>
        <div>
          <p className={title}>문의 등록 완료</p>
          <p className={description}>
            등록하신 문의는 마이페이지 {'>'} 문의내역에서 확인해주세요!
          </p>
        </div>
        <div className={btncontainer}>
          <div className={buttonStyle}>
            <Button
              content="메인으로 돌아가기"
              type="borderBrand"
              onClick={() => router.push('/')}
            />{' '}
            {/* ✅ 홈으로 이동 */}
          </div>
          <div className={buttonStyle}>
            <Button
              content="문의내역 보기"
              type="brand"
              onClick={() => router.push('/mypage/inquiries')}
            />{' '}
            {/* ✅ 문의내역으로 이동 */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Complete;
