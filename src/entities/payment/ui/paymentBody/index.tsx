'use client';

import { Dispatch, SetStateAction, useState } from 'react';
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
import { productListDTO } from '../../types';
import { calculateDiscount } from '../../utils';
interface ISelectProps {
  data: productListDTO[] | undefined;
  selectedPayment: productListDTO | undefined;
  setSelectedPayment: Dispatch<SetStateAction<productListDTO | undefined>>;
}

export function PaymentBody({
  data,
  selectedPayment,
  setSelectedPayment
}: ISelectProps) {
  return (
    <div className={container}>
      <SelectPayment
        data={data}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
      />
      <PaymentMethod selectedPayment={selectedPayment} />
    </div>
  );
}

export const SelectPayment = ({
  data,
  selectedPayment,
  setSelectedPayment
}: ISelectProps) => {
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
        {data?.map((payment, index) => {
          const isSelected = selectedPayment === payment;
          return (
            <div
              key={payment.productId}
              className={`${content} ${isSelected ? selectedTheme : defaultTheme}`}
              onClick={() => setSelectedPayment(payment)}
            >
              <div className={contentBody}>
                <span>{payment.name}</span>
                <div className={price}>
                  <span className={beforePrice}>{payment.price} 원</span>
                  <span className={paymentPrice}>
                    {calculateDiscount({
                      amount: payment.price,
                      rate: payment.discountRate
                    })}
                    원
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

interface IMethodProps {
  selectedPayment: productListDTO | undefined;
}

export const PaymentMethod = ({ selectedPayment }: IMethodProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div className={head}>
        <span>제품 설명</span>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '10px'
        }}
      >
        <div>{selectedPayment?.description}</div>
      </div>
    </div>
  );
};
