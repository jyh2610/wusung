import { useState, useEffect } from 'react';
import { popupList, IPopupResponse } from '@/shared/api/common';

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
        const response = await popupList();

        if (response?.data?.data) {
          const transformedNotices = response.data.data.map(
            (notice: IPopupResponse) => ({
              title: notice.title || '',
              content: notice.content || '',
              positionCode: 'C' as const,
              priority: notice.popupId || 0
            })
          );
          setNotices(transformedNotices);
        } else {
          setNotices([]);
        }
      } catch (err) {
        console.error('공지사항을 불러오는 중 오류가 발생했습니다:', err);
        setNotices([]);
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return { notices, loading, error };
};
