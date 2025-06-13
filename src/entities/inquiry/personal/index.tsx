'use client';

import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { colors } from '@/design-tokens';
import { IForm } from '../type';
import {
  mainContent,
  inquiryForm,
  formRow,
  formLabel,
  required,
  formField,
  formInput,
  formTextarea,
  charCount,
  fileUploadArea,
  fileUploadBox,
  fileGuidelines,
  fileGuidelinesItem,
  formSubmit,
  submitBtn,
  previewImages, // 미리보기 이미지 스타일 추가
  previewImageBox, // 개별 이미지 스타일 추가
  previewImage
} from './index.css';
import { regInquiry } from '../api';
import { toast } from 'react-toastify';

const MAX_LENGTH = 5000;
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
const MAX_FILES = 6;

export function Personal() {
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState } = useForm<IForm>(
    {
      mode: 'onChange',
      defaultValues: {
        type: '',
        title: '',
        content: '',
        files: []
      }
    }
  );

  const [filePreviews, setFilePreviews] = useState<string[]>([]); // 미리보기 이미지 상태 관리
  const fileInputRef = useRef<HTMLInputElement | null>(null); // 파일 입력을 위한 ref 생성

  // ✅ react-hook-form으로 select 값 관리
  const selectedType = watch('type'); // 현재 선택된 값 추적

  const handleSelectChange = (event: any) => {
    setValue('type', event.target.value, { shouldValidate: true });
  };

  const content = watch('content', '');

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setValue('content', value, { shouldValidate: true });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file =>
        file.type.startsWith('image/')
      );

      // Validate the number of files
      if (validFiles.length > MAX_FILES) {
        alert('최대 6장의 이미지만 업로드할 수 있습니다.');
        return;
      }

      // Validate total size
      const totalSize = validFiles.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > MAX_FILE_SIZE) {
        alert('총 파일 크기가 30MB를 초과할 수 없습니다.');
        return;
      }

      // 파일 미리보기 설정
      const previews = validFiles.map(file => URL.createObjectURL(file));
      setFilePreviews(prev => [...prev, ...previews]);

      // React Hook Form 상태 업데이트
      setValue('files', validFiles, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: IForm) => {
    try {
      const res = await regInquiry(data);
      toast.success('문의가 등록되었습니다!');
      router.push('/mypage?tab=문의내역');
      } catch (error) {
        console.log(error);
        toast.error('문의 등록에 실패했습니다. 다시 시도해주세요.');
      } 
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className={mainContent}>
      <form className={inquiryForm} onSubmit={handleSubmit(onSubmit)}>
        {/* ✅ MUI Select + react-hook-form */}
        <div className={formRow}>
          <label className={formLabel}>
            유형<span className={required}>*</span>
          </label>
          <div className={formField}>
            <FormControl fullWidth style={{ width: '200px' }}>
              <Select
                labelId="select-label"
                id="type-select"
                value={selectedType}
                onChange={handleSelectChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                renderValue={selectedType => {
                  if (selectedType.length === 0) {
                    return (
                      <span style={{ color: colors.gray_scale['700'] }}>
                        선택
                      </span>
                    );
                  }

                  return selectedType;
                }}
              >
                <MenuItem value="문의">문의</MenuItem>
                <MenuItem value="불만">불만</MenuItem>
              </Select>
            </FormControl>
            {formState.errors.type && (
              <span className={required}>유형을 선택해주세요</span>
            )}
          </div>
        </div>

        {/* 제목 입력 */}
        <div className={formRow}>
          <label className={formLabel}>
            제목<span className={required}>*</span>
          </label>
          <div className={formField}>
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              className={formInput}
              {...register('title', { required: true })}
            />
            {formState.errors.title && (
              <span className={required}>제목을 입력해주세요</span>
            )}
          </div>
        </div>

        {/* 내용 입력 */}
        <div className={formRow}>
          <label className={formLabel}>
            내용<span className={required}>*</span>
          </label>
          <div className={formField}>
            <textarea
              placeholder="1:1 문의 작성 전 확인해주세요!"
              className={formTextarea}
              {...register('content', { required: true })}
              onChange={handleContentChange}
            />
            <div className={charCount}>
              {content.length} / {MAX_LENGTH}자
            </div>
            {formState.errors.content && (
              <span className={required}>내용을 입력해주세요</span>
            )}
          </div>
        </div>

        {/* 파일 업로드 */}
        <div className={formRow}>
          <label className={formLabel}>첨부파일</label>
          <div className={formField}>
            <div className={fileUploadArea}>
              <div className={fileUploadBox} onClick={handleCameraClick}>
                <Camera size={24} />
              </div>
              <input
                ref={fileInputRef} // 파일 입력을 위한 ref 연결
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }} // 파일 입력 필드를 숨깁니다
              />
              {filePreviews.length > 0 && (
                <div className={previewImages}>
                  {filePreviews.map((preview, index) => (
                    <div key={index} className={previewImageBox}>
                      <Image
                        fill
                        className={previewImage}
                        src={preview}
                        alt={`Preview ${index}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ul className={fileGuidelines}>
              <li className={fileGuidelinesItem}>
                • 30MB 이하의 이미지만 업로드 가능합니다.
              </li>
              <li className={fileGuidelinesItem}>• 최대 6장까지 업로드 가능</li>
            </ul>
          </div>
        </div>

        {/* 등록 버튼 */}
        <div className={formSubmit}>
          <button
            type="submit"
            className={submitBtn}
            disabled={!formState.isValid}
          >
            등록
          </button>
        </div>
      </form>
    </main>
  );
}
