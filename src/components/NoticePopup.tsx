import { Button } from '@/shared/ui';
import React, { useEffect, useState } from 'react';

interface Notice {
  title: string;
  content: string;
  positionCode: 'L' | 'R' | 'C'; // Left, Right, Center
  priority: number;
}

interface NoticePopupProps {
  notices: Notice[];
  onClose: () => void;
  dontShowToday: boolean;
  setDontShowToday: (value: boolean) => void;
}

const NoticePopup: React.FC<NoticePopupProps> = ({
  notices,
  onClose,
  dontShowToday,
  setDontShowToday
}) => {
  const [closedNotices, setClosedNotices] = useState<number[]>([]);
  const [dontShowTodayState, setDontShowTodayState] = useState<number[]>([]);

  // 우선순위에 따라 정렬
  const sortedNotices = [...notices].sort((a, b) => a.priority - b.priority);

  const handleDontShowToday = (noticeId: number) => {
    setDontShowTodayState(prev => [...prev, noticeId]);
    // 로컬 스토리지에 저장
    const today = new Date().toDateString();
    const storedNotices = JSON.parse(
      localStorage.getItem('noticePopupLastClosed') || '[]'
    );
    localStorage.setItem(
      'noticePopupLastClosed',
      JSON.stringify([...storedNotices, { id: noticeId, date: today }])
    );
    handleClose(noticeId);
  };

  const handleClose = (noticeId: number) => {
    setClosedNotices(prev => [...prev, noticeId]);
  };

  useEffect(() => {
    // 오늘 이미 닫은 공지사항 확인
    const storedNotices = JSON.parse(
      localStorage.getItem('noticePopupLastClosed') || '[]'
    );
    const today = new Date().toDateString();
    const todayClosedNotices = storedNotices
      .filter((item: { id: number; date: string }) => item.date === today)
      .map((item: { id: number }) => item.id);
    setDontShowTodayState(todayClosedNotices);
  }, []);

  const getPositionClass = (positionCode: string) => {
    switch (positionCode) {
      case 'L':
        return 'left-4';
      case 'R':
        return 'right-4';
      case 'C':
        return 'left-1/2 -translate-x-1/2';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  // 모든 공지사항이 닫혔는지 확인
  useEffect(() => {
    if (closedNotices.length === sortedNotices.length) {
      onClose();
    }
  }, [closedNotices, sortedNotices.length, onClose]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div className="fixed top-4 flex flex-col gap-4 w-full max-w-[500px] px-4">
        {sortedNotices.map((notice, index) => {
          if (
            closedNotices.includes(notice.priority) ||
            dontShowTodayState.includes(notice.priority)
          ) {
            return null;
          }
          return (
            <div
              key={index}
              className={`bg-white p-6 rounded-lg shadow-lg relative ${getPositionClass(notice.positionCode)} pointer-events-auto`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 m-0">
                  {notice.title}
                </h2>
                <button
                  onClick={() => handleClose(notice.priority)}
                  className="text-2xl text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <div className="text-gray-600 leading-relaxed mb-4">
                {notice.content}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`dontShowToday-${notice.priority}`}
                  checked={dontShowTodayState.includes(notice.priority)}
                  onChange={e => {
                    if (e.target.checked) {
                      handleDontShowToday(notice.priority);
                    }
                  }}
                  className="w-4 h-4"
                />
                <label
                  htmlFor={`dontShowToday-${notice.priority}`}
                  className="text-sm text-gray-600"
                >
                  오늘 하루 동안 열지 않기
                </label>
                <div
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '70px',
                    height: '26px',
                    marginLeft: 'auto'
                  }}
                >
                  <Button
                    type="borderBrand"
                    content="확인"
                    onClick={() => handleDontShowToday(notice.priority)}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div>
          <label>
            <input
              type="checkbox"
              checked={dontShowToday}
              onChange={e => setDontShowToday(e.target.checked)}
            />
            오늘 하루 보지 않기
          </label>
        </div>
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '70px',
            height: '26px',
            marginLeft: 'auto'
          }}
        >
          <Button type="borderBrand" content="확인" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;
