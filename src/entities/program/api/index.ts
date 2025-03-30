import request from '@/shared/api/axiosInstance';
import { IContent } from '../type.dto';

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

    const userInfo = localStorage.getItem('userInfo');
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
  level,
  coverEduContentId,
  middleEduContentIds,
  mainEduContentIds
}: {
  year: number;
  month: number;
  level: 1 | 2 | 3;
  coverEduContentId: number;
  middleEduContentIds: number[];
  mainEduContentIds: number[];
}) => {
  try {
    const res = await request({
      method: 'POST',
      url: '/api/admin/schedule',
      data: {
        year,
        month,
        level,
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
