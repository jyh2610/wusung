'use client';

import type React from 'react';

import { useState, type FormEvent } from 'react';

// Vanilla Extract 스타일 임포트 (변경 없음)
import {
  container,
  card,
  cardHeader,
  cardTitle,
  cardDescription,
  cardContent,
  cardFooter,
  form,
  formGroup,
  label,
  input,
  errorMessage,
  radioGroup,
  radioItem,
  radioInput,
  radioLabel,
  radioIcon,
  button,
  toast,
  toastContent,
  toastTitle,
  toastDescription,
  // 반응형 스타일 임포트 (변경 없음)
  cardHeaderResponsive,
  cardContentResponsive,
  cardTitleResponsive,
  buttonResponsive,
  productNameStyle,
  priceStyle,
  productSummaryContainer
} from './index.css'; // ★ CSS 파일 경로 확인 및 수정
import { usePayment } from '../../model/portyOneModel';
import { getvaildtorItem } from '../../api';
import { PreparePaymentRequestDTO, PreparePaymentResDTO } from '../../types';
import { Button } from '@/shared/ui';

interface PaymentPageProps {
  productName: string;
  price: number | string;
  onClose: () => void;
}

export interface userDTO {
  name: string;
  email: string;
  phone: string;
  paymentMethod: string;
}

export default function PaymentPage({
  onClose,
  productName,
  price
}: PaymentPageProps) {
  const { requestPayment, paymentStatus, resData } = usePayment();
  const [formData, setFormData] = useState<userDTO>({
    name: '',
    email: '',
    phone: '',
    paymentMethod: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = '유효한 전화번호를 입력해주세요.';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = '결제 방법을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value; // 일단 현재 값을 가져옴

    if (name === 'phone') {
      newValue = value.replace(/\D/g, '');
    }

    setFormData({
      ...formData,
      [name]: newValue
    });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('클라이언트 유효성 검사 실패');
      return;
    }

    setIsSubmitting(true);
    try {
      const prepare = (await getvaildtorItem({
        productId: 1,
        amount: 1000,
        productName: '12개월 이용권',
        name: formData.name,
        email: formData.email,
        phoneNum: formData.phone
      })) as
        | {
            data: PreparePaymentResDTO;
            message: string;
          }
        | undefined;

      if (prepare === undefined) {
        console.error(
          '사전검증 실패: 결제 준비 데이터 요청 오류 또는 유효성 불일치'
        );
        return;
      }

      const portOneRes = await requestPayment({ data: prepare, formData });

      console.log('결제 요청 성공', portOneRes);

      setShowToast(true); // 예시 토스트 메시지 표시
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('결제 처리 중 오류 발생:', error);
    } finally {
      setIsSubmitting(false); // 제출 상태 해제
    }
  };

  return (
    <div className={container}>
      {resData === null ? (
        <div className={card}>
          <div className={`${cardHeader} ${cardHeaderResponsive}`}>
            <h1 className={`${cardTitle} ${cardTitleResponsive}`}>결제하기</h1>
            <p className={cardDescription}>
              주문을 완료하기 위해 아래 정보를 입력해주세요.
            </p>
          </div>

          <div className={`${cardContent} ${cardContentResponsive}`}>
            {/* 결제할 상품 정보 섹션 표시 */}
            <div className={productSummaryContainer}>
              <p className={productNameStyle}>상품명: {productName}</p>
              <p className={priceStyle}>가격: {price} 원</p>
            </div>

            {/* ★ 결제 실패 메시지 표시 영역 */}
            {paymentStatus.status === 'FAILED' && (
              <p
                className={errorMessage}
                style={{ textAlign: 'center', marginBottom: '16px' }}
              >
                {paymentStatus.status === 'FAILED' && paymentStatus.message}
              </p>
            )}

            <form onSubmit={handleSubmit} className={form}>
              {/* 이름 필드 */}
              <div className={formGroup}>
                <label htmlFor="name" className={label}>
                  이름
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  className={input}
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <p className={errorMessage}>{errors.name}</p>}
              </div>
              {/* 이메일 필드 */}
              <div className={formGroup}>
                <label htmlFor="email" className={label}>
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@example.com"
                  className={input}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className={errorMessage}>{errors.email}</p>}
              </div>
              {/* 전화번호 필드 */}
              <div className={formGroup}>
                <label htmlFor="phone" className={label}>
                  전화번호
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01012345678"
                  className={input}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && <p className={errorMessage}>{errors.phone}</p>}
              </div>
              {/* 결제 방법 라디오 */}
              <div className={formGroup}>
                <label className={label}>결제 방법</label>
                <div className={radioGroup}>
                  <div className={radioItem}>
                    <input
                      id="card"
                      name="paymentMethod"
                      type="radio"
                      value="card"
                      className={radioInput}
                      onChange={handleInputChange}
                      checked={formData.paymentMethod === 'card'}
                    />
                    <label htmlFor="card" className={radioLabel}>
                      <span className={radioIcon}>💳</span> 카드 결제
                    </label>
                  </div>
                  <div className={radioItem}>
                    <input
                      id="bank"
                      name="paymentMethod"
                      type="radio"
                      value="bank"
                      className={radioInput}
                      onChange={handleInputChange}
                      checked={formData.paymentMethod === 'bank'}
                    />
                    <label htmlFor="bank" className={radioLabel}>
                      <span className={radioIcon}>🏦</span> 무통장 입금
                    </label>
                  </div>
                </div>
                {errors.paymentMethod && (
                  <p className={errorMessage}>{errors.paymentMethod}</p>
                )}
              </div>

              {/* ★ 제출 버튼 상태 및 텍스트 변경 */}
              <button
                type="submit"
                className={`${button} ${buttonResponsive}`}
                // ★ paymentStatus.status가 PENDING일 때 비활성화
                disabled={paymentStatus.status === 'PENDING'}
              >
                {/* ★ paymentStatus 상태에 따라 버튼 텍스트 변경 */}
                {paymentStatus.status === 'PENDING'
                  ? '결제 처리 중...'
                  : '결제하기'}
              </button>
            </form>
          </div>

          <div className={cardFooter}>결제 정보는 안전하게 보호됩니다.</div>
        </div>
      ) : (
        <div className={card}>
          <div className={`${cardHeader} ${cardHeaderResponsive}`}>
            <h1 className={`${cardTitle} ${cardTitleResponsive}`}>
              결제가 완료되었습니다
            </h1>
            <p className={cardDescription}>
              아래는 결제 정보입니다. 영수증을 확인하거나 이용을 시작하세요.
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}
          >
            <InfoRow label="상품명" value={resData.data.productName} />
            <InfoRow label="결제 금액" value={`${resData.data.amount} 원`} />
            <InfoRow
              label="이용 가능 기간"
              value={`~ ${resData.data.endDate}`}
            />
            <InfoRow
              label="영수증"
              value={
                <a
                  href={resData.data.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'underline' }}
                >
                  영수증 보기 →
                </a>
              }
            />
          </div>

          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              width: '200px',
              height: '56px',
              margin: '40px auto'
            }}
          >
            <Button type="brand" content="확인" onClick={onClose} />
          </div>
        </div>
      )}
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '24px',
        color: '#333'
      }}
    >
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
