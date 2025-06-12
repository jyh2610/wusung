import { useState, useEffect } from 'react';
import { getAnnouncementList } from '@/shared/api/common';

interface Notice {
  title: string;
  content: string;
  positionCode: 'L' | 'R' | 'C';
  priority: number;
}

export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await getAnnouncementList({
          page: 0,
          size: 10
        });
        
        if (response.data) {
          const transformedNotices = response.data.data.content.map(notice => ({
            title: notice.title,
            content: notice.topExposureTag || '',
            positionCode: 'C' as const,
            priority: notice.announcementId
          }));
          setNotices(transformedNotices);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return { notices, loading, error };
}; 