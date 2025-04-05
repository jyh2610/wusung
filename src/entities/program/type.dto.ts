export interface IOverlay {
  fileIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  alignment: string;
  type: string;
  fixedText: string;
}

export interface IContent {
  eduContentId?: number;
  title: string;
  difficultyLevel: number;
  categoryId: number;
  year: number;
  month: number;
  viewCount?: number;
  description?: string;
  isUsed?: boolean;
  createdAt?: string;
  overlays?: IOverlay[];
}
export interface ScheduleItem {
  content: string;
  eduContentId: number;
}
export interface Schedule {
  [key: number]: {
    cognitive?: ScheduleItem;
    daily?: ScheduleItem;
  };
}

// 카테고리 데이터 인터페이스
export interface ICategoryLeaf {
  categoryId: number; // ✅ 기존 id → categoryId로 수정
  name: string;
  used: boolean; // ✅ API 응답에 있는 used 추가
}

export interface IRegUser {
  name: string;
  birthDate: string;
  longTermNum: string;
  validate: string;
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
