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
import ImageEditor from './ImageEditor';
import { IContent, IOverlay } from '@/entities/program/type.dto';
import { eduContentReg, putEduContent } from '@/entities/program/api';
import { X } from 'lucide-react';
import { getCategoryList } from './api';
import { EduContent, ICategory, IRes } from '@/shared/type';
import request from '@/shared/api/axiosInstance';

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
  console.log(id);

  const router = useRouter();
  const [category, setCategory] = useState<ICategory[]>([]);
  const [form, setForm] = useState<IContent>({
    title: '',
    difficultyLevel: 1,
    categoryId: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    description: '',
    isUsed: true,
    overlays: []
  });

  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [imageCoordinates, setImageCoordinates] = useState<IOverlay[][]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);

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
          overlays: obj.overlayLocations
        });
        const processedFiles: string[] = obj.files.map(file => file.fileUrl);

        setFilePreviews(processedFiles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      const updatedCoordinates =
        form?.overlays && form?.overlays[selectedImageIndex]
          ? [form?.overlays[selectedImageIndex]] // 'IOverlay[]'를 'IOverlay[][]'로 만들어줌
          : [];
      setImageCoordinates([updatedCoordinates]);
    }
  }, [selectedImageIndex, form?.overlays]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategoryList();
      if (res) {
        setCategory(res);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (field: keyof IContent, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    if (files.length > 0 || id !== null) {
      try {
        id !== null
          ? await putEduContent({
              eduContentId: Number(id),
              content: form,
              deletedFileIds: deletedFileIds,
              imageFiles: files
            })
          : await eduContentReg(form, files);
        setIsUploading(false);
        router.push('/admin/content');
      } catch (error) {
        console.error('업로드 중 오류 발생:', error);
        setIsUploading(false);
      }
    } else {
      setIsUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (uploadedFiles.length > 0) {
      // 기존 파일에 새 파일 추가
      const newFiles = [...files, ...uploadedFiles];
      setFiles(newFiles);

      // 이미지 미리보기 생성
      const previews = uploadedFiles.map(file => {
        return new Promise<string>(resolve => {
          const reader = new FileReader();
          reader.onload = event => {
            resolve(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previews).then(newImages => {
        const updatedPreviews = [...filePreviews, ...newImages];
        setFilePreviews(updatedPreviews);

        // 새 이미지에 대한 좌표 배열 초기화
        const newCoordinates = [...imageCoordinates];
        newImages.forEach(() => newCoordinates.push([]));
        setImageCoordinates(newCoordinates);

        // 첫 번째 이미지가 업로드되면 자동으로 선택
        if (selectedImageIndex === null && updatedPreviews.length > 0) {
          setSelectedImageIndex(0);
        }
      });
    }
  };

  const removeImage = (index: number, fileId: number | undefined) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...filePreviews];
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);

    const newCoordinates = [...imageCoordinates];
    newCoordinates.splice(index, 1);
    setImageCoordinates(newCoordinates);

    // Add the file ID to the deleted list (if it's defined)
    if (fileId !== undefined) {
      setDeletedFileIds(prev => [...prev, fileId]);
    }

    // Handle selected image index
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
  const updateImageCoordinates = (index: number, coordinates: Rectangle[]) => {
    const updatedCoordinates = [...imageCoordinates];

    // 'coordinates'는 Rectangle[]이므로, 이를 IOverlay[] 형식으로 변환하여 상태 업데이트
    updatedCoordinates[index] = coordinates.map(rectangle => ({
      ...rectangle,
      fileIndex: index, // fileIndex 추가
      alignment: 'center',
      type: 'image',
      fixedText: ''
    }));

    setImageCoordinates(updatedCoordinates); // IOverlay[][] 형식으로 상태 업데이트
    handleChange('overlays', updatedCoordinates); // 폼 데이터에 반영
  };

  const convertOverlayToRectangle = (overlay: IOverlay): Rectangle => {
    return {
      x: overlay.x,
      y: overlay.y,
      width: overlay.width,
      height: overlay.height
    };
  };
  return (
    <form onSubmit={handleSubmit}>
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
                  coordinates={
                    imageCoordinates[selectedImageIndex]?.map(
                      convertOverlayToRectangle
                    ) || []
                  }
                  setCoordinates={coordinates =>
                    updateImageCoordinates(selectedImageIndex, coordinates)
                  }
                  handleImageUpload={handleImageUpload}
                />
              ) : (
                <ImageEditor
                  image=""
                  coordinates={[]}
                  setCoordinates={() => {}}
                  handleImageUpload={handleImageUpload}
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
                              removeImage(index, selectedImageIndex!);
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
          <Button type="submit" disabled={isUploading}>
            {isUploading ? '업로드 중...' : '콘텐츠 저장'}
          </Button>
        </div>
      </div>
    </form>
  );
}
