import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import { container } from './index.css';

function Complete() {
  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 303px)',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div className={container}>
        <div
          style={{
            width: '200px',
            height: '200px',
            position: 'relative'
          }}
        >
          <Image
            fill
            src={'/images/icons/completeCheck.png'}
            alt={'completeCheck image'}
          />
        </div>
        <div>
          <p
            style={{
              color: colors.brand[500],
              fontSize: '40px',
              fontWeight: '500',
              lineHeight: '40px',
              letterSpacing: '2%',
              textAlign: 'center'
            }}
          >
            회원가입 완료
          </p>
          <p
            style={{
              color: colors.gray_scale[800],
              fontSize: '24px',
              fontWeight: '400',
              lineHeight: '40px',
              letterSpacing: '-2.5%',
              textAlign: 'center',
              marginTop: '15px'
            }}
          >
            우성인지펜에 오신 것을 환영합니다!
          </p>
        </div>
        <Link
          style={{
            width: '400px',
            height: '56px',
            marginTop: '40px'
          }}
          href={'/signin'}
        >
          <Button type="brand" content="로그인 하기" />
        </Link>
      </div>
    </div>
  );
}

export default Complete;
