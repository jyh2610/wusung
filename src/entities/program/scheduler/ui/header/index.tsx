'use client';

import React from 'react';
import { MdLocalPrintshop } from 'react-icons/md';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  headerContainer,
  titleStyle,
  printButton,
  iconStyle
} from './index.css';

import { Schedule } from '@/entities/program/type.dto';
import { formatScheduleData } from '../../utils';
import { printPDF, regSchedule } from '@/entities/program/api';
import { useUserStore } from '@/shared/stores/useUserStore';
import { useDateStore } from '@/shared/stores/useDateStores'; // ✅ 전역 상태 store
import { toast } from 'react-toastify';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';

function Header({
  isAdmin,
  schedule
}: {
  isAdmin: boolean;
  schedule: Schedule;
}) {
  // ✅ 전역 날짜 상태 사용
  const { year, month, setYear, setMonth } = useDateStore();
  const mainEduContentIds = formatScheduleData(schedule, year, month);
  const { coverItems, etcItems, noPrintDate } = useScheduleStore(state => ({
    coverItems: state.coverItems,
    etcItems: state.etcItems,
    noPrintDate: state.noPrintDate,
    toggleNoPrintDate: state.toggleNoPrintDate
  }));

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

      console.log('Printing with coverEduContentId:', coverItemId);
      console.log('Printing with main:', mainEduContentIds);

      const pdfUrl = await printPDF(selectedUserId, {
        year,
        month,
        difficultyLevel: selectedUser.difficultyLevel,
        coverEduContentId: coverItemId!,
        middleEduContentIds,
        mainEduContentIds,
        noPrintDate
      });

      if (pdfUrl) {
        // 👉 iframe을 생성해서 자동 프린트
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
          }, 500); // 약간의 지연 필요
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
      <button type="button" onClick={handlePrevMonth}>
        <IoIosArrowBack size={20} />
      </button>

      <div className={titleStyle}>
        {year}년 {month}월
      </div>

      <button type="button" onClick={handleNextMonth}>
        <IoIosArrowForward size={20} />
      </button>

      {!isAdmin ? (
        <button className={printButton} type="button" onClick={print}>
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
    </div>
  );
}

export default Header;
