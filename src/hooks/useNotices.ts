import { useState, useEffect } from 'react';
import { popupList, IPopupResponse } from '@/shared/api/common';

interface Notice {
  title: string;
  content: string;
  positionCode: 'L' | 'R' | 'M';
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

        console.log('API Response:', response);
        console.log('API Response data:', response?.data);
        console.log('API Response data.data:', response?.data?.data);

        if (response?.data?.data) {
          const transformedNotices = response.data.data.map(
            (notice: IPopupResponse) => {
              console.log('Individual notice:', notice);
              return {
                title: notice.title || '',
                content: notice.content || '',
                positionCode: notice.positionCode || 'L',
                priority: notice.priority || notice.popupId || 0
              };
            }
          );
          console.log('Transformed notices:', transformedNotices);
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
