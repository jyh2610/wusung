import { Button } from '@/shared/ui';
import { paymentList } from '../../const';
import { container } from './index.css';

export function PaymentBody() {
  return (
    <div className={container}>
      <SelectPayment />
    </div>
  );
}

export const SelectPayment = () => {
  const payments = Object.keys(paymentList) as Array<keyof typeof paymentList>;

  return (
    <div>
      <div>
        <span>요금 선택</span>
      </div>
      <div>
        {payments.map(payment => (
          <div key={payment}>
            <span>{cardTitle(payment)}</span>
            <span>{paymentList[payment].toLocaleString()} 원</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PaymentMethod = () => {
  return <div></div>;
};

const cardTitle = (data: 'threeMonth' | 'sixMonth' | 'oneYear') => {
  return data === 'threeMonth'
    ? '3개월'
    : data === 'sixMonth'
      ? '6개월'
      : '12개월';
};
