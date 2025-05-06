'use client';

import { Dispatch, SetStateAction, useState } from 'react';
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
  selectedPaymentTheme,
  lookAccept
} from './index.css';
import { productListDTO } from '../../types';
import { calculateDiscount } from '../../utils';
import { colors } from '@/design-tokens';
import {
  TermsOfUseModal,
  PersonalInformationProcessing,
  RefundModal
} from '@/entities/UserManage/ui/SignupForm';
import { IoIosArrowForward } from 'react-icons/io';
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
  const [isTermOfUse, setIsTermOfUse] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isRefundModal, setIsRefundModal] = useState(false);

  return (
    <div className={container}>
      <SelectPayment
        data={data}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
      />
      {selectedPayment && <PaymentMethod selectedPayment={selectedPayment} />}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div className={head}>
          <span>이용 약관</span>
        </div>
        <div className={lookAccept} onClick={() => setIsTermOfUse(true)}>
          <span>약관보기</span>
          <IoIosArrowForward />
        </div>
        <TermsOfUseModal
          isTermOfUse={isTermOfUse}
          setIsTermOfUse={setIsTermOfUse}
        />

        <div className={lookAccept} onClick={() => setIsModal(true)}>
          <span>개인정보 처리방침</span>
          <IoIosArrowForward />
        </div>
        <PersonalInformationProcessing
          isModal={isModal}
          setIsModal={setIsModal}
        />

        <div className={lookAccept} onClick={() => setIsRefundModal(true)}>
          <span>환불 규정</span>
          <IoIosArrowForward />
          <RefundModal
            isRefundModal={isRefundModal}
            setIsRefundModal={setIsRefundModal}
          />
        </div>
      </div>
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
