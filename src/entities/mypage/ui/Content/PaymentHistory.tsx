'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, SkeletonList } from '@/shared/ui';
import { HorizontalLine } from '@/shared/ui/VerticalLine';
import { colors } from '@/design-tokens';
import { getPaymentList, reqRefund } from '../../api';
import { paymentListDTO } from '../../type';
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
  refundBtn,
  selectedPaymentBtn
} from './paymentHistory.css';
import { formatKoreanDate } from '@/lib/utils';
import { ApiResponse, PaginatedResponse } from '@/shared/type';
import { Pageable } from '@/shared/ui/Pageable';
import { getRefundandCancel } from '../../model/payment';

export function PaymentHistory() {
  const [selectedPayment, setSelectedPayment] = useState('전체');
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const pageSize = 6; // Number of items per page

  const {
    data: payments,
    isLoading,
    isError
  } = useQuery<ApiResponse<PaginatedResponse<paymentListDTO>>, Error>({
    queryKey: ['paymentList', currentPage],
    queryFn: () => getPaymentList(currentPage, pageSize) // Pass currentPage and pageSize to API
  });
  const filteredPayments = payments?.data?.content?.filter(payment => {
    switch (selectedPayment) {
      case '전체':
        return true;
      case '결제 완료':
        return payment.status === 'PAID';
      case '결제 취소':
        return payment.status === 'CANCELLED';
      default:
        return true;
    }
  });

  const totalPages = payments?.data?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          <div style={{ width: '160px', height: '50px' }}>
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
        {isLoading ? (
          <SkeletonList />
        ) : isError ? (
          <ErrorState />
        ) : filteredPayments && filteredPayments.length === 0 ? (
          <EmptyState />
        ) : (
          filteredPayments?.map((payment, index) => (
            <div key={payment.paymentId}>
              <PaymentList
                isCompleted={payment.status !== 'PAID'}
                payment={payment}
              />
              {index !== filteredPayments.length - 1 && (
                <div style={{ margin: '32px 0' }}>
                  <HorizontalLine width="100%" color={colors.brand[0]} />
                </div>
              )}
            </div>
          ))
        )}
        <Pageable
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

const PaymentList = ({
  isCompleted,
  payment
}: {
  isCompleted: boolean;
  payment: paymentListDTO;
}) => {
  const className = [label, isCompleted ? completeText : ''].join(' ').trim();
  const queryClient = useQueryClient();

  const handleInvalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['paymentList'] });
  };

  const reqRefund = async () => {
    await getRefundandCancel({
      id: payment.paymentId,
      kind: payment.canRefund ? 'refund' : payment.canCancel ? 'cancel' : '',
      status: payment.canRefund
        ? payment.canRefund
        : payment.canCancel
          ? payment.canCancel
          : false
    })
      .then(handleInvalidate)
      .catch(() => console.log('error'));
  };

  const renderActionButton = () => {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        {(payment.canRefund || payment.canCancel) && (
          <button className={refundBtn} onClick={reqRefund}>
            {payment.canRefund
              ? '환불'
              : payment.canCancel
                ? '취소'
                : '취소 및 환불 불가'}
          </button>
        )}

        <a
          className={refundBtn}
          href={payment.receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          영수증
        </a>
      </div>
    );
  };
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className={listDate}>
          <div
            style={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center'
            }}
          >
            <span>{formatKoreanDate(payment.paidAt)}</span>
            <span className={className}>
              {payment.status === 'CANCELLED'
                ? '결제 취소'
                : payment.status === 'PAID'
                  ? '결제 완료'
                  : payment.status === 'PENDING'
                    ? '결제 대기'
                    : ''}
            </span>
          </div>
          {renderActionButton()}
        </div>
        <div className={paymentContent}>
          <span>
            {payment.period_months}개월권
            {payment.status !== 'PENDING' &&
              ` ( ${formatKoreanDate(payment.startDate)} ~ ${formatKoreanDate(payment.endDate)} )`}
          </span>
          <span className={payPerMonth}>
            {payment.amountPaid.toLocaleString()}
            <span className={currency}>원</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// 🔻 에러 상태 컴포넌트
const ErrorState = () => (
  <div style={{ textAlign: 'center', padding: '24px 0' }}>
    결제 내역을 불러오는 데 실패했습니다.
  </div>
);

// 🔻 빈 상태 컴포넌트
const EmptyState = () => (
  <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
    결제 내역이 없습니다.
  </div>
);
