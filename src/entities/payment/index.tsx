'use client';

import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import { Benefit, PaymentBody } from './ui';
import { usePayment } from './model/portyOneModel';
import { useEffect } from 'react';

export function PaymentComponent() {
  const { requestPayment } = usePayment({
    name: 'test',
    price: 1000,
    id: '123123',
    currency: 'krw'
  });

  useEffect(() => {
    requestPayment();
  }, []);

  return (
    <div style={{ width: '888px' }}>
      <div>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '600',
            color: colors.gray_scale[900],
            paddingBottom: '40px'
          }}
        >
          요금 안내 및 결제
        </h1>
      </div>
      <div>
        <Benefit />
        <PaymentBody />
        <div
          style={{
            width: '240px',
            height: '56px',
            margin: '40px auto 0 auto'
          }}
        >
          <Button content="결제하기" type="brand" />
        </div>
      </div>
    </div>
  );
}
