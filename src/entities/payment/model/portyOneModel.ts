import { useState } from 'react';
import PortOne from '@portone/browser-sdk/v2';
import {
  Item,
  PaymentStatus,
  PreparePaymentRequestDTO,
  PreparePaymentResDTO,
  VerifyPaymentDTO,
  VerifyPaymentResponseDTO
} from '../types';
import { postAfterValidator } from '../api';
import { userDTO } from '../ui/paymentModal';

export function usePayment() {
  // PaymentStatus 타입 정의는 usePayment 훅 외부나 별도 types 파일에 있어야 합니다.
  // type PaymentStatus = ... (위 PaymentPage 코드에 추가했습니다)

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'IDLE'
  });

  const [resData, setResData] = useState<{
    data: VerifyPaymentDTO;
    message: string;
  } | null>(null);

  // 환경 변수 (Next.js 환경 변수 사용법에 맞게 .env 파일 설정 필요)
  const channelKey = process.env.NEXT_PUBLIC_PAYMENT_CHANNEL_KEY!;
  const storeId = process.env.NEXT_PUBLIC_STORE_ID!;

  const requestPayment = async ({
    data,
    formData
  }: {
    data: {
      data: PreparePaymentResDTO;
      message: string;
    };
    formData: userDTO;
  }) => {
    try {
      setPaymentStatus({ status: 'PENDING' }); // ★ 결제 시작 시 PENDING 상태로 변경

      // getvaildtorItem 함수는 PreparePaymentRequestDTO를 인자로 받고 Item | undefined를 반환해야 합니다.
      // const item = await getvaildtorItem(data);
      if (data === undefined) {
        console.error('사전 데이터 요청 실패 또는 유효성 불일치');
        setPaymentStatus({
          // ★ 실패 상태로 변경
          status: 'FAILED',
          message: '사전 검증에 실패했습니다.' // 실패 메시지 포함
        });
        return;
      }

      // PortOne 결제 요청
      const payment = await PortOne.requestPayment({
        storeId: storeId,
        channelKey: channelKey,
        paymentId: data.data.paymentId, // item.productId가 숫자라면 문자열로 변환 필요
        orderName: data.data.productName,
        totalAmount: data.data.amount, // item.amount가 숫자라면 그대로, 문자열이라면 Number 변환
        currency: 'CURRENCY_KRW',
        payMethod: 'CARD', // 실제 선택한 결제 방법에 맞게 수정 필요 (formData.paymentMethod 사용)
        customer: {
          fullName: formData.name,
          email: formData.email,
          phoneNumber: formData.phone // item.phoneNum은 '-' 등이 제거된 숫자 문자열이어야 PortOne에서 오류 없음
        },
        customData: {
          item: data.data.paymentId
        }
      });

      if (payment?.code !== undefined) {
        console.error(`PortOne 오류 [${payment.code}]: ${payment.message}`);
        setPaymentStatus({
          // ★ 실패 상태로 변경
          status: 'FAILED',
          message: payment.message ?? '결제 오류 발생' // 오류 메시지 사용
        });
      }

      const completeResponse = await postAfterValidator({
        paymentId: data.data.paymentId,
        txId: payment?.txId ? payment.txId : '',
        failReason: payment?.code ? payment.message! : ''
      });

      if (!completeResponse) {
        console.error('사후검증 실패');
        setPaymentStatus({
          status: 'FAILED',
          message: '결제 최종 확인에 실패했습니다. 고객센터에 문의해주세요.'
        });
        return;
      }

      if (completeResponse.message === '결제 실패 처리 완료') {
        setPaymentStatus({
          status: 'FAILED',
          message: '결제 최종 확인에 실패했습니다.'
        });
        return;
      }
      // ★ 모든 단계 성공 시 PAID 상태로 변경
      setPaymentStatus({ status: 'PAID' });
      console.log(completeResponse);

      setResData(completeResponse);
      console.log('결제 및 사후검증 완료');
    } catch (error) {
      // 처리되지 않은 예외 발생 시
      console.error('usePayment 훅 결제 처리 중 예상치 못한 오류:', error);
      setPaymentStatus({
        // ★ 실패 상태로 변경
        status: 'FAILED',
        message: '결제 처리 중 시스템 오류가 발생했습니다.' // 일반적인 오류 메시지
      });
    }
  };

  const resetStatus = () => setPaymentStatus({ status: 'IDLE' });

  return { paymentStatus, requestPayment, resetStatus, resData };
}
