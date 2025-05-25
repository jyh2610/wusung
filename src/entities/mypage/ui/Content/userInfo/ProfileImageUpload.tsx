import React, { useRef, useState } from 'react';
import { colors } from '@/design-tokens';
import Image from 'next/image';

interface ProfileImageUploadProps {
  value?: string | null;
  onChange?: (file: File | null) => void;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  value,
  onChange
}) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange?.(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: colors.gray_scale[100],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="프로필 미리보기"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Image
            src={'/images/profileDefault.png'}
            alt="프로필 미리보기"
            width={50}
            height={50}
          />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          type="button"
          onClick={handleButtonClick}
          style={{
            border: `2px solid ${colors.brand[500]}`,
            color: colors.brand[500],
            background: 'white',
            borderRadius: 12,
            padding: '12px 32px',
            fontSize: 18,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          프로필 사진 업로드
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <span style={{ color: colors.gray_scale[500], fontSize: 15 }}>
          • 10mb 이내의 이미지 파일을 업로드해주세요
        </span>
      </div>
    </div>
  );
};
