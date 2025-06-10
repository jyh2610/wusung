export interface IOverlay {
  fileIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  alignment: string;
  type: string;
  fixedText?: string;
}

export interface IContent {
  eduContentId?: number;
  title: string;
  difficultyLevel: number;
  categoryId: number;
  year: number;
  month: number;
  viewCount?: number;
  thumbnailUrl?: string;
  description: string;
  isUsed: boolean;
  existName: boolean[];
  existMonth: boolean[];
  existDay: boolean[];
  existDayOfWeek: boolean[];
  existElderName: boolean[];
  createdAt?: string;
  overlays: IOverlay[];
}

export interface ScheduleItem {
  content: string;
  id: number;
}
export interface Schedule {
  [key: number]: {
    cognitive?: ScheduleItem;
    daily?: ScheduleItem;
  };
}

// 카테고리 데이터 인터페이스
export interface ICategoryLeaf {
  categoryId: number;
  parentId: number | null;
  name: string;
  isUsed: boolean;
  children: ICategoryLeaf[];
}

export interface IRegUser {
  name: string;
  birthDate: string;
  longTermNum: string;
  certificationStart: string;
  certificationEnd: string;
  servicer: string;
  difficulty: string;
  grade: string;
}

export interface IUser {
  elderId: number;
  name: string;
  disabilityGrade: number;
  difficultyLevel: number;
  managerName: string;
}

export interface IUserDetail {
  elderId: number;
  memberId: number;
  name: string;
  birthDate: string;
  certificationStart: string;
  certificationEnd: string;
  recipientNumber: string;
  disabilityGrade: number;
  difficultyLevel: number;
  managerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryNode {
  categoryId: number;
  parentId: number | null; // 부모 ID가 없을 수 있으므로 null 허용
  name: string;
  isUsed: boolean;
  children: CategoryNode[]; // 자식 노드들도 동일한 구조를 가지므로 재귀적으로 참조
}

// API 응답 전체 (CategoryNode의 배열)를 나타내는 타입
export type CategoryResponse = CategoryNode[];

// API 응답 타입
export interface ICategoryTreeResponse {
  data: ICategoryLeaf[];
  message: string;
}
