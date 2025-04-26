import { useState, useEffect } from 'react';
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

  const fetchActivities = async (options = { categoryId, difficultyLevel }) => {
    console.log(isAdmin);

    try {
      const response = isAdmin
        ? await getContentList(options)
        : await getUserContentList(options);

      setActivities(response || []);
    } catch (error) {
      console.error('콘텐츠 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [categoryId, difficultyLevel]);

  return { activities, fetchActivities, setActivities };
}
