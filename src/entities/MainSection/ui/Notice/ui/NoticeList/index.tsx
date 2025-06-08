'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { listContainer, listBox, content, date } from './index.css';
import { getAnnouncementList } from '@/shared/api/common';
import { IAnnouncementResponse } from '@/shared/api/common';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

export function NoticeList() {
  const router = useRouter();
  const [hoveredList, setHoveredList] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<IAnnouncementResponse[]>(
    []
  );

  const fetchAnnouncements = async () => {
    try {
      const response = await getAnnouncementList({
        page: 0,
        size: 5
      });

      if (response.data) {
        const data = response.data.data.content;
        // topExposure가 true인 항목을 우선적으로 정렬
        const sortedData = data.sort((a, b) => {
          if (a.topExposure && !b.topExposure) return -1;
          if (!a.topExposure && b.topExposure) return 1;
          return 0;
        });
        // 상위 5개만 선택
        setAnnouncements(sortedData.slice(0, 5));
      }
    } catch (error) {
      console.error('공지사항을 불러오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy.MM.dd');
    } catch (error) {
      console.error('날짜 형식 오류:', error);
      return '날짜 오류';
    }
  };

  const handleClick = (announcementId: number) => {
    router.push(`/notice/dashboard/${announcementId}`);
  };

  return (
    <div className={listContainer} onMouseLeave={() => setHoveredList(null)}>
      {announcements.length > 0 ? (
        <>
          {announcements.map((item, index) => (
            <div
              key={item.announcementId}
              className={listBox}
              onMouseEnter={() => setHoveredList(index)}
              onClick={() => handleClick(item.announcementId)}
              style={{ cursor: 'pointer' }}
            >
              <p className={content}>{item.title}</p>
              {hoveredList === index ? (
                <Image
                  width={27.23}
                  height={21.47}
                  src={'/images/arrowRight.svg'}
                  alt={'arrowRight'}
                />
              ) : (
                <p className={date}>{formatDate(item.updatedAt)}</p>
              )}
            </div>
          ))}
          {Array.from({ length: 5 - announcements.length }).map((_, index) => (
            <div key={`empty-${index}`} className={listBox}>
              <p className={content} style={{ color: '#999' }}>
                공지사항이 없습니다
              </p>
            </div>
          ))}
        </>
      ) : (
        Array.from({ length: 5 }).map((_, index) => (
          <div key={`empty-${index}`} className={listBox}>
            <p className={content} style={{ color: '#999' }}>
              공지사항이 없습니다
            </p>
          </div>
        ))
      )}
    </div>
  );
}
