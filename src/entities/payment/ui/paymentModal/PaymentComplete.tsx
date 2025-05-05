'use client';

import React from 'react';

// ★ Vanilla Extract 스타일 임포트
import {
  completeModalContent,
  completeTitle,
  dataSection,
  lastDataSection, // 추가
  dataRow,
  dataLabel,
  dataValue,
  messageContainer,
  receiptLink,
  closeButton
} from './index.css'; // ★ CSS 파일 경로 확인 및 수정

// ★ 데이터 인터페이스 임포트
export interface PaymentCompleteData {
  paymentId: string;
  productName: string;
  amount: number;
  status: 'PAID' | 'FAILED' | string; // 제공된 데이터는 PAID지만, 혹시 몰라 string 포함
  startDate: string;
  endDate: string;
  receiptUrl: string;
  message: string; // 결제 완료 관련 메시지
}

// PaymentComplete 컴포넌트가 받을 props 인터페이스 정의
interface PaymentCompleteProps {
  data: PaymentCompleteData; // 결제 완료 데이터
  onClose: () => void; // 모달 닫기 함수
}

export function PaymentComplete({ data, onClose }: PaymentCompleteProps) {
  return (
    // ★ 모달 내용 전체 컨테이너 - 스타일 적용
    <div className={completeModalContent}>
      {/* ★ 제목 */}
      <h2 className={completeTitle}>결제 완료</h2>

      {/* ★ 데이터 섹션 1: 상품 정보 */}
      <div className={dataSection}>
        <div className={dataRow}>
          <span className={dataLabel}>상품명:</span>
          <span className={dataValue}>{data.productName}</span>
        </div>
        <div className={dataRow}>
          <span className={dataLabel}>금액:</span>
          <span className={dataValue}>
            {data.amount.toLocaleString()} 원
          </span>{' '}
          {/* 금액 포맷팅 예시 */}
        </div>
      </div>

      {/* ★ 데이터 섹션 2: 이용 기간 */}
      <div className={dataSection}>
        <div className={dataRow}>
          <span className={dataLabel}>시작일:</span>
          <span className={dataValue}>{data.startDate}</span>
        </div>
        <div className={dataRow}>
          <span className={dataLabel}>종료일:</span>
          <span className={dataValue}>{data.endDate}</span>
        </div>
      </div>

      {/* ★ 데이터 섹션 3: 메시지 및 ID (마지막 섹션) */}
      <div className={lastDataSection}>
        {' '}
        {/* 마지막 섹션은 하단 보더 없음 */}
        <div className={dataRow}>
          <span className={dataLabel}>거래번호:</span>
          <span className={dataValue}>{data.paymentId}</span>
        </div>
      </div>

      {/* ★ 결제 완료 메시지 */}
      {data.message && <div className={messageContainer}>{data.message}</div>}

      {/* ★ 영수증 링크 */}
      {data.receiptUrl && (
        <a
          href={data.receiptUrl}
          target="_blank" // 새 탭에서 열기
          rel="noopener noreferrer" // 보안 속성
          className={receiptLink}
        >
          영수증 확인
        </a>
      )}

      {/* ★ 닫기 버튼 */}
      <button className={closeButton} onClick={onClose}>
        닫기
      </button>
    </div>
  );
}
