import { Button } from '@/shared/ui';
import { useAuthStore } from '@/shared/stores/useAuthStore'; // Zustand store import
import { logout } from '../../api';
import {
  LoginStyles,
  LoginHeaderStyles,
  LoginBodyStyles,
  LoginBottomStyles,
  logoutStyles,
  LogedOutStyles
} from './Login.css';
import { colors } from '@/design-tokens';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function Logged() {
  const { username, logout: logoutAction } = useAuthStore(); // Zustand에서 username과 logout 액션 가져오기
  const router = useRouter();
  const logOut = async () => {
    try {
      await logoutAction(); // Zustand의 logout 액션 호출
      toast.success('로그아웃 성공');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className={LoginStyles}>
        <div className={LoginHeaderStyles}>
          <p>{username ? `${username}님,` : '로그인된 사용자 없음'}</p>{' '}
          {/* 사용자 이름 표시 */}
          <p>오늘도 좋은 하루 되세요!</p>
        </div>
        <div className={`${LoginBodyStyles} ${LogedOutStyles}`}>
          <p>우성인지펜 사용중</p>
          <p style={{ color: colors.brand[300] }}>기한: </p>
        </div>
        <div className={LoginBottomStyles}>
          <Button
            onClick={() => router.push('/program')}
            type={'brand'}
            btnSize={'large'}
            content={'우성인지펜 실행'}
          />
          <button onClick={logOut} className={logoutStyles}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logged;
