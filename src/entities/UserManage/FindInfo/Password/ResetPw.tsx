import { NomalInput } from '@/shared/ui/Input';
import React, { useState } from 'react';
import { container, title } from '../index.css';
import { fullButton, inputContainer } from './index.css';
import { resetPassword } from '../../api/findInfo';
import { toast } from 'react-toastify';
import { Button, Modal } from '@/shared/ui';
import { validatePassword } from '@/lib/vaildatrion';
import { modalTitle } from './index.css';
import { useRouter } from 'next/navigation';

export const ResetPw = () => {
  const [resetPw, setResetPw] = useState('');
  const [checkPw, setCheckPw] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const submitNewPw = async () => {
    try {
      const res = await resetPassword({
        newPassword: resetPw,
        newPasswordConfirm: checkPw
      });

      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const redirectToLogin = () => {
    setIsOpen(false);
    router.push('/signin');
  };

  return (
    <>
      <div className={title}>비밀번호 재설정</div>
      <div className={container}>
        <div className={inputContainer}>
          <NomalInput
            label="새 비밀번호"
            labelInputGap={12}
            height={57}
            type="password"
            labelPosition="vertical"
            value={resetPw}
            onChange={e => setResetPw(e.target.value)}
            placeholder="새로 사용하실 비밀번호를 입력해주세요"
            error={validatePassword(resetPw)}
          />
        </div>
        <div className={inputContainer}>
          <NomalInput
            label="새 비밀번호 확인"
            labelInputGap={12}
            labelPosition="vertical"
            type="password"
            value={checkPw}
            height={57}
            onChange={e => setCheckPw(e.target.value)}
            placeholder="새로 사용하실 비밀번호를 다시 한번 입력해주세요"
          />
        </div>
        <div className={fullButton}>
          <Button
            content="비밀번호 변경"
            type="brand"
            btnType="button"
            onClick={submitNewPw}
          />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalSize={{ width: '494px', height: '224px', borderRadius: '40px' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
            height: '100%'
          }}
        >
          <div>
            <p className={modalTitle}>비밀번호가 재설정되었어요!</p>
            <p className={modalTitle}>새로운 비밀번호로 로그인해주세요</p>
          </div>
          <div className={fullButton} style={{ width: '200px' }}>
            <Button content="확인" type="brand" onClick={redirectToLogin} />
          </div>
        </div>
      </Modal>
    </>
  );
};
