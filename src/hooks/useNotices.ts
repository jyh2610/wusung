import { useState, useEffect } from 'react';

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
        // API 엔드포인트를 실제 URL로 변경해주세요
        const response = await fetch('/api/notices');
        if (!response.ok) {
          throw new Error('공지사항을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setNotices(data);
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