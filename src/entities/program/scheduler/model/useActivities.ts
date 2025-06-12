import { useState, useEffect, useCallback } from 'react';
import { IContent } from '../../type.dto';
import { getContentList, getUserContentList } from '@/components/admin/api';

interface IProps {
  isAdmin: boolean;
  categoryId: number;
  difficultyLevel: number;
}

export function useActivities({
  isAdmin,
  categoryId,
  difficultyLevel
}: IProps) {
  const [activities, setActivities] = useState<IContent[]>([]);

  const fetchActivities = useCallback(
    async (options?: { categoryId: number; difficultyLevel: number }) => {
      try {
        const params = options ?? { categoryId, difficultyLevel }; // 파라미터가 없으면 현재 상태 사용
        const response = isAdmin
          ? await getContentList(params)
          : await getUserContentList(params);

        if (Array.isArray(response)) {
          setActivities(response);
        } else if (response && Array.isArray(response.content)) {
          setActivities(response.content);
        } else {
          setActivities([]);
        }
      } catch (error) {
        console.error('콘텐츠 목록 조회 실패:', error);
      }
    },
    [isAdmin, categoryId, difficultyLevel]
  ); // 의존성 추가

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]); // 함수에 의존하도록 수정

  return { activities, fetchActivities, setActivities };
}
