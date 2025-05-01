export interface ICategory {
  categoryId: number;
  parentId: number | null;
  name: string;
  isUsed: boolean;
  children: ICategory[];
}
export interface IRes<T> {
  data: T;
  message: string;
}
export interface EduContentFile {
  fileId: number;
  fileName: string;
  fileUrl: string;
}

export interface OverlayLocation {
  // overlayLocations 안에 어떤 필드가 들어가는지 정확히 몰라서 임시로 any 처리
  [key: string]: any;
}

export interface EduContent {
  eduContentId: number;
  title: string;
  description: string;
  categoryId: number;
  difficultyLevel: number;
  files: EduContentFile[];
  overlayLocations: [];
  isUsed: boolean;
  viewCount: number;
  year: number;
  month: number;
  createdAt: string; // ISO 문자열
  updatedAt: string; // ISO 문자열
}
