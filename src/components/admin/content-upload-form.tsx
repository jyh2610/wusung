'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { IContent } from '@/entities/program/type.dto';
import { eduContentReg, putEduContent } from '@/entities/program/api';
import { X } from 'lucide-react';
import { getCategoryLeaf, getCategoryList } from './api';
import { ICategory, ILeafCategory, IRes } from '@/shared/type';
import request from '@/shared/api/axiosInstance';
import ImageEditor from './ImageEditor/index';

export interface EduContentFile {
  fileId: number;
  fileName: string;
  fileUrl: string;
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
  existName: boolean;
  existMonth: boolean;
  existDay: boolean;
  existDayOfWeek: boolean;
  existElderName: boolean;
}
// 좌표 타입 정의
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
const customStyles = {
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#f0f0f0' : 'white',
    color: '#333',
    '&:hover': {
      backgroundColor: '#f0f0f0'
    }
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'white'
  }),
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'white'
  })
};
export function ContentUploadForm() {
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const router = useRouter();
  const [category, setCategory] = useState<ILeafCategory[]>([]);
  const now = new Date();
  const nextMonth = now.getMonth() + 2 > 12 ? 1 : now.getMonth() + 2;
  const nextYear =
    now.getMonth() + 2 > 12 ? now.getFullYear() + 1 : now.getFullYear();

  const [form, setForm] = useState<IContent>({
    title: '',
    difficultyLevel: 1,
    categoryId: 0,
    year: nextYear,
    month: nextMonth,
    description: '',
    isUsed: true,
    overlays: [],
    existName: [],
    existMonth: [],
    existDay: [],
    existDayOfWeek: [],
    existElderName: []
  });

  useEffect(() => {
    const fetchContent = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await request<IRes<EduContent>>({
          method: 'GET',
          url: `/api/admin/edu-content/${id}`,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const obj = res.data.data;
        setForm({
          title: obj.title,
          difficultyLevel: obj.difficultyLevel,
          categoryId: obj.categoryId,
          year: obj.year,
          month: obj.month,
          description: obj.description,
          isUsed: obj.isUsed,
          overlays: obj.overlayLocations,
          existName: Array.isArray(obj.existName)
            ? obj.existName
            : [obj.existName],
          existMonth: Array.isArray(obj.existMonth)
            ? obj.existMonth
            : [obj.existMonth],
          existDay: Array.isArray(obj.existDay) ? obj.existDay : [obj.existDay],
          existDayOfWeek: Array.isArray(obj.existDayOfWeek)
            ? obj.existDayOfWeek
            : [obj.existDayOfWeek],
          existElderName: Array.isArray(obj.existElderName)
            ? obj.existElderName
            : [obj.existElderName]
        });

        const processedFiles: string[] = obj.files.map(file => file.fileUrl);
        setFilePreviews(processedFiles);

        // 각 이미지별 좌표 초기화
        const initialCoordinates = processedFiles.map(() => []);
        setImageCoordinates(initialCoordinates);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContent();
  }, []);

  const [files, setFiles] = useState<File[]>([]);
  console.log(files);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [imageCoordinates, setImageCoordinates] = useState<Array<Rectangle[]>>(
    []
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategoryLeaf();
      if (res) {
        setCategory(res);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (field: keyof IContent, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    try {
      // overlays 가공: type이 'fixedText'일 때만 fixedText 포함
      const overlaysForSend = (form.overlays || []).map(overlay => {
        if (overlay.type === 'fixedText') {
          return {
            ...overlay,
            fixedText: overlay.fixedText ?? ''
          };
        } else {
          const { fixedText, ...rest } = overlay;
          return rest;
        }
      });

      // form 데이터를 1차원 배열로 변환
      const formData = {
        ...form,
        overlays: overlaysForSend
      };
      console.log(formData);
      if (id) {
        // 수정인 경우
        await putEduContent({
          eduContentId: Number(id),
          content: formData,
          deletedFileIds: [], // 삭제된 파일 ID 목록 (필요한 경우 구현)
          imageFiles: files
        });
      } else {
        // 새로 등록하는 경우
        await eduContentReg(formData, files);
      }
      setIsUploading(false);
      router.push('/admin/content');
    } catch (error) {
      console.error('업로드 중 오류 발생:', error);
      setIsUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    // 기존 배열 복사 후 false 추가
    setForm(prev => ({
      ...prev,
      existName: [...prev.existName, false],
      existMonth: [...prev.existMonth, false],
      existDay: [...prev.existDay, false],
      existDayOfWeek: [...prev.existDayOfWeek, false],
      existElderName: [...prev.existElderName, false]
    }));

    // 파일 추가
    setFiles(prev => [...prev, ...files]);

    // 이미지 미리보기 생성
    const previews = files.map(file => {
      return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = event => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then(newImages => {
      setFilePreviews(prev => [...prev, ...newImages]);

      // 새 이미지에 대한 좌표 배열 초기화
      const newCoordinates = [...imageCoordinates];
      newImages.forEach(() => newCoordinates.push([]));
      setImageCoordinates(newCoordinates);

      if (selectedImageIndex === null && newImages.length > 0) {
        setSelectedImageIndex(0);
      }
    });
  };

  const removeImage = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...filePreviews];
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);

    const newCoordinates = [...imageCoordinates];
    newCoordinates.splice(index, 1);
    setImageCoordinates(newCoordinates);

    // 불리언 배열에서도 해당 이미지의 데이터 제거
    setForm(prev => ({
      ...prev,
      existName: prev.existName.filter((_, i) => i !== index),
      existMonth: prev.existMonth.filter((_, i) => i !== index),
      existDay: prev.existDay.filter((_, i) => i !== index),
      existDayOfWeek: prev.existDayOfWeek.filter((_, i) => i !== index),
      existElderName: prev.existElderName.filter((_, i) => i !== index)
    }));

    if (selectedImageIndex === index) {
      if (newPreviews.length > 0) {
        setSelectedImageIndex(0);
      } else {
        setSelectedImageIndex(null);
      }
    } else if (selectedImageIndex !== null && selectedImageIndex > index) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // 이미지별 좌표 정보 업데이트 함수
  const updateImageCoordinates = (coordinates: Rectangle[][]) => {
    setImageCoordinates(coordinates);
    // form state의 overlays도 함께 업데이트
    handleChange('overlays', coordinates);
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="콘텐츠 제목을 입력하세요"
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="content-type">콘텐츠 유형</Label>
          <Select
            value={String(form.categoryId)}
            onValueChange={val => handleChange('categoryId', Number(val))}
          >
            <SelectTrigger id="content-type">
              <SelectValue placeholder="콘텐츠 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              {category.map(category => (
                <SelectItem
                  key={category.categoryId}
                  value={String(category.categoryId)}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="level-type">난이도</Label>
          <Select
            value={String(form.difficultyLevel)}
            onValueChange={val => handleChange('difficultyLevel', Number(val))}
          >
            <SelectTrigger id="level-type">
              <SelectValue placeholder="난이도 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">상</SelectItem>
              <SelectItem value="2">중</SelectItem>
              <SelectItem value="3">하</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="year">년도</Label>
          <Select
            value={String(form.year)}
            onValueChange={val => handleChange('year', Number(val))}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="년도 선택" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: 6 },
                (_, i) => new Date().getFullYear() + i
              ).map(year => (
                <SelectItem key={year} value={String(year)}>
                  {year}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="month">월</Label>
          <Select
            value={String(form.month)}
            onValueChange={val => handleChange('month', Number(val))}
          >
            <SelectTrigger id="month">
              <SelectValue placeholder="월 선택" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <SelectItem key={month} value={String(month)}>
                  {month}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <RadioGroup
          id="isUsed"
          value={form.isUsed ? 'true' : 'false'}
          onValueChange={value => handleChange('isUsed', value === 'true')}
          className="flex items-center space-x-6"
        >
          <Label htmlFor="isUsed">사용 여부</Label>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="isUsed-true" />
            <Label htmlFor="isUsed-true" className="cursor-pointer">
              사용
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="isUsed-false" />
            <Label htmlFor="isUsed-false" className="cursor-pointer">
              미사용
            </Label>
          </div>
        </RadioGroup>

        <div className="grid gap-3">
          <Label htmlFor="description">설명</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="콘텐츠에 대한 간략한 설명을 입력하세요"
            rows={4}
          />
        </div>

        <div className="grid gap-3">
          <Label>이미지 업로드</Label>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center gap-4">
              {selectedImageIndex !== null && filePreviews.length > 0 ? (
                <ImageEditor
                  image={filePreviews[selectedImageIndex]}
                  coordinates={imageCoordinates}
                  setCoordinates={updateImageCoordinates}
                  handleImageUpload={handleImageUpload}
                  imageIndex={selectedImageIndex}
                  existName={form.existName[selectedImageIndex]}
                  existMonth={form.existMonth[selectedImageIndex]}
                  existDay={form.existDay[selectedImageIndex]}
                  existDayOfWeek={form.existDayOfWeek[selectedImageIndex]}
                  existElderName={form.existElderName[selectedImageIndex]}
                  setExistName={value => {
                    const newExistName = [...form.existName];
                    newExistName[selectedImageIndex] = value;
                    handleChange('existName', newExistName);
                  }}
                  setExistMonth={value => {
                    const newExistMonth = [...form.existMonth];
                    newExistMonth[selectedImageIndex] = value;
                    handleChange('existMonth', newExistMonth);
                  }}
                  setExistDay={value => {
                    const newExistDay = [...form.existDay];
                    newExistDay[selectedImageIndex] = value;
                    handleChange('existDay', newExistDay);
                  }}
                  setExistDayOfWeek={value => {
                    const newExistDayOfWeek = [...form.existDayOfWeek];
                    newExistDayOfWeek[selectedImageIndex] = value;
                    handleChange('existDayOfWeek', newExistDayOfWeek);
                  }}
                  setExistElderName={value => {
                    const newExistElderName = [...form.existElderName];
                    newExistElderName[selectedImageIndex] = value;
                    handleChange('existElderName', newExistElderName);
                  }}
                  files={files}
                  setFiles={setFiles}
                />
              ) : (
                <ImageEditor
                  image=""
                  coordinates={[]}
                  setCoordinates={() => {}}
                  handleImageUpload={handleImageUpload}
                  imageIndex={0}
                  existName={form.existName[0]}
                  existMonth={form.existMonth[0]}
                  existDay={form.existDay[0]}
                  existDayOfWeek={form.existDayOfWeek[0]}
                  existElderName={form.existElderName[0]}
                  setExistName={value => {
                    const newExistName = [...form.existName];
                    newExistName[0] = value;
                    handleChange('existName', newExistName);
                  }}
                  setExistMonth={value => {
                    const newExistMonth = [...form.existMonth];
                    newExistMonth[0] = value;
                    handleChange('existMonth', newExistMonth);
                  }}
                  setExistDay={value => {
                    const newExistDay = [...form.existDay];
                    newExistDay[0] = value;
                    handleChange('existDay', newExistDay);
                  }}
                  setExistDayOfWeek={value => {
                    const newExistDayOfWeek = [...form.existDayOfWeek];
                    newExistDayOfWeek[0] = value;
                    handleChange('existDayOfWeek', newExistDayOfWeek);
                  }}
                  setExistElderName={value => {
                    const newExistElderName = [...form.existElderName];
                    newExistElderName[0] = value;
                    handleChange('existElderName', newExistElderName);
                  }}
                  files={files}
                  setFiles={setFiles}
                />
              )}

              {/* 이미지 썸네일 목록 */}
              {filePreviews.length > 0 && (
                <div className="mt-4 w-full">
                  <h3 className="text-sm font-medium mb-2">
                    업로드된 이미지 ({filePreviews.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {filePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className={`relative group cursor-pointer border-2 rounded-md overflow-hidden ${
                          selectedImageIndex === index
                            ? 'border-blue-500'
                            : 'border-gray-200'
                        }`}
                        style={{ width: '80px', height: '80px' }}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={preview}
                          alt={`썸네일 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X
                            size={16}
                            onClick={e => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                          />
                        </div>
                        {/* 좌표 개수 표시 */}
                        {imageCoordinates[index]?.length > 0 && (
                          <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-tl-md">
                            {imageCoordinates[index].length}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push('/admin/content')}
          >
            취소
          </Button>
          <Button type="button" disabled={isUploading} onClick={handleSubmit}>
            {isUploading ? '업로드 중...' : '콘텐츠 저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
