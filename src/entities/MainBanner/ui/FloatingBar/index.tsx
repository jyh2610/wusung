'use client';

import { MdShoppingCart } from 'react-icons/md';
import { floatingBar, floatingBarList, floatingBarItem } from './index.css';
import { BsPersonFill } from 'react-icons/bs';
import Image from 'next/image';
import { Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';
export const FloatingBar = () => {
  const router = useRouter();
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={floatingBar}>
      <div className={floatingBarList}>
        <div className={floatingBarItem} onClick={() => router.push('/signin')}>
          <BsPersonFill size={24} />
          <div
            style={{
              textAlign: 'center'
            }}
          >
            <p>로그인/</p>
            <p>회원가입</p>
          </div>
        </div>
        <div
          className={floatingBarItem}
          onClick={() => router.push('/payment')}
        >
          <MdShoppingCart size={24} />
          결제하기
        </div>
        <div
          className={floatingBarItem}
          onClick={() =>
            window.open('https://remotedesktop.google.com/support', '_blank')
          }
        >
          <Image
            src={'/images/joy.png'}
            alt="원격지원"
            width={24}
            height={24}
          />
          원격지원
        </div>
      </div>
      <div
        style={{
          width: '88px',
          height: '57px'
        }}
      >
        <Button type="borderBrand" content="맨위로" onClick={handleScrollTop} />
      </div>
    </div>
  );
};
