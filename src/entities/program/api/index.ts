import request from '@/shared/api/axiosInstance';
import {
  CategoryNode,
  CategoryResponse,
  ICategoryLeaf,
  IContent,
  IRegUser,
  IUser
} from '../type.dto';
import { EduContent, IRes } from '@/shared/type';
import { extractLeafNodes, getLocalStorageValue } from '@/lib/utils';
export const putEduContent = async ({
  eduContentId,
  content,
  deletedFileIds,
  imageFiles
}: {
  eduContentId: number; // 수정할 학습자료 ID
  content: IContent; // 수정할 내용
  deletedFileIds: number[]; // 삭제할 파일 ID 목록
  imageFiles: File[]; // 새로 추가할 이미지 파일들
}) => {
  try {
    const formData = new FormData();

    // 오버레이 처리
    const processedOverlays: {
      fileIndex: number;
      x: any;
      y: any;
      width: any;
      height: any;
      alignment: string;
      type: string;
      fixedText: string;
    }[] = [];

    if (Array.isArray(content.overlays)) {
      content.overlays.forEach((coordinates, fileIndex) => {
        if (Array.isArray(coordinates)) {
          coordinates.forEach(rect => {
            processedOverlays.push({
              fileIndex,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              alignment: rect.alignment || 'center',
              type: rect.type || 'image',
              fixedText: rect.fixedText || ''
            });
          });
        }
      });
    }

    // ✅ 중첩 없이 서버가 기대하는 구조로 만들기
    const requestBody = {
      title: content.title,
      difficultyLevel: content.difficultyLevel,
      categoryId: content.categoryId,
      year: content.year || 0,
      month: content.month || 0,
      description: content.description,
      isUsed: content.isUsed,
      overlays:
        processedOverlays.length > 0
          ? processedOverlays
          : [
              {
                fileIndex: 0,
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                alignment: 'center',
                type: 'image',
                fixedText: ''
              }
            ],
      deletedFileIdList: deletedFileIds,
      overlayLocations: processedOverlays
    };

    formData.append('eduContentRegisterDTO', JSON.stringify(requestBody));

    // 이미지 파일 추가
    imageFiles.forEach(file => {
      formData.append('files', file);
    });

    console.log('FormData payload:', JSON.stringify(requestBody, null, 2));
    console.log('Files count:', imageFiles.length);

    const userInfo = getLocalStorageValue('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : '';

    const res = await request({
      method: 'PUT',
      url: `/api/admin/edu-content/${eduContentId}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;
  } catch (error) {
    console.error('Failed to update content:', error);
    throw error;
  }
};

export const eduContentReg = async (content: IContent, imageFiles: File[]) => {
  try {
    const formData = new FormData();

    // 좌표 정보를 서버 형식에 맞게 변환
    const processedOverlays =
      content.overlays
        ?.map((coordinates, fileIndex) => {
          if (!Array.isArray(coordinates)) return [];

          return coordinates.map(rect => ({
            fileIndex,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            alignment: rect.alignment || 'M',
            type: rect.type || 'fixedText',
            fixedText: rect.fixedText || ''
          }));
        })
        .flat() || [];

    // eduContentRegisterDTO 준비
    const eduContentRegisterDTO = {
      title: content.title,
      difficultyLevel: content.difficultyLevel,
      categoryId: content.categoryId,
      year: content.year || 0,
      month: content.month || 0,
      description: content.description || '',
      isUsed: content.isUsed || false,
      existName: [content.existName || false],
      existMonth: [content.existMonth || false],
      existDay: [content.existDay || false],
      existDayOfWeek: [content.existDayOfWeek || false],
      existElderName: [content.existElderName || false],
      overlays:
        processedOverlays.length > 0
          ? processedOverlays
          : [
              {
                fileIndex: 0,
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                alignment: 'M',
                type: 'fixedText',
                fixedText: ''
              }
            ]
    };

    // FormData에 DTO 추가
    formData.append(
      'eduContentRegisterDTO',
      JSON.stringify(eduContentRegisterDTO)
    );

    // 이미지 파일 추가
    imageFiles.forEach(file => {
      formData.append('files', file);
    });

    const userInfo = getLocalStorageValue('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : '';

    const res = await request({
      method: 'POST',
      url: '/api/admin/edu-content/register',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;
  } catch (error) {
    console.error('Failed to register content:', error);
    throw error;
  }
};

interface IGetEduContent {
  categoryId: number;
  difficultyLevel: 1 | 2 | 3;
  year?: number;
  month?: number;
  page?: number;
  size?: number;
}

export const getEduContent = async ({
  categoryId,
  difficultyLevel,
  year,
  month,
  page,
  size
}: IGetEduContent) => {
  try {
    const res = await request({
      method: 'GET',
      url: '/api/admin,edu-content/list',
      params: {
        categoryId,
        difficultyLevel,
        year,
        month,
        page,
        size
      }
    });
  } catch (error) {
    console.error('콘텐츠 리스트 요청에 실패했습니다.', error);
  }
};

export const getList = async ({
  year,
  month,
  level
}: {
  year: number;
  month: number;
  level: 1 | 2 | 3;
}) => {
  try {
    const res = await request({
      method: 'GET',
      url: '/api/common/signup/username-check',
      params: {
        year,
        month,
        level
      }
    });
    return res.data;
  } catch (error) {
    console.error('스케줄 목록 요청을 실패 했습니다.', error);
  }
};

export const regSchedule = async ({
  year,
  month,
  difficultyLevel,
  coverEduContentId,
  middleEduContentIds,
  mainEduContentIds
}: {
  year: number;
  month: number;
  difficultyLevel: number;
  coverEduContentId: number;
  middleEduContentIds: number[];
  mainEduContentIds: number[][];
}) => {
  try {
    const res = await request({
      method: 'POST',
      url: '/api/admin/schedule',
      data: {
        year,
        month,
        difficultyLevel,
        coverEduContentId,
        middleEduContentIds,
        mainEduContentIds
      }
    });
    return res.data;
  } catch (error) {
    console.error('스케줄 등록에 실패 했습니다.', error);
  }
};

export const getCategoryLeaf = async (): Promise<ICategoryLeaf[]> => {
  try {
    const res = await request<IRes<ICategoryLeaf[]>>({
      method: 'GET',
      url: '/api/admin/edu-content/category/leaf'
    });

    return res.data.data; // ✅ TypeScript 경고 우회
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    return [];
  }
};

export const submitAddUser = async (form: IRegUser) => {
  try {
    const res = await request<IRes<ICategoryLeaf[]>>({
      method: 'POST',
      url: '/api/program/elder',
      data: {
        name: form.name,
        birthDate: form.birthDate,
        certificationStart: form.validate,
        certificationEnd: form.validate,
        recipientNumber: form.longTermNum,
        disabilityGrade: form.grade,
        difficultyLevel: form.difficulty,
        managerName: form.servicer
      }
    });

    return res.data.data;
  } catch (error) {
    console.error('등록 실패:', error);
    throw error; // ✅ 에러를 다시 던져서 상위에서 catch 가능하게
  }
};

export const getUser = async () => {
  try {
    const res = await request<IRes<IUser[]>>({
      method: 'GET',
      url: '/api/program/elder/list'
    });
    return res.data.data;
  } catch {}
};

export interface IPlan {
  year: number;
  month: number;
  difficultyLevel: 1 | 2 | 3;
  coverEduContentId: number;
  middleEduContentIds: number[];
  mainEduContentIds: number[][];
}

export const getPlan = async ({
  year,
  month,
  difficultyLevel
}: {
  year: number;
  month: number;
  difficultyLevel: number;
}) => {
  try {
    const res = await request<IRes<IPlan>>({
      method: 'GET',
      url: `/api/program/use/plan/${year}/${month}/${difficultyLevel}`
    });

    return res.data.data;
  } catch (error) {
    console.error(error);
  }
};

export interface PrintPDFPayload {
  year: number;
  month: number;
  difficultyLevel: number;
  coverEduContentId: number;
  middleEduContentIds: number[];
  mainEduContentIds: number[][];
  noPrintDate: boolean;
}

export const printPDF = async (
  elderId: number,
  payload: PrintPDFPayload
): Promise<string | null> => {
  try {
    const res = await request<Blob>({
      method: 'POST',
      url: `/api/program/use/print?elderId=${elderId}`,
      data: payload,
      headers: {
        Accept: 'application/pdf'
      },
      responseType: 'blob'
    });

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error('📄 PDF 요청 실패:', error);
    return null;
  }
};

export const searchContent = async (eduContentId: number) => {
  try {
    const res = await request<IRes<IContent>>({
      method: 'GET',
      url: `/api/admin/edu-content/${eduContentId}`
    });

    return res.data.data;
  } catch (error) {}
};

export const deleteContent = async (eduContentId: number) => {
  try {
    await request<IRes<IContent>>({
      method: 'delete',
      url: `/api/admin/edu-content/${eduContentId}`
    });
  } catch (error) {
    console.error('콘텐츠 삭제 실패');
  }
};

export const getUserCategoryTree = async (): Promise<
  | {
      data: CategoryResponse;
      leafList: ICategoryLeaf[];
    }
  | undefined
> => {
  try {
    const res = await request<IRes<CategoryResponse>>({
      method: 'GET',
      url: `/api/program/use/category/tree`
    });

    const treeData = res.data.data;
    if (!treeData) return undefined;

    // 리프만 추출
    const leaves = extractLeafNodes<CategoryNode>(treeData);

    // ✅ 필요한 형태로 변환
    const leafList: ICategoryLeaf[] = leaves.map(leaf => ({
      categoryId: leaf.categoryId,
      name: leaf.name,
      used: leaf.isUsed
    }));

    return { data: res.data.data, leafList };
  } catch (error) {
    console.error('getUserCategoryTree error:', error);
  }
};

export const printUserPrint = async (printLIst: number[]) => {
  try {
    const res = await request<Blob>({
      method: 'POST',
      url: `/api/program/use/each/print`,
      data: printLIst,
      headers: {
        Accept: 'application/pdf'
      },
      responseType: 'blob'
    });

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.log(error);
  }
};
export const getDetailContent = async (
  categoryId: number
): Promise<IContent[]> => {
  const res = await request<IContent[]>({
    method: 'GET',
    url: `/api/content/detail?categoryId=${categoryId}`
  });
  return res.data ?? [];
};
