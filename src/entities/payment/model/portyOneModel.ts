import { useState } from 'react';
import PortOne from '@portone/browser-sdk/v2';
import { Item, PaymentStatus } from '../types';
import { PaymentRequest } from '@portone/browser-sdk/v2';

export function usePayment(item: Item | null) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'IDLE'
  });

  const requestPayment = async () => {
    if (!item) return;
    setPaymentStatus({ status: 'PENDING' });

    const payment = await PortOne.requestPayment({
      storeId: 'store-b1068769-47bf-46bb-8937-561be9ac6f67',
      channelKey: 'channel-key-89714407-f1f6-4568-9955-cdf6f5847377',
      paymentId: 'test123',
      orderName: item.name,
      totalAmount: item.price,
      currency: 'CURRENCY_KRW',
      payMethod: 'CARD',
      customer: {
        fullName: '포트원',
        email: 'example@portone.io',
        phoneNumber: '01012341234'
      },
      customData: {
        item: item.id
      }
    });

    if (!payment) return console.log('결제 에러');

    console.log(payment);

    if ('code' in payment) {
      setPaymentStatus({
        status: 'FAILED',
        message: payment.message ?? '결제 오류 발생'
      });
      return;
    }

    const completeResponse = await fetch('/api/payment/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId: payment.paymentId })
    });

    if (completeResponse.ok) {
      const result = await completeResponse.json();
      setPaymentStatus({ status: result.status });
    } else {
      setPaymentStatus({
        status: 'FAILED',
        message: await completeResponse.text()
      });
    }
  };

  const resetStatus = () => setPaymentStatus({ status: 'IDLE' });

  return { paymentStatus, requestPayment, resetStatus };
}
