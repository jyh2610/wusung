'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBannerList, getBannerCategory, deleteBanner } from './api';
import { Button } from '@/shared/ui';
import Image from 'next/image';
import { toast } from 'react-toastify';
import type { IBannerResponse, BannerCategory } from './type';
import { useRouter } from 'next/navigation';

const Banner = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<
    BannerCategory | 'all'
  >('all');

  const { data: bannerList } = useQuery({
    queryKey: ['bannerList'],
    queryFn: getBannerList
  });

  const { data: categories } = useQuery({
    queryKey: ['bannerCategories'],
    queryFn: getBannerCategory
  });

  const deleteBannerMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannerList'] });
      toast.success('배너가 삭제되었습니다.');
    }
  });

  const filteredBanners = bannerList?.data?.content.filter(
    banner => selectedCategory === 'all' || banner.type === selectedCategory
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">배너 관리</h1>
        <div style={{ width: '100px', height: '56px' }}>
          <Button
            onClick={() => {
              router.push('/admin/banner/upload');
            }}
            content="배너 추가"
            type="default"
            btnSize="medium"
          />
        </div>
      </div>

      {/* 필터 */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={e =>
            setSelectedCategory(e.target.value as BannerCategory | 'all')
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">전체</option>
          {categories?.data?.map(category => (
            <option key={category} value={category}>
              {category === 'slide_banner' ? '슬라이드 배너' : '스토리 배너'}
            </option>
          ))}
        </select>
      </div>

      {/* 배너 리스트 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이미지
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                타입
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                순서
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                생성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBanners?.map((banner: IBannerResponse) => (
              <tr
                key={banner.bannerId}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/admin/banner/${banner.bannerId}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-32 h-20">
                    <Image
                      src={banner.url}
                      alt={`Banner ${banner.bannerId}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {banner.type === 'slide_banner'
                      ? '슬라이드 배너'
                      : '스토리 배너'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {banner.displayOrder}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {new Date(banner.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="flex space-x-2"
                    onClick={e => e.stopPropagation()}
                  >
                    <Button
                      onClick={() =>
                        router.push(`/admin/banner/${banner.bannerId}`)
                      }
                      content="상세"
                      type="borderBrand"
                      btnSize="small"
                    />
                    <Button
                      onClick={() => {
                        if (window.confirm('정말 삭제하시겠습니까?')) {
                          deleteBannerMutation.mutate(
                            banner.bannerId.toString()
                          );
                        }
                      }}
                      content="삭제"
                      type="default"
                      btnSize="small"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banner;
