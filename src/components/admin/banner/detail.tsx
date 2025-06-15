'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBannerDetail } from './api';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import Image from 'next/image';

export const BannerDetail = () => {
  const params = useParams();
  const router = useRouter();
  const bannerId = params.id as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: bannerData } = useQuery({
    queryKey: ['bannerDetail', bannerId],
    queryFn: () => getBannerDetail(bannerId)
  });

  const banner = bannerData?.data;

  if (!banner) {
    return <div>로딩중...</div>;
  }

  const images =
    banner.type === 'slide_banner'
      ? banner.url.split(',').map(url => url.trim())
      : [banner.url];

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">배너 상세</h1>
        <div className="space-x-2">
          <Button
            onClick={() => router.back()}
            content="목록으로"
            type="default"
            btnSize="medium"
          />
          <Button
            onClick={() => {
              router.push(`/admin/banner/edit/${bannerId}`);
            }}
            content="수정"
            type="brand"
            btnSize="medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 이미지 영역 */}
          <div className="space-y-4">
            <div className="relative h-[400px] w-full">
              <Image
                src={images[currentImageIndex]}
                alt={`Banner ${banner.bannerId} - Image ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
              {banner.type === 'slide_banner' && images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    →
                  </button>
                </>
              )}
            </div>
            {banner.type === 'slide_banner' && images.length > 1 && (
              <div className="flex justify-center space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentImageIndex === index
                        ? 'bg-gray-800'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 정보 영역 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">배너 타입</h3>
              <p className="mt-1 text-lg">
                {banner.type === 'slide_banner'
                  ? '슬라이드 배너'
                  : '스토리 배너'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">표시 순서</h3>
              <p className="mt-1 text-lg">{banner.displayOrder}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">이미지 수</h3>
              <p className="mt-1 text-lg">{images.length}개</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">생성일</h3>
              <p className="mt-1 text-lg">
                {new Date(banner.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">수정일</h3>
              <p className="mt-1 text-lg">
                {new Date(banner.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
