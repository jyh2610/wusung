import request from '@/shared/api/axiosInstance';
import { ICategoryLeaf, IContent, IRegUser, IUser } from '../type.dto';
import { IRes } from '@/shared/type';
import { getLocalStorageValue } from '@/lib/utils';

export const eduContentReg = async (
  content: IContent,
  imageFiles: File[] // Multiple image files
) => {
  try {
    // Create FormData object for sending the request
    const formData = new FormData();

    // 좌표 정보를 서버 형식에 맞게 변환
    const processedOverlays: {
      fileIndex: number;
      x: any;
      y: any;
      width: any;
      height: any;
      alignment: string; // 기본값 설정
      type: string; // 기본값 설정
      fixedText: string; // 기본값 설정
    }[] = [];

    // imageCoordinates 배열에서 각 이미지의 좌표 정보를 변환
    if (Array.isArray(content.overlays)) {
      content.overlays.forEach((coordinates, fileIndex) => {
        if (Array.isArray(coordinates)) {
          coordinates.forEach(rect => {
            processedOverlays.push({
              fileIndex: fileIndex,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              alignment: 'center', // 기본값 설정
              type: 'image', // 기본값 설정
              fixedText: '' // 기본값 설정
            });
          });
        }
      });
    }

    // Prepare eduContentRegisterDTO with dynamic values
    const eduContentRegisterDTO = {
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
            ]
    };

    // Append eduContentRegisterDTO as a JSON string to FormData
    formData.append(
      'eduContentRegisterDTO',
      JSON.stringify(eduContentRegisterDTO)
    );

    // 이미지 파일 추가
    imageFiles.forEach((file, index) => {
      formData.append('files', file);
    });

    // 디버깅 로그
    console.log(
      'FormData DTO:',
      JSON.stringify(eduContentRegisterDTO, null, 2)
    );
    console.log('Files count:', imageFiles.length);

    const userInfo = getLocalStorageValue('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : '';

    // 요청 보내기
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

    return res.data.data; // ✅ TypeScript 경고 우회
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    return [];
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
  year: string;
  month: string;
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
