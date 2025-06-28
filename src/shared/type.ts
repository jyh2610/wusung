export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ICategory {
  categoryId: number;
  parentId: number | null;
  name: string;
  isUsed: boolean;
  children: ICategory[];
}

export interface ILeafCategory {
  categoryId: number;
  name: string;
  isUsed: boolean;
  parentId: number | null;
  children: ILeafCategory[];
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

export interface phoneVerificationDTO {
  code: string;
  phoneNum: string;
}
export interface IManager {
  name: string;
  jobGrade: string;
  phoneNumber: string;
  address: string;
  email: string;
  verificationCode?: string;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}
// Type for the 'pageable' object
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Type for the main 'data' object which contains content and pagination info
// This is a generic structure for paginated responses
export interface PaginatedResponse<T> {
  content: T[]; // The array of items (e.g., PaymentDetail[])
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number; // Appears redundant with pageable.pageSize, but matches JSON
  number: number; // Appears redundant with pageable.pageNumber, but matches JSON
  sort: Sort; // Appears redundant with pageable.sort, but matches JSON
  numberOfElements: number;
  first: boolean;
  empty: boolean; // Indicates if the content array is empty
}
