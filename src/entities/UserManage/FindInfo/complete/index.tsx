import React from 'react';
import { fullButton } from '../Id/index.css';
import { Button } from '@/shared/ui';
import { maskLastThree } from '@/lib/utils';
import { title, idFont, idContainer, idItem } from './index.css';
import { useRouter } from 'next/navigation';
import { FaFaceSmile } from 'react-icons/fa6';
import Image from 'next/image';
import { colors } from '@/design-tokens';
// {
//   "data": [
//     "jyh1234"
//   ],
//   "message": "인증 성공"
// }

export const CompleteId = ({ id }: { id: string[] }) => {
  const router = useRouter();

  return (
    <div>
      <div className={title}>고객님의 아이디를 찾았습니다!</div>
      <div className={idContainer}>
        {id.map(Id => (
          <div key={Id} className={idItem}>
            <div style={{ backgroundColor: '#FFFFFF' }}>
              <FaFaceSmile
                color={colors.gray_scale['700']}
                width={56}
                height={56}
              />
            </div>
            <span className={idFont} key={Id}>
              {maskLastThree(Id)}
            </span>
          </div>
        ))}
      </div>

      <div>
        <div className={fullButton}>
          <Button
            content="비밀번호 찾기"
            type="borderBrand"
            onClick={() => router.push('/signin/find/pw')}
          />
        </div>
        <div className={fullButton}>
          <Button
            content="로그인"
            type="brand"
            onClick={() => router.push('/signin')}
          />
        </div>
      </div>
    </div>
  );
};

export const CompletePassword = () => {
  return (
    <div>
      <span>고객님의 비밀번호를 찾았습니다!</span>
      <span>비밀번호는 {123}입니다.</span>
    </div>
  );
};
