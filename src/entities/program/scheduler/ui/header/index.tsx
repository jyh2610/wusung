'use client';

import React, { useState } from 'react';
import { MdLocalPrintshop } from 'react-icons/md';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  headerContainer,
  titleStyle,
  printButton,
  iconStyle
} from './index.css';
import { CircularProgress } from '@mui/material';
import { Schedule } from '@/entities/program/type.dto';
import { formatScheduleData } from '../../utils';
import { printPDF, regSchedule } from '@/entities/program/api';
import { useUserStore } from '@/shared/stores/useUserStore';
import { useDateStore } from '@/shared/stores/useDateStores'; // ✅ 전역 상태 store
import { toast } from 'react-toastify';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { Box, Button, Modal, Typography } from '@mui/material';

function Header({
  isAdmin,
  schedule
}: {
  isAdmin: boolean;
  schedule: Schedule;
}) {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [autoFillDate, setAutoFillDate] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  // ✅ 전역 날짜 상태 사용
  const { year, month, setYear, setMonth } = useDateStore();
  const mainEduContentIds = formatScheduleData(schedule, year, month);
  const { coverItems, etcItems, noPrintDate, disabledDrops } = useScheduleStore(
    state => ({
      disabledDrops: state.disabledDrops,
      coverItems: state.coverItems,
      etcItems: state.etcItems,
      noPrintDate: state.noPrintDate,
      toggleNoPrintDate: state.toggleNoPrintDate
    })
  );

  const handleOpenPrintModal = () => setIsPrintModalOpen(true);
  const handleClosePrintModal = () => setIsPrintModalOpen(false);

  const handlePrintConfirm = async () => {
    setIsPrinting(true);
    try {
      await print(); // 실제 인쇄 로직
      setIsPrintModalOpen(false);
    } catch (err) {
      // 예외 처리 시 모달 닫지 않음
    } finally {
      setIsPrinting(false);
    }
  };
  const selectedUserId = useUserStore(state => state.selectedUserId);
  const users = useUserStore.getState().users;
  const selectedUser = users.find(user => user.elderId === selectedUserId);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  // ✅ 비활성 날짜 필터링 적용한 mainEduContentIds 생성 함수
  const getFilteredMainEduContentIds = () => {
    const result: number[][] = [];
    const daysInMonth = new Date(year, month, 0).getDate(); // 👈 월에 맞는 일 수 계산

    for (let day = 1; day <= daysInMonth; day++) {
      const daySchedule = schedule[day];
      const cognitiveKey = `${day}-cognitive`;
      const dailyKey = `${day}-daily`;

      // 완전 비활성화된 날짜는 빈 배열로 유지
      if (disabledDrops.has(cognitiveKey) && disabledDrops.has(dailyKey)) {
        result.push([]); // 👈 이 부분이 핵심 (자리 맞추기 위해 [])
        continue;
      }

      const ids: number[] = [];

      if (!disabledDrops.has(cognitiveKey) && daySchedule?.cognitive?.id) {
        ids.push(daySchedule.cognitive.id);
      }

      if (!disabledDrops.has(dailyKey) && daySchedule?.daily?.id) {
        ids.push(daySchedule.daily.id);
      }

      result.push(ids);
    }

    return result;
  };

  const regScheduleHandler = async () => {
    try {
      const coverItemId =
        coverItems && coverItems.id !== 0 ? coverItems.id : null;
      // etcItems 배열에서 id만 추출 (middleEduContentIds로 사용 가정)
      const middleEduContentIds = etcItems.map(item => item.id);

      // 디버깅 로그 (API 호출 전 값 확인)
      console.log('Printing with coverEduContentId:', coverItemId);
      console.log('Printing with main:', mainEduContentIds);

      await regSchedule({
        year,
        month,
        difficultyLevel: 1,
        coverEduContentId: coverItemId!,
        middleEduContentIds: middleEduContentIds,
        mainEduContentIds: mainEduContentIds
      });
      toast.success('등록이 완료되었습니다!');
    } catch (error) {
      toast.error('등록이 실패되었습니다!');
    }
  };

  const print = async () => {
    try {
      if (!selectedUserId) {
        toast.error('사용자가 선택되지 않았습니다.');
        return;
      }

      if (!selectedUser) {
        toast.error('선택된 사용자 정보를 찾을 수 없습니다.');
        return;
      }

      const coverItemId =
        coverItems && coverItems.id !== 0 ? coverItems.id : null;
      const middleEduContentIds = etcItems.map(item => item.id);
      const mainEduContentIds = getFilteredMainEduContentIds();

      const pdfUrl = await printPDF(selectedUserId, {
        year,
        month,
        difficultyLevel: selectedUser.difficultyLevel,
        coverEduContentId: coverItemId!,
        middleEduContentIds,
        mainEduContentIds,
        noPrintDate: autoFillDate
      });

      if (pdfUrl) {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.src = pdfUrl;

        iframe.onload = () => {
          setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          }, 500);
        };

        document.body.appendChild(iframe);
      } else {
        toast.error('PDF 파일을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('프린트 에러:', error);
      toast.error('프린트 실패되었습니다!');
    }
  };

  return (
    <div className={headerContainer}>
      <div style={{ display: 'flex', gap: '32px' }}>
        <button
          style={{ cursor: 'pointer' }}
          type="button"
          onClick={handlePrevMonth}
        >
          <IoIosArrowBack size={30} />
        </button>

        <div className={titleStyle}>
          {year}년 {month}월
        </div>

        <button
          style={{ cursor: 'pointer' }}
          type="button"
          onClick={handleNextMonth}
        >
          <IoIosArrowForward size={30} />
        </button>
      </div>
      {!isAdmin ? (
        <button
          className={printButton}
          type="button"
          onClick={handleOpenPrintModal}
        >
          <MdLocalPrintshop className={iconStyle} size={24} />
          인쇄
        </button>
      ) : (
        <button
          className={printButton}
          type="button"
          onClick={regScheduleHandler}
        >
          등록
        </button>
      )}

      {isPrintModalOpen && (
        <Modal
          open={isPrintModalOpen}
          onClose={handleClosePrintModal}
          aria-labelledby="print-modal-title"
          aria-describedby="print-modal-description"
        >
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2
            }}
          >
            <Typography id="print-modal-title" variant="h6" component="h2">
              인쇄 확인
            </Typography>
            <Typography
              id="print-modal-description"
              sx={{ mt: 2, display: 'flex', gap: '8px' }}
            >
              <div>활동지 날짜 자동 설정</div>
              <input
                type="checkbox"
                checked={!autoFillDate}
                onChange={() => setAutoFillDate(prev => !prev)}
              />
            </Typography>
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrintConfirm}
                disabled={isPrinting}
                startIcon={
                  isPrinting && <CircularProgress size={20} color="inherit" />
                }
              >
                {isPrinting ? '인쇄 중...' : '인쇄'}
              </Button>
              <Button variant="outlined" onClick={handleClosePrintModal}>
                취소
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default Header;
