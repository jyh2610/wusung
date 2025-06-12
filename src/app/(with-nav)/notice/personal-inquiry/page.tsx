'use client';

import { Personal } from '@/entities/inquiry';
import { pageHeader, pageTitle, viewInquiriesBtn } from './index.css';
import { useRouter } from 'next/navigation';

export default function PersonalInquiry() {
  const router = useRouter();

  return (
    <div>
      <div className={pageHeader}>
        <h2 className={pageTitle}>1:1 문의</h2>
        <button
          className={viewInquiriesBtn}
          onClick={() => router.push('/mypage?tab=문의내역')}
        >
          문의내역 보기
        </button>
      </div>
      <Personal />
    </div>
  );
}
