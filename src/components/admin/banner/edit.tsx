'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBannerDetail, updateBanner } from './api';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import { toast } from 'react-toastify';
import type { IBannerRegisterDTO, BannerCategory } from './type';

export const BannerEdit = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bannerId = params.id as string;

  const { data: bannerData } = useQuery({
    queryKey: ['bannerDetail', bannerId],
    queryFn: () => getBannerDetail(bannerId)
  });

  const [bannerForm, setBannerForm] = useState<IBannerRegisterDTO>({
    type: 'slide_banner',
    displayOrder: 1
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // 기존 배너 데이터가 로드되면 폼 초기화
  React.useEffect(() => {
    if (bannerData?.data) {
      setBannerForm({
        type: bannerData.data.type,
        displayOrder: bannerData.data.displayOrder
      });
      setPreviewUrls(bannerData.data.url.split(',').map(url => url.trim()));
    }
  }, [bannerData]);

  const updateBannerMutation = useMutation({
    mutationFn: (data: {
      bannerId: string;
      bannerData: IBannerRegisterDTO;
      images: File[];
    }) => updateBanner(data.bannerId, data.bannerData, data.images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannerList'] });
      queryClient.invalidateQueries({ queryKey: ['bannerDetail', bannerId] });
      toast.success('배너가 수정되었습니다.');
      router.push(`/admin/banner/${bannerId}`);
    },
    onError: () => {
      toast.error('배너 수정에 실패했습니다.');
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // 미리보기 URL 생성
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBannerMutation.mutate({
      bannerId,
      bannerData: bannerForm,
      images
    });
  };

  if (!bannerData?.data) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">배너 수정</h1>
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
              value={bannerForm.type}
              onChange={e =>
                setBannerForm(prev => ({
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
              value={bannerForm.displayOrder}
              onChange={e =>
                setBannerForm(prev => ({
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
              {bannerForm.type === 'slide_banner' && ' (여러 개 선택 가능)'}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple={bannerForm.type === 'slide_banner'}
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {/* 이미지 미리보기 */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-video">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
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
                content="수정"
                btnSize="medium"
                type="brand"
                disabled={updateBannerMutation.isPending}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
