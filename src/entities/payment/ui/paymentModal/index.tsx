'use client';

import type React from 'react';
import { useState, type FormEvent } from 'react';

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
  cardHeaderResponsive,
  cardContentResponsive,
  cardTitleResponsive,
  buttonResponsive,
  productNameStyle,
  priceStyle,
  productSummaryContainer
} from './index.css';

import { usePayment } from '../../model/portyOneModel';
import {
  BankTransferPaymentResDTO,
  getPaymentBank,
  getvaildtorItem
} from '../../api';
import { Button } from '@/shared/ui';
import { PreparePaymentResDTO } from '../../types';
import { toast } from 'react-toastify';
import { getlocalStorageValue } from '@/lib/utils';
import { useAuthStore } from '@/shared/stores/useAuthStore';

interface PaymentPageProps {
  productName: string;
  price: number;
  productId: number;
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
  productId,
  price
}: PaymentPageProps) {
  const { requestPayment, paymentStatus, resData } = usePayment();
  const { username } = useAuthStore();
  const [formData, setFormData] = useState<userDTO>({
    name: '',
    email: '',
    phone: '',
    paymentMethod: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [bankData, setBankData] = useState<BankTransferPaymentResDTO | null>(
    null
  );

  const account = process.env.NEXT_PUBLIC_ACCOUNT;

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
    let newValue = name === 'phone' ? value.replace(/\D/g, '') : value;

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

    if (formData.paymentMethod === 'bank') {
      try {
        const res = await getPaymentBank({
          productId,
          amount: price,
          buyerName: formData.name,
          buyerEmail: formData.email,
          phoneNum: formData.phone
        });

        if (!res) {
          toast.error('무통장 입금 처리 실패');
          return;
        }

        setBankData(res.data); // 여기서 accountNumber만 있다고 가정
      } catch (err) {
        console.error('무통장 입금 처리 실패', err);
        toast.error('무통장 입금 처리 실패');
      }

      return;
    }

    setIsSubmitting(true);
    try {
      const prepare = (await getvaildtorItem({
        productId: productId,
        amount: price,
        productName: productName,
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
        toast.error(
          '사전검증 실패: 결제 준비 데이터 요청 오류 또는 유효성 불일치'
        );
        return;
      }

      const portOneRes = await requestPayment({ data: prepare, formData });

      setShowToast(true); // 예시 토스트 메시지 표시
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      toast.error('결제 처리 중 오류 발생');
    } finally {
      setIsSubmitting(false); // 제출 상태 해제
    }
  };

  return (
    <div className={container}>
      {/* 카드 결제 완료 화면 */}
      {resData ? (
        <ResultCard
          title="결제가 완료되었습니다"
          description="아래는 결제 정보입니다. 영수증을 확인하거나 이용을 시작하세요."
          onClose={onClose}
        >
          <InfoRow label="상품명" value={resData.data.productName} />
          <InfoRow label="결제 금액" value={`${resData.data.amount} 원`} />
          <InfoRow label="이용 가능 기간" value={`~ ${resData.data.endDate}`} />
          <InfoRow
            label="영수증"
            value={
              <div
                style={{
                  maxWidth: '300px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={resData.data.receiptUrl}
              >
                <a
                  href={resData.data.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'underline' }}
                >
                  영수증 보기
                </a>
              </div>
            }
          />
        </ResultCard>
      ) : bankData ? (
        // 무통장 입금 완료 화면
        <ResultCard
          title="무통장 입금 신청이 완료되었습니다"
          description="아래 계좌번호로 입금해주세요. 입금 확인 후 이용이 가능합니다."
          onClose={onClose}
        >
          <InfoRow label="상품명" value={productName} />
          <InfoRow label="결제 금액" value={`${price} 원`} />
          <InfoRow label="은행" value={'농협'} />
          <InfoRow label="입금 계좌번호" value={account} />
          <InfoRow label="" value={'이정희(우성인지펜)'} />
        </ResultCard>
      ) : (
        // 결제 폼
        <div className={card}>
          <div className={`${cardHeader} ${cardHeaderResponsive}`}>
            <h1 className={`${cardTitle} ${cardTitleResponsive}`}>결제하기</h1>
            <p className={cardDescription}>
              주문을 완료하기 위해 아래 정보를 입력해주세요.
            </p>
          </div>

          <div className={`${cardContent} ${cardContentResponsive}`}>
            <div className={productSummaryContainer}>
              <p className={productNameStyle}>상품명: {productName}</p>
              <p className={priceStyle}>가격: {price} 원</p>
            </div>

            {paymentStatus.status === 'FAILED' && (
              <p
                className={errorMessage}
                style={{ textAlign: 'center', marginBottom: '16px' }}
              >
                {paymentStatus.message}
              </p>
            )}

            <form onSubmit={handleSubmit} className={form}>
              {/* 이름 */}
              <FormField
                label="이름"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="홍길동"
              />
              {/* 이메일 */}
              <FormField
                label="이메일"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="example@example.com"
              />
              {/* 전화번호 */}
              <FormField
                label="전화번호"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="01012345678"
              />
              {/* 결제 방법 */}
              <div className={formGroup}>
                <label className={label}>결제 방법</label>
                <div className={radioGroup}>
                  {['card', 'bank'].map(method => (
                    <div className={radioItem} key={method}>
                      <input
                        id={method}
                        name="paymentMethod"
                        type="radio"
                        value={method}
                        className={radioInput}
                        onChange={handleInputChange}
                        checked={formData.paymentMethod === method}
                        // disabled={method === 'card' && username !== 'payment'}
                      />
                      <label
                        htmlFor={method}
                        className={radioLabel}
                        style={
                          method === 'card' && username !== 'payment'
                            ? { color: '#9CA3AF', cursor: 'not-allowed' }
                            : {}
                        }
                      >
                        <span className={radioIcon}>
                          {method === 'card' ? '💳' : '🏦'}
                        </span>
                        {method === 'card' ? '카드 결제' : '무통장 입금'}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className={errorMessage}>{errors.paymentMethod}</p>
                )}
              </div>

              <button
                type="submit"
                className={`${button} ${buttonResponsive}`}
                disabled={paymentStatus.status === 'PENDING'}
              >
                {paymentStatus.status === 'PENDING'
                  ? '결제 처리 중...'
                  : '결제하기'}
              </button>
            </form>
          </div>

          <div className={cardFooter}>결제 정보는 안전하게 보호됩니다.</div>
        </div>
      )}
    </div>
  );
}

function FormField({
  label: labelText,
  name,
  value,
  onChange,
  error,
  placeholder
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className={formGroup}>
      <label htmlFor={name} className={label}>
        {labelText}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        className={input}
        value={value}
        onChange={onChange}
      />
      {error && <p className={errorMessage}>{error}</p>}
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

function ResultCard({
  title,
  description,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className={card}>
      <div className={`${cardHeader} ${cardHeaderResponsive}`}>
        <h1 className={`${cardTitle} ${cardTitleResponsive}`}>{title}</h1>
        <p className={cardDescription}>{description}</p>
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
        {children}
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
  );
}
