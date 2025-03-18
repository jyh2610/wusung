'use client';

import { useState } from 'react';
import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import { HorizontalLine } from '@/shared/ui/VerticalLine';
import { paymentState } from './const';
import {
  completeText,
  container,
  currency,
  header,
  label,
  list,
  listDate,
  month,
  paymentBtn,
  paymentContent,
  payPerMonth,
  selectedPaymentBtn
} from './paymentHistory.css';

export function PaymentHistory() {
  const [selectedPayment, setSelectedPayment] = useState('전체');
  const payments = [
    { isCompleted: true },
    { isCompleted: false },
    { isCompleted: true }
  ];
  return (
    <div className={container}>
      <div className={header}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <span>결제내역</span>
          <div
            style={{
              width: '160px',
              height: '50px'
            }}
          >
            <Button content="인증서발급" type="borderBrand" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {paymentState.map(state => (
            <button
              key={state}
              className={`${paymentBtn} ${selectedPayment === state ? selectedPaymentBtn : ''}`}
              onClick={() => setSelectedPayment(state)}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      <div className={list}>
        {payments.map((payment, index) => (
          <div key={index}>
            <PaymentList isCompleted={payment.isCompleted} />
            {index !== payments.length - 1 && (
              <div
                style={{
                  margin: '32px 0'
                }}
              >
                <HorizontalLine width="100%" color={colors.brand[0]} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const PaymentList = ({ isCompleted }: { isCompleted: boolean }) => {
  const className = [label, isCompleted ? completeText : ''].join(' ').trim();
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className={listDate}>
          <span>2024.05.27</span>
          <span className={className}>
            {isCompleted ? '결제 필요' : '결제 완료'}
          </span>
        </div>
        <div className={paymentContent}>
          <span className={month}>3개월권</span>
          <span className={payPerMonth}>
            50,000<span className={currency}>원</span>
          </span>
        </div>
      </div>
    </div>
  );
};
