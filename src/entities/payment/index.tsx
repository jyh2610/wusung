import { colors } from '@/design-tokens';
import { Benefit, PaymentBody } from './ui';

export function PaymentComponent() {
  return (
    <div style={{ height: '100%', width: '928px' }}>
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
      </div>
    </div>
  );
}
