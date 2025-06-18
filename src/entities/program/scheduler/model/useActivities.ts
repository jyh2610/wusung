import { useState, useEffect, useCallback } from 'react';
import { IContent } from '../../type.dto';
import { getContentList, getUserContentList, ContentListResponse } from '@/components/admin/api';

interface IProps {
  isAdmin: boolean;
  categoryId: number;
  difficultyLevel: number;
  page?: number;
  size?: number;
}

export function useActivities({
  isAdmin,
  categoryId,
  difficultyLevel,
  page = 0,
  size = 15
}: IProps) {
  const [activities, setActivities] = useState<IContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchActivities = useCallback(() => {
    setIsLoading(true);
    const params = { 
      categoryId, 
      difficultyLevel,
      page: page - 1, // API는 0-based 페이지네이션을 사용
      size 
    };

    const fetchData = async () => {
      try {
        const response = isAdmin
          ? await getContentList(params)
          : await getUserContentList({
              categoryId,
              difficultyLevel,
              page: page - 1,
              size
            });

        if (Array.isArray(response)) {
          setActivities(response);
          setTotalElements(response.length);
          setTotalPages(Math.ceil(response.length / size));
        } else if (response && Array.isArray(response.content)) {
          setActivities(response.content);
          setTotalElements(response.totalElements || 0);
          setTotalPages(response.totalPages || 0);
        } else {
          setActivities([]);
          setTotalElements(0);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('콘텐츠 목록 조회 실패:', error);
        setActivities([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, categoryId, difficultyLevel, page, size]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { 
    activities, 
    fetchActivities, 
    setActivities, 
    isLoading,
    totalElements,
    totalPages
  };
}
