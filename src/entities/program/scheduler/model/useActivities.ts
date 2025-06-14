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
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivities = useCallback(() => {
    setIsLoading(true);
    const params = { categoryId, difficultyLevel };

    const fetchData = async () => {
      try {
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
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, categoryId, difficultyLevel]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, fetchActivities, setActivities, isLoading };
}
