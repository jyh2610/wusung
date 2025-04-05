import React from 'react';
import { MdLocalPrintshop } from 'react-icons/md';
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
import { toast } from 'react-toastify';

function Header({
  isAdmin,
  schedule
}: {
  isAdmin: boolean;
  schedule: Schedule;
}) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const mainEduContentIds = formatScheduleData(schedule);
  const selectedUserId = useUserStore(state => state.selectedUserId);
  const users = useUserStore.getState().users;
  const selectedUser = users.find(user => user.elderId === selectedUserId);

  const regScheduleHandler = async () => {
    try {
      await regSchedule({
        year: 2025,
        month: 1,
        difficultyLevel: 1,
        coverEduContentId: 2,
        middleEduContentIds: [3, 4],
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

      const pdfUrl = await printPDF(selectedUserId, {
        year: 2025,
        month: 3,
        difficultyLevel: selectedUser.difficultyLevel, // 💡 여기!
        coverEduContentId: 2,
        middleEduContentIds: [3, 4],
        mainEduContentIds: mainEduContentIds
      });

      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = '교육계획표.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('PDF 다운로드 완료!');
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
      <div className={titleStyle}>
        {year}년 {month}월
      </div>
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
