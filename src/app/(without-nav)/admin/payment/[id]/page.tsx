'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPaymentDetail,
  approvePayment
} from '@/components/admin/payment/api';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { message, Modal } from 'antd';

export default function PaymentDetailPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['payment-detail', params.id],
    queryFn: () => getPaymentDetail(Number(params.id))
  });

  if (isLoading) return <div>로딩중...</div>;
  if (error || !data) return <div>결제 정보를 불러올 수 없습니다.</div>;

  const payment = data.data;

  const handleApprove = async () => {
    try {
      await approvePayment(Number(payment.paymentId));
      message.success('무통장입금이 승인되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['payment-detail', params.id]
      });
    } catch (error) {
      message.error('승인 중 오류가 발생했습니다.');
    }
  };

  const showApproveModal = () => {
    Modal.confirm({
      title: '무통장입금 승인',
      content: '정말 승인하시겠습니까?',
      okText: '승인',
      cancelText: '취소',
      onOk: handleApprove
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">결제 상세</h1>
        <Button variant="outline" onClick={() => router.back()}>
          목록으로
        </Button>
      </div>
      <Card className="p-6 bg-white">
        <div className="flex justify-end mb-4 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/admin/member/${payment.memberId}`)}
            disabled={!payment.memberId}
          >
            구매자 상세 보기
          </Button>
          {payment.paymentMethod === 'BANK_TRANSFER' &&
            payment.status === 'PENDING' && (
              <Button size="sm" variant="outline" onClick={showApproveModal}>
                무통장입금 승인
              </Button>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 ">
          <div>
            <strong>결제 ID:</strong> {payment.paymentId}
          </div>
          <div>
            <strong>구매자명:</strong> {payment.buyerName}
          </div>
          <div>
            <strong>구매자 이메일:</strong> {payment.buyerEmail}
          </div>
          <div>
            <strong>구매자 연락처:</strong> {payment.buyerPhone}
          </div>
          <div>
            <strong>결제 상태:</strong> {payment.status}
          </div>
          <div>
            <strong>결제 수단:</strong> {payment.paymentMethod}
          </div>
          <div>
            <strong>결제 금액:</strong> {payment.amountTotal?.toLocaleString()}
            원
          </div>
          <div>
            <strong>실 결제 금액:</strong>{' '}
            {payment.amountPaid?.toLocaleString()}원
          </div>
          <div>
            <strong>취소 금액:</strong>{' '}
            {payment.amountCancelled?.toLocaleString()}원
          </div>
          <div>
            <strong>할인 금액:</strong>{' '}
            {payment.amountDiscount?.toLocaleString()}원
          </div>
          <div>
            <strong>부가세:</strong> {payment.amountVat?.toLocaleString()}원
          </div>
          <div>
            <strong>공급가액:</strong> {payment.amountSupply?.toLocaleString()}
            원
          </div>
          <div>
            <strong>비과세 금액:</strong>{' '}
            {payment.amountTaxFree?.toLocaleString()}원
          </div>
          <div>
            <strong>취소된 비과세 금액:</strong>{' '}
            {payment.amountCancelledTaxFree?.toLocaleString()}원
          </div>
          <div>
            <strong>결제일:</strong>{' '}
            {payment.paidAt
              ? format(new Date(payment.paidAt), 'yyyy-MM-dd HH:mm:ss')
              : '-'}
          </div>
          <div>
            <strong>취소일:</strong>{' '}
            {payment.cancelledAt
              ? format(new Date(payment.cancelledAt), 'yyyy-MM-dd HH:mm:ss')
              : '-'}
          </div>
          <div>
            <strong>생성일:</strong>{' '}
            {format(new Date(payment.createdAt), 'yyyy-MM-dd HH:mm:ss')}
          </div>
          <div>
            <strong>수정일:</strong>{' '}
            {format(new Date(payment.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
          </div>
          <div>
            <strong>상품명:</strong> {payment.productName}
          </div>
          <div>
            <strong>상품 이용 개월:</strong> {payment.productPeriodMonths}
          </div>
          <div className="col-span-2">
            <strong>영수증 URL:</strong>{' '}
            {payment.receiptUrl ? (
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                영수증 보기
              </a>
            ) : (
              '-'
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
