'use client';

import { useState } from 'react';
import { paymentList } from '../../const';
import {
  container,
  head,
  content,
  defaultTheme,
  selectedTheme,
  body,
  contentBody,
  beforePrice,
  price,
  paymentPrice,
  payment,
  defaultPaymentTheme,
  selectedPaymentTheme
} from './index.css';

export function PaymentBody() {
  return (
    <div className={container}>
      <SelectPayment />
      {/* <PaymentMethod /> */}
    </div>
  );
}

export const SelectPayment = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const payments = Object.keys(paymentList) as Array<keyof typeof paymentList>;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div className={head}>
        <span>요금 선택</span>
      </div>
      <div className={body}>
        {payments.map((payment, index) => {
          const isSelected = selectedPayment === payment;
          return (
            <div
              key={payment}
              className={`${content} ${isSelected ? selectedTheme : defaultTheme}`}
              onClick={() => setSelectedPayment(payment)}
            >
              <div className={contentBody}>
                <span>{cardTitle(payment)}</span>
                <div className={price}>
                  {typeof paymentList[payment][1] === 'number' && (
                    <span className={beforePrice}>
                      {paymentList[payment][1].toLocaleString()} 원
                    </span>
                  )}
                  <span className={paymentPrice}>
                    {paymentList[payment][0].toLocaleString()} 원
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PaymentMethod = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div className={head}>
        <span>요금 선택</span>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '10px'
        }}
      >
        <div
          className={`${payment} ${selectedPayment === 'bank' ? selectedPaymentTheme : defaultPaymentTheme}`}
          onClick={() => setSelectedPayment('bank')}
        >
          무통장입금
        </div>
        <div
          className={`${payment} ${selectedPayment === 'card' ? selectedPaymentTheme : defaultPaymentTheme}`}
          onClick={() => setSelectedPayment('card')}
        >
          카드
        </div>
      </div>
    </div>
  );
};

const cardTitle = (data: 'threeMonth' | 'sixMonth' | 'oneYear') => {
  return data === 'threeMonth'
    ? '3개월'
    : data === 'sixMonth'
      ? '6개월'
      : '12개월';
};
