import { useState, useEffect } from 'react';
import { getContentList } from '@/components/admin/api';
import { IContent } from '../../type.dto';

export function useActivities() {
  const [activities, setActivities] = useState<IContent[]>([]);

  const fetchActivities = async (
    options = { categoryId: 1, difficultyLevel: 1 }
  ) => {
    try {
      const response = await getContentList(options);
      setActivities(response || []);
    } catch (error) {
      console.error('콘텐츠 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return { activities, fetchActivities, setActivities };
}
