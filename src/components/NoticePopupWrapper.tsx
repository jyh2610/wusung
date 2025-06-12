'use client';

import { useState } from 'react';
import NoticePopup from './NoticePopup';
import { useNotices } from '@/hooks/useNotices';

export const NoticePopupWrapper = () => {
  const [showPopup, setShowPopup] = useState(true);
  const { notices, loading, error } = useNotices();

  if (!showPopup || loading || error || notices.length === 0) {
    return null;
  }

  return (
    <NoticePopup
      notices={notices}
      onClose={() => setShowPopup(false)}
    />
  );
}; 