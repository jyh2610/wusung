// payment/PaymentHistory.tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { Button, SkeletonList } from '@/shared/ui';
import { HorizontalLine } from '@/shared/ui/VerticalLine';
import { colors } from '@/design-tokens';
import { FilterBar } from './FilterBar';
import { PaymentList } from './PaymentList';
import { PaymentFilter, filterOptions } from './const';
import { useInfinitePayments } from './hooks/useInfinitePayments';
import { container, header, list } from './paymentHistory.css';

export function PaymentHistory() {
  const [selectedFilter, setSelectedFilter] = useState<PaymentFilter>(
    filterOptions[0]
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError
  } = useInfinitePayments(selectedFilter);

  const observer = useRef<IntersectionObserver>();
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const payments = data?.pages.flatMap(page => page.data.content) || [];

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

        <FilterBar selected={selectedFilter} onSelect={setSelectedFilter} />
      </div>
      <div className={list} style={{ marginTop: '24px', minHeight: '400px' }}>
        {isFetching && !isFetchingNextPage ? (
          <SkeletonList />
        ) : isError ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            결제 내역을 불러오는 데 실패했습니다.
          </div>
        ) : payments.length === 0 ? (
          <div
            style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}
          >
            결제 내역이 없습니다.
          </div>
        ) : (
          payments.map((payment, i) => (
            <div
              style={{
                maxHeight: '1000px'
              }}
              key={payment.paymentId}
            >
              <PaymentList
                payment={payment}
                isLast={i === payments.length - 1}
                observe={lastItemRef}
              />
              {i !== payments.length - 1 && (
                <div style={{ margin: '32px 0' }}>
                  <HorizontalLine width="100%" color={colors.brand[0]} />
                </div>
              )}
            </div>
          ))
        )}
        {isFetchingNextPage && <SkeletonList />}
      </div>
    </div>
  );
}
