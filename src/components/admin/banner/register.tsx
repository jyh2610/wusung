'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBanner } from './api';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import { toast } from 'react-toastify';
import type { IBannerRegisterDTO, BannerCategory } from './type';

export const BannerRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [bannerData, setBannerData] = useState<IBannerRegisterDTO>({
    type: 'slide_banner',
    displayOrder: 1
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const createBannerMutation = useMutation({
    mutationFn: (data: {
      bannerData: IBannerRegisterDTO;
      image: File | null;
    }) => createBanner(data.bannerData, data.image ? [data.image] : []),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannerList'] });
      router.push('/admin/banner');
    },
    onError: () => {
      toast.error('배너 등록에 실패했습니다.');
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImage(files[0]);

    // 미리보기 URL 생성
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrl(urls[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBannerMutation.mutate({ bannerData, image });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">배너 등록</h1>
        <div style={{ width: '100px', height: '56px' }}>
          <Button
            onClick={() => router.back()}
            content="목록으로"
            type="default"
            btnSize="medium"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* 배너 타입 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배너 타입
            </label>
            <select
              value={bannerData.type}
              onChange={e =>
                setBannerData(prev => ({
                  ...prev,
                  type: e.target.value as BannerCategory
                }))
              }
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="slide_banner">슬라이드 배너</option>
              <option value="story_banner">스토리 배너</option>
            </select>
          </div>

          {/* 표시 순서 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              표시 순서
            </label>
            <input
              type="number"
              value={bannerData.displayOrder}
              onChange={e =>
                setBannerData(prev => ({
                  ...prev,
                  displayOrder: parseInt(e.target.value)
                }))
              }
              min="1"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지
            </label>
            <input
              type="file"
              accept="image/*"
              multiple={false}
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {/* 이미지 미리보기 */}
          {previewUrl && (
            <div className="relative aspect-video">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-2">
            <div style={{ width: '100px', height: '56px' }}>
              <Button
                onClick={() => router.back()}
                content="취소"
                btnSize="medium"
                type="default"
              />
            </div>
            <div style={{ width: '100px', height: '56px' }}>
              <Button
                btnType="submit"
                content="등록"
                btnSize="medium"
                type="brand"
                disabled={createBannerMutation.isPending}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
