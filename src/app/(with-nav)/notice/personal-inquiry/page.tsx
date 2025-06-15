'use client';

import { Personal } from '@/entities/inquiry';
import { pageHeader, pageTitle, viewInquiriesBtn } from './index.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export default function PersonalInquiry() {
  const router = useRouter();
  const username = useAuthStore(state => state.username);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!username) {
      setShowModal(true);
    }
  }, [username]);

  const handleClick = () => {
    if (!username) {
      setShowModal(true);
      return;
    }
    router.push('/mypage?tab=문의내역');
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    router.push('/signin');
  };

  return (
    <div>
      <div className={pageHeader}>
        <h2 className={pageTitle}>1:1 문의</h2>
        <button className={viewInquiriesBtn} onClick={handleClick}>
          문의내역 보기
        </button>
      </div>
      <Personal />

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
              textAlign: 'center'
            }}
          >
            <h3 style={{ marginBottom: '20px' }}>로그인이 필요합니다</h3>
            <p style={{ marginBottom: '20px' }}>
              해당 기능을 이용하기 위해서는 로그인이 필요합니다.
            </p>
            <button
              onClick={handleModalConfirm}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
