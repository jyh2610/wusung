import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import { Benefit, PaymentBody } from './ui';

export function PaymentComponent() {
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
