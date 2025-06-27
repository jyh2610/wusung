import request from '@/shared/api/axiosInstance';
import {
  CategoryNode,
  CategoryResponse,
  ICategoryLeaf,
  IContent,
  IRegUser,
  IUser,
  IUserDetail
} from '../type.dto';
import { EduContent, IRes } from '@/shared/type';
import { extractLeafNodes, getlocalStorageValue } from '@/lib/utils';
import { toast } from 'react-toastify';

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
    console.log(content);
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

    const editDTO = {
      eduContentRegisterDTO: {
        title: content.title,
        difficultyLevel: content.difficultyLevel,
        categoryId: content.categoryId,
        year: content.year || 0,
        month: content.month || 0,
        description: content.description,
        isUsed: content.isUsed,
        existName: content.existName || [true],
        existMonth: content.existMonth || [true],
        existDay: content.existDay || [true],
        existDayOfWeek: content.existDayOfWeek || [true],
        existElderName: content.existElderName || [true],
        overlays: content.overlays
      },
      deletedFileIdList: deletedFileIds,
      overlayLocations: content.overlays
    };

    formData.append('editDTO', JSON.stringify(editDTO));

    // 이미지 파일 추가
    imageFiles.forEach(file => {
      formData.append('files', file);
    });

    const userInfo = getlocalStorageValue('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : '';
    console.log(editDTO);
    const res = await request({
      method: 'PUT',
      url: `/api/admin/edu-content/${eduContentId}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    toast.success('콘텐츠가 수정되었습니다.');
    return res.data;
  } catch (error) {
    toast.error('콘텐츠 수정에 실패했습니다.');
    console.error('Failed to update content:', error);
    throw error;
  }
};

export const eduContentReg = async (content: IContent, imageFiles: File[]) => {
  try {
    const formData = new FormData();
    console.log(content);

    // eduContentRegisterDTO 준비
    const eduContentRegisterDTO = {
      title: content.title,
      difficultyLevel: content.difficultyLevel,
      categoryId: content.categoryId,
      year: content.year || 0,
      month: content.month || 0,
      description: content.description || '',
      isUsed: content.isUsed || false,
      existName: content.existName,
      existMonth: content.existMonth,
      existDay: content.existDay,
      existDayOfWeek: content.existDayOfWeek,
      existElderName: content.existElderName,
      overlays: content.overlays
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
    console.log(imageFiles);
    const userInfo = getlocalStorageValue('userInfo');
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
    toast.success('콘텐츠가 등록되었습니다.');
    return res.data;
  } catch (error) {
    toast.error('콘텐츠 등록에 실패했습니다.');
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

export const updateSchedule = async ({
  scheduleId,
  year,
  month,
  difficultyLevel,
  coverEduContentId,
  middleEduContentIds,
  mainEduContentIds
}: {
  scheduleId: number;
  year: number;
  month: number;
  difficultyLevel: number;
  coverEduContentId: number;
  middleEduContentIds: number[];
  mainEduContentIds: number[][];
}) => {
  try {
    const res = await request({
      method: 'PUT',
      url: `/api/admin/schedule/${scheduleId}`,
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

export const getCategoryTree = async (): Promise<ICategoryLeaf[]> => {
  try {
    const res = await request<IRes<ICategoryLeaf[]>>({
      method: 'GET',
      url: '/api/program/use/category/tree/schedule'
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
        name: form.name || '',
        birthDate: form.birthDate,
        certificationStart: form.certificationStart,
        certificationEnd: form.certificationEnd,
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

export const getUserDetail = async (elderId: number) => {
  try {
    const res = await request<IRes<IUserDetail>>({
      method: 'GET',
      url: `/api/program/elder/${elderId}`
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async (elderId: number, form: IRegUser) => {
  try {
    const res = await request<IRes<IRegUser>>({
      method: 'PUT',
      url: `/api/program/elder/${elderId}`,
      data: {
        name: form.name || '',
        birthDate: form.birthDate,
        certificationStart: form.certificationStart,
        certificationEnd: form.certificationEnd,
        recipientNumber: form.longTermNum,
        disabilityGrade: form.grade,
        difficultyLevel: form.difficulty,
        managerName: form.servicer
      }
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteUser = async (elderId: number) => {
  try {
    await request<IRes<IUser[]>>({
      method: 'DELETE',
      url: `/api/program/elder/${elderId}`
    });
  } catch (error) {
    console.error('유저 삭제 실패');
  }
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

    toast.success(res.data.message);
    return res.data.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const getHistoryPlan = async ({
  elderId,
  year,
  month
}: {
  elderId: number;
  year: number;
  month: number;
}) => {
  try {
    const res = await request<IRes<IPlan>>({
      method: 'GET',
      url: `/api/program/use/plan/history/${elderId}/${year}/${month}`
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAdminPlan = async (scheduleId: number) => {
  try {
    const res = await request<IRes<IPlan>>({
      method: 'GET',
      url: `/api/admin/schedule/${scheduleId}`
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

    if (res.status === 4000) {
      toast.info(res.data.message);
    }
    return res.data.data;
  } catch (error) {
    console.error(error);
    toast.error('컨텐츠를 불러오는데 실패했습니다.');
  }
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
  ICategoryLeaf[] | undefined
> => {
  try {
    const res = await request<IRes<CategoryResponse>>({
      method: 'GET',
      url: `/api/program/use/category/tree/schedule`
    });

    return res.data.data;
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

export interface ISchedule {
  scheduleId: number;
  year: number;
  month: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  title: string;
  difficultyLevel: number;
}

export interface IScheduleListResponse {
  content: ISchedule[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getScheduleList = async ({
  year,
  month,
  difficultyLevel,
  page = 0,
  size = 10
}: {
  year: number;
  month: number;
  difficultyLevel: number;
  page?: number;
  size?: number;
}) => {
  try {
    const response = await request<IRes<IScheduleListResponse>>({
      method: 'GET',
      url: `/api/admin/schedule/list?year=${year}&month=${month}&difficultyLevel=${difficultyLevel}&page=${page}&size=${size}`
    });
    return response.data.data;
  } catch (error) {
    console.error('스케줄 목록 요청을 실패 했습니다.', error);
  }
};

export const getCategoryIndividualList = async () => {
  try {
    const res = await request<IRes<ICategoryLeaf[]>>({
      method: 'GET',
      url: `/api/program/use/category/tree/paging`
    });
    return res.data.data;
  } catch (error) {
    console.error('카테고리 개별 목록 요청을 실패 했습니다.', error);
  }
};

export const getContent = async (eduContentId: number) => {
  try {
    const res = await request<IRes<IContent>>({
      method: 'GET',
      url: `/api/program/use/content/${eduContentId}`
    });
    return res.data.data;
  } catch (error) {
    console.error('컨텐츠 조회 실패');
  }
};

export const getAdminContent = async (eduContentId: number) => {
  try {
    const res = await request<IRes<IContent>>({
      method: 'GET',
      url: `/api/admin/edu-content/${eduContentId}`
    });
    return res.data.data;
  } catch (error) {
    console.error('컨텐츠 조회 실패');
  }
};

export const getContentByIds = async (ids: number[]) => {
  try {
    const contents = await Promise.all(
      ids.map(async id => {
        const content = await getContent(id);
        return content;
      })
    );
    return contents.filter(
      (content): content is IContent => content !== undefined
    );
  } catch (error) {
    console.error('컨텐츠 조회 실패');
    return [];
  }
};

export const getAdminContentByIds = async (ids: number[]) => {
  try {
    const contents = await Promise.all(
      ids.map(async id => {
        const content = await getAdminContent(id);
        return content;
      })
    );
    return contents.filter(
      (content): content is IContent => content !== undefined
    );
  } catch (error) {
    console.error('컨텐츠 조회 실패');
    return [];
  }
};

export const printScheduleonly = async (
  elderId: number,
  mainEduContentIds: number[][],
  year: number,
  month: number
) => {
  try {
    const res = await request<Blob>({
      method: 'POST',
      url: `/api/program/use/print/calendar`,
      data: {
        year,
        month,
        mainEduContentIds
      },
      params: {
        elderId
      },
      headers: {
        Accept: 'application/pdf'
      },
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    toast.success('스케줄 출력 성공');
    return url;
  } catch (error) {
    toast.error((error as any).response.data.message);
    console.error('스케줄 출력 실패', error);
    return null;
  }
};
