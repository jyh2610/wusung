'use client';

import { useState, useEffect } from 'react';
import NoticePopup from './NoticePopup';
import { useNotices } from '@/hooks/useNotices';

export const NoticePopupWrapper = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [dontShowToday, setDontShowToday] = useState(false);
  const { notices, loading, error } = useNotices();

  // 컴포넌트 마운트 시 로컬 스토리지에서 상태 확인
  useEffect(() => {
    const lastClosedTime = localStorage.getItem('noticeLastClosed');
    const now = new Date().getTime();

    // 24시간이 지났거나 처음 방문한 경우에만 팝업 표시
    if (lastClosedTime) {
      const timeDiff = now - parseInt(lastClosedTime);
      if (timeDiff < 24 * 60 * 60 * 1000) {
        // 24시간
        setShowPopup(false);
      }
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    if (dontShowToday) {
      localStorage.setItem('noticeLastClosed', new Date().getTime().toString());
    } else {
      localStorage.removeItem('noticeLastClosed');
    }
  };

  if (!showPopup || loading || error || notices.length === 0) {
    return null;
  }

  return (
    <NoticePopup
      notices={notices}
      onClose={handleClose}
      dontShowToday={dontShowToday}
      setDontShowToday={setDontShowToday}
    />
  );
};
