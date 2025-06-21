import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// utils/scheduleConverter.ts
import {
  CategoryNode,
  IContent,
  ICategoryLeaf
} from '@/entities/program/type.dto';
import { Schedule } from '@/entities/program/type.dto';
import { QueryClient } from '@tanstack/react-query';
export function convertToSchedule(
  data: any,
  allActivities: IContent[]
): Schedule {
  const result: Schedule = {};

  data.mainEduContentIds.forEach((ids: number[], index: number) => {
    if (!ids || ids.length === 0) return;

    const day = index + 1;

    const cognitiveId = ids[0];
    const dailyId = ids[1];

    const cognitiveActivity = allActivities.find(
      act => act.eduContentId === Number(cognitiveId)
    );
    const dailyActivity = allActivities.find(
      act => act.eduContentId === Number(dailyId)
    );

    const daySchedule: Schedule[number] = {};

    if (cognitiveActivity && cognitiveActivity.eduContentId !== undefined) {
      daySchedule.cognitive = {
        content: cognitiveActivity.title,
        id: cognitiveActivity.eduContentId
      };
    }

    if (dailyActivity && dailyActivity.eduContentId !== undefined) {
      daySchedule.daily = {
        content: dailyActivity.title,
        id: dailyActivity.eduContentId
      };
    }

    result[day] = daySchedule;
  });

  return result;
}

export const getlocalStorageValue = (key: string) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

export const setlocalStorageValue = (key: string, value: string) => {
  if (typeof window === 'undefined') return null;
  return localStorage.setItem(key, value);
};

// 로컬 스토리지의 userInfo에서 토큰을 쿠키에 동기화
export const syncTokenFromLocalStorage = () => {
  if (typeof window === 'undefined') return;

  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed.token) {
        // 쿠키에 토큰 저장 (middleware에서 사용)
        document.cookie = `token=${parsed.token}; path=/; SameSite=Lax`;
        return parsed.token;
      }
    }
  } catch (error) {
    console.error('토큰 동기화 실패:', error);
  }
  return null;
};

// 로컬 스토리지에서 토큰 가져오기
export const getTokenFromLocalStorage = () => {
  if (typeof window === 'undefined') return null;

  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.token || null;
    }
  } catch (error) {
    console.error('로컬 스토리지에서 토큰 가져오기 실패:', error);
  }
  return null;
};

type AnyTreeNode = Record<string, any>;

export function extractLeafNodes<T extends AnyTreeNode>(
  nodes: T[],
  childrenKey: keyof T = 'children' as keyof T
): T[] {
  const leaves: T[] = [];

  const traverse = (nodeList: T[]) => {
    nodeList.forEach(node => {
      const children = node[childrenKey] as T[] | undefined;

      if (!children || children.length === 0) {
        leaves.push(node);
      } else {
        traverse(children);
      }
    });
  };

  traverse(nodes);
  return leaves;
}
export const findEvaluationCategories = (
  nodes: CategoryNode[]
): CategoryNode[] => {
  const result: CategoryNode[] = [];

  const traverse = (nodeList: CategoryNode[]) => {
    for (const node of nodeList) {
      if (node.name === '평가자료') {
        result.push(node);
      }

      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(nodes);
  return result;
};

export const handleCurrentPathRoute = (id: string, pathname: string) => {
  const currentPath = pathname.replace(/\/$/, '');
  return `${currentPath}/${id}`;
};

export function getQueryClient() {
  return new QueryClient();
}
export const formatKoreanDate = (isoString: string) => {
  // isoString이 null 또는 undefined인 경우 빈 문자열 반환
  if (!isoString) {
    return '';
  }

  try {
    // 'T'를 기준으로 날짜 부분만 추출 (예: "2025-05-05")
    const datePart = isoString.split('T')[0];

    // 날짜 부분을 Date 객체로 파싱
    // 'YYYY-MM-DD' 형식은 Date 생성자 또는 Date.parse()로 잘 파싱됩니다.
    const date = new Date(datePart);

    // Date 객체에서 년, 월, 일을 가져옵니다.
    // getMonth()는 0부터 시작하므로 1을 더해야 합니다.
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
    const day = date.getDate();

    // 원하는 "YYYY년 MM월 DD일" 형식으로 조합
    // 월과 일은 10 미만일 경우 앞에 0을 붙여 두 자리로 만들 수 있습니다. (선택 사항)
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}년 ${formattedMonth}월 ${formattedDay}일`;
    // 또는 앞에 0을 붙이지 않고 싶다면:
    // return `${year}년 ${month}월 ${day}일`;
  } catch (error) {
    console.error('날짜 형식 변환 오류:', error);
    return '잘못된 날짜 형식'; // 파싱 실패 시 오류 메시지 반환
  }
};

export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * 비밀번호와 확인 값의 일치 여부를 확인합니다.
 */
export function validatePasswordMatch(
  password: string,
  confirm: string
): PasswordValidationResult {
  if (password !== confirm) {
    return {
      isValid: false,
      message: '비밀번호가 일치하지 않습니다.'
    };
  }

  return {
    isValid: true,
    message: ''
  };
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
export function maskLastThree(str: string): string {
  if (str.length <= 3) {
    return '***';
  }
  return str.slice(0, -3) + '***';
}

/**
 * cascader 옵션을 필터링하는 유틸 함수
 * @param categories 전체 카테고리 배열
 * @param selectedCategoryNode 현재 선택된 카테고리 노드
 * @param rootCategoryName 루트 카테고리 이름 (예: '활동지', '기타자료')
 * @returns 필터링된 카테고리 배열
 */
export const getCascaderOptions = (
  categories: ICategoryLeaf[],
  selectedCategoryNode: ICategoryLeaf | null,
  rootCategoryName: string
): ICategoryLeaf[] => {
  // selectedCategoryNode가 있으면 해당 노드와 그 하위 카테고리들을 모두 표시
  if (selectedCategoryNode) {
    const childCategories = categories.filter(
      category => category.parentId === selectedCategoryNode.categoryId
    );
    // 현재 선택된 노드와 그 하위 노드들을 모두 포함
    return [selectedCategoryNode, ...childCategories];
  }

  // selectedCategoryNode가 없으면 루트 카테고리와 그 하위 카테고리들을 모두 표시
  const rootCategory = categories.find(
    category => category.name === rootCategoryName
  );
  if (rootCategory) {
    const childCategories = categories.filter(
      category => category.parentId === rootCategory.categoryId
    );
    return [rootCategory, ...childCategories];
  }

  return [];
};
