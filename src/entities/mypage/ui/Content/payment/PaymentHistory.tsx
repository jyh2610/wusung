// payment/PaymentHistory.tsx
'use client';

import { useState } from 'react';
import { Button, SkeletonList } from '@/shared/ui';
import { HorizontalLine } from '@/shared/ui/VerticalLine';
import { colors } from '@/design-tokens';
import { FilterBar } from './FilterBar';
import { PaymentList } from './PaymentList';
import { PaymentFilter, filterOptions } from '../const';
import { useQuery } from '@tanstack/react-query';
import { getPaymentList, getCertificate } from '@/entities/mypage/api';
import { container, emptyStyle, header, list } from './paymentHistory.css';
import { ApiResponse, PaginatedResponse } from '@/shared/type';
import { paymentListDTO } from '@/entities/mypage/type';

const PAGE_SIZE = 4;

export function PaymentHistory() {
  const [selectedFilter, setSelectedFilter] = useState<PaymentFilter>(
    filterOptions[0]
  );
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<
    ApiResponse<PaginatedResponse<paymentListDTO>>,
    Error
  >({
    queryKey: ['paymentList', selectedFilter, page],
    queryFn: () => getPaymentList(selectedFilter, page - 1, PAGE_SIZE)
    // keepPreviousData: true // (tanstack v4 이상에서만 지원, 필요시 주석 해제)
  });

  const payments: paymentListDTO[] = data?.data.content || [];
  const totalElements = data?.data.totalElements || 0;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const certificate = async () => {
    const res = await getCertificate();
    const blob = res.data as Blob;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '우성인지펜_인증서.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
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
            <Button
              content="인증서발급"
              type="borderBrand"
              onClick={certificate}
            />
          </div>
        </div>
        <FilterBar
          selected={selectedFilter}
          onSelect={option => {
            setSelectedFilter(option);
            setPage(1);
          }}
        />
      </div>
      <div className={list} style={{ marginTop: '24px', minHeight: '400px' }}>
        {isLoading ? (
          <SkeletonList />
        ) : isError ? (
          <div className={emptyStyle}>
            결제 내역을 불러오는 데 실패했습니다.
          </div>
        ) : payments.length === 0 ? (
          <div className={emptyStyle}>결제 내역이 없습니다.</div>
        ) : (
          payments.map((payment, i) => (
            <div key={payment.paymentId}>
              <PaymentList payment={payment} />
              {i !== payments.length - 1 && (
                <div style={{ margin: '32px 0' }}>
                  <HorizontalLine width="100%" color={colors.brand[0]} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '32px 0 0 0',
            gap: 8
          }}
        >
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              style={{
                minWidth: 36,
                height: 36,
                borderRadius: 8,
                border: '1px solid #ddd',
                background: page === idx + 1 ? '#e1007b' : '#fff',
                color: page === idx + 1 ? '#fff' : '#222',
                fontWeight: page === idx + 1 ? 700 : 400,
                fontSize: 18,
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s'
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
