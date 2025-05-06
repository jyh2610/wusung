'use client';

import { colors } from '@/design-tokens';
import { Button } from '@/shared/ui';
import { Benefit, PaymentBody } from './ui';
import { useState } from 'react';
import { Box, Modal } from '@mui/material';
import PaymentModal from './ui/paymentModal';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { getProductList } from './api';
import { productListDTO } from './types';
import { calculateDiscount } from './utils';
// MUI Modal 내용 중앙 정렬을 위한 스타일
const modalContentStyle = {
  position: 'absolute' as 'absolute', // 타입 단언
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550, // 모달 내용의 기본 너비 (필요에 따라 조정)
  bgcolor: 'background.paper', // 배경색 (흰색)
  boxShadow: 24, // 그림자 효과
  p: 4,
  borderRadius: '12px'
};

export function PaymentComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태 변수명 변경
  const [selectedPayment, setSelectedPayment] = useState<
    productListDTO | undefined
  >(undefined);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const page = 0;
  const size = 6;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['productList', page, size],
    queryFn: () => getProductList({ page, size })
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;

  return (
    <>
      <div style={{ width: '888px', margin: '0 auto' }}>
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
          <PaymentBody
            data={data?.data.content}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />
          <div
            style={{
              width: '240px',
              height: '56px',
              margin: '40px auto 0 auto' // 중앙 정렬
            }}
          >
            <Button content="결제하기" type="brand" onClick={handleOpenModal} />
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen} // 모달 열림 상태 전달
        onClose={handleCloseModal} // 외부 클릭 또는 Escape 키 눌렀을 때 호출될 함수 전달
        aria-labelledby="payment-modal-title"
        aria-describedby="payment-modal-description"
      >
        <Box sx={modalContentStyle}>
          <PaymentModal
            onClose={handleCloseModal}
            productName={selectedPayment?.name!}
            price={calculateDiscount({
              amount: selectedPayment?.price!,
              rate: selectedPayment?.discountRate!
            })}
          />
        </Box>
      </Modal>
    </>
  );
}
