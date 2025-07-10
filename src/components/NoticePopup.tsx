import { Button } from '@/shared/ui';
import React, { useEffect, useState } from 'react';

interface Notice {
  title: string;
  content: string;
  positionCode: 'L' | 'R' | 'M'; // Left, Right, Center
  priority: number;
  announcementId: number; // 추가된 필드
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

  console.log('Original notices:', notices);
  console.log(dontShowTodayState);

  const handleDontShowToday = (announcementId: number) => {
    setDontShowTodayState(prev => [...prev, announcementId]);
    // 로컬 스토리지에 저장
    const today = new Date().toDateString();
    const storedNotices = JSON.parse(
      localStorage.getItem('noticePopupLastClosed') || '[]'
    );
    localStorage.setItem(
      'noticePopupLastClosed',
      JSON.stringify([...storedNotices, { id: announcementId, date: today }])
    );
    handleClose(announcementId);
  };

  const handleClose = (announcementId: number) => {
    setClosedNotices(prev => [...prev, announcementId]);
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

  // 모든 공지사항이 닫혔는지 확인
  useEffect(() => {
    const totalNotices = notices.length;
    const closedAndDontShowToday = Array.from(
      new Set([...closedNotices, ...dontShowTodayState])
    );
    if (closedAndDontShowToday.length === totalNotices) {
      onClose();
    }
  }, [closedNotices, dontShowTodayState, notices.length, onClose]);

  console.log('Closed notices:', closedNotices);
  console.log('Dont show today state:', dontShowTodayState);

  // 포지션별로 공지사항 그룹화하고 각각 priority로 정렬
  const leftNotices = notices
    .filter(notice => {
      const positionCode = String(notice.positionCode).toUpperCase();
      const isLeft = positionCode === 'L';
      const isNotClosed = !closedNotices.includes(notice.announcementId);
      const isNotDontShowToday = !dontShowTodayState.includes(
        notice.announcementId
      );
      console.log(
        `Notice ${notice.title}: positionCode="${notice.positionCode}" (type: ${typeof notice.positionCode}), normalized="${positionCode}", isLeft=${isLeft}, isNotClosed=${isNotClosed}, isNotDontShowToday=${isNotDontShowToday}`
      );
      return isLeft && isNotClosed && isNotDontShowToday;
    })
    .sort((a, b) => a.priority - b.priority); // priority 낮은 순으로 정렬

  const centerNotices = notices
    .filter(notice => {
      const positionCode = String(notice.positionCode).toUpperCase();
      const isCenter = positionCode === 'M';
      const isNotClosed = !closedNotices.includes(notice.announcementId);
      const isNotDontShowToday = !dontShowTodayState.includes(
        notice.announcementId
      );
      console.log(
        `Notice ${notice.title}: positionCode="${notice.positionCode}" (type: ${typeof notice.positionCode}), normalized="${positionCode}", isCenter=${isCenter}, isNotClosed=${isNotClosed}, isNotDontShowToday=${isNotDontShowToday}`
      );
      return isCenter && isNotClosed && isNotDontShowToday;
    })
    .sort((a, b) => a.priority - b.priority); // priority 낮은 순으로 정렬

  const rightNotices = notices
    .filter(notice => {
      const positionCode = String(notice.positionCode).toUpperCase();
      const isRight = positionCode === 'R';
      const isNotClosed = !closedNotices.includes(notice.announcementId);
      const isNotDontShowToday = !dontShowTodayState.includes(
        notice.announcementId
      );
      console.log(
        `Notice ${notice.title}: positionCode="${notice.positionCode}" (type: ${typeof notice.positionCode}), normalized="${positionCode}", isRight=${isRight}, isNotClosed=${isNotClosed}, isNotDontShowToday=${isNotDontShowToday}`
      );
      return isRight && isNotClosed && isNotDontShowToday;
    })
    .sort((a, b) => a.priority - b.priority); // priority 낮은 순으로 정렬

  // 디버깅을 위한 로그 추가
  console.log('Left notices:', leftNotices);
  console.log('Center notices:', centerNotices);
  console.log('Right notices:', rightNotices);

  const renderNoticeStack = (
    notices: Notice[],
    position: 'left' | 'center' | 'right'
  ) => {
    if (notices.length === 0) return null;

    const positionClasses = {
      left: 'left-4',
      center: 'left-1/2 -translate-x-1/2',
      right: 'right-4'
    };

    console.log(`Rendering ${position} stack with ${notices.length} notices`);

    return (
      <div
        className={`fixed top-4 ${positionClasses[position]} w-full max-w-[500px] px-4`}
        style={{
          ...(position === 'right' && { right: '16px', left: 'auto' }),
          ...(position === 'left' && { left: '16px', right: 'auto' }),
          ...(position === 'center' && {
            left: '49%',
            transform: 'translateX(-45%)',
            right: 'auto'
          })
        }}
      >
        {notices.map((notice, index) => (
          <div
            key={notice.announcementId}
            className="bg-white p-6 rounded-lg shadow-lg pointer-events-auto border-2 border-gray-300"
            style={{
              zIndex: 10000 + index, // z-index로 겹쳐서 쌓이도록
              position: 'absolute',
              marginTop: index * 50, // 인덱스에 따라 10px씩 아래로
              left: 0,
              right: 0,
              width: '100%'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 m-0">
                {notice.title}
              </h2>
              <button
                onClick={() => handleClose(notice.announcementId)}
                className="text-2xl text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="text-gray-600 leading-relaxed mb-4">
              <div dangerouslySetInnerHTML={{ __html: notice.content }} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`dontShowToday-${notice.announcementId}`}
                checked={dontShowTodayState.includes(notice.announcementId)}
                onChange={e => {
                  if (e.target.checked) {
                    handleDontShowToday(notice.announcementId);
                  }
                }}
                className="w-4 h-4"
              />
              <label
                htmlFor={`dontShowToday-${notice.announcementId}`}
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
                  onClick={() => handleDontShowToday(notice.announcementId)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {renderNoticeStack(leftNotices, 'left')}
      {renderNoticeStack(centerNotices, 'center')}
      {renderNoticeStack(rightNotices, 'right')}
    </div>
  );
};

export default NoticePopup;
