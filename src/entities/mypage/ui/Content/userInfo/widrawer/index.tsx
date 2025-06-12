'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { NomalInput } from '@/shared/ui/Input';
import { labelContainer } from '../index.css';
import { inputBox } from '@/entities/UserManage/ui/form/index.css';
import { formatTime } from '@/lib/utils';
import { regBtn } from '../../setting/index.css';
import {
  confirmVerificationCode,
  deleteUserHandler,
  verificationCode
} from '../api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
const withdrawalReasons = [
  '개인 정보유출 우려',
  '사이트의 신뢰도 불만',
  '상품 가격 불만',
  '프로그램 기능 불만',
  '기타'
];

export const Withdrawal = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [etcReason, setEtcReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const router = useRouter();
  // 타이머 useEffect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showVerification && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowVerification(false);
      setTimeLeft(120);
    }
    return () => clearInterval(timer);
  }, [showVerification, timeLeft]);

  const handleReasonChange = (reason: string) => {
    setSelectedReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      setPhone(value);
    } else if (field === 'verificationCode') {
      setCode(value);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await verificationCode(phone);
      setShowVerification(true);
      setTimeLeft(120);
    } catch (error) {
      console.error('인증번호 전송 실패:', error);
    }
  };

  const onSendVerification = async () => {
    try {
      const res = await confirmVerificationCode({
        code,
        phoneNum: phone
      });
      setShowVerification(false);
      setTimeLeft(120);
    } catch (error) {
      console.error('인증번호 전송 실패:', error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const res = await deleteUserHandler({
        code,
        phoneNum: phone
      });
      toast.info(res.data.message);
      router.push('/');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
    }
  };

  return (
    <div
      style={{
        width: 964,
        margin: 'auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 16px #0001',
        padding: 48,
        display: 'flex',
        flexDirection: 'column',
        gap: 32
      }}
    >
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        회원탈퇴 안내
      </h2>
      <div style={{ display: 'flex', gap: 32 }}>
        {/* 좌측 라벨 영역 */}
        <div
          style={{
            minWidth: 140,
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
            fontWeight: 500,
            fontSize: 18,
            color: '#444'
          }}
        >
          <div>회원탈퇴안내</div>
          <div>비밀번호 입력</div>
          <div>불편사항</div>
          <div>휴대폰 번호</div>
        </div>
        {/* 우측 입력 영역 */}
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}
        >
          {/* 안내문구 */}
          <div style={{ color: '#666', fontSize: 16, marginBottom: 8 }}>
            저희 우성인지펜 서비스를 부족하고 미흡하게 제공해드려 죄송합니다.
            불편하셨던 점이나 불만사항을 알려주시면 직접 반영해서 최적의
            회원탈퇴 경험을 약속드리도록 노력하겠습니다.
            <br />
            <span style={{ color: '#e1007b', fontWeight: 500 }}>
              아래의 항목 중 한 가지 이상은 이력 사항으로 수집하게 됩니다.
            </span>
            <ul
              style={{ margin: '8px 0 0 16px', color: '#e1007b', fontSize: 15 }}
            >
              <li>회원 탈퇴와 동시에 회원님의 정보는 즉시 삭제됩니다.</li>
              <li>회원 탈퇴 후 기존 결제 상품은 이용이 불가합니다.</li>
            </ul>
          </div>
          {/* 비밀번호 입력 */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%'
              }}
            >
              <NomalInput
                placeholder="번호를 입력해주세요"
                inputSize="medium"
                value={phone}
                onChange={e => handleInputChange('phone', e.target.value)}
              />
              <div className={regBtn}>
                <Button
                  onClick={handleVerifyCode}
                  btnType="button"
                  type="borderBrand"
                  content="인증번호 발송"
                />
              </div>
            </div>
          </div>

          {/* 인증번호 입력 */}
          {showVerification && (
            <div className={inputBox}>
              <NomalInput
                placeholder="인증번호를 입력해주세요"
                inputSize="medium"
                label={<div className={labelContainer}>인증번호 </div>}
                rightElement={
                  <span style={{ color: 'red' }}>({formatTime(timeLeft)})</span>
                }
                value={code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('verificationCode', e.target.value)
                }
              />
              <div className={regBtn}>
                <Button
                  onClick={onSendVerification}
                  btnType="button"
                  type="borderBrand"
                  content="인증"
                />
              </div>
            </div>
          )}
          {/* 불편사항 체크박스
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {withdrawalReasons.map(reason => (
              <label
                key={reason}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 16,
                  fontWeight: 400,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  background: selectedReasons.includes(reason)
                    ? '#ffe4f3'
                    : '#fff'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedReasons.includes(reason)}
                  onChange={() => handleReasonChange(reason)}
                  style={{ accentColor: '#e1007b' }}
                />
                {reason}
              </label>
            ))}
          </div>
          {selectedReasons.includes('기타') && (
            <input
              type="text"
              placeholder="기타 사유를 입력해주세요."
              value={etcReason}
              onChange={e => setEtcReason(e.target.value)}
              style={{
                width: '100%',
                height: 48,
                borderRadius: 8,
                border: '1px solid #eee',
                padding: '0 16px',
                fontSize: 16,
                marginTop: 8
              }}
            />
          )}
          <textarea
            placeholder="회원님의 진심어린 의견 부탁드립니다.\n더 나은 우성인지펜이 되도록 노력하겠습니다."
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            style={{
              width: '100%',
              minHeight: 120,
              borderRadius: 8,
              border: '1px solid #eee',
              padding: '16px',
              fontSize: 16,
              marginTop: 8,
              resize: 'vertical'
            }}
          /> */}
          {/* 버튼 영역 */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 24,
              justifyContent: 'center'
            }}
          >
            <div style={{ minWidth: 180, fontSize: 18, height: 48 }}>
              <Button content="취소" type="default" />
            </div>
            <div style={{ minWidth: 180, fontSize: 18, height: 48 }}>
              <Button content="탈퇴" type="brand" onClick={handleWithdrawal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
