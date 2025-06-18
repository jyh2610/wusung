'use client';

import { useEffect, useState } from 'react';
import request from '@/shared/api/axiosInstance';
import { EduContent, IRes } from '@/shared/type';
import { IContent } from '@/entities/program/type.dto';
import { useParams, useRouter } from 'next/navigation';
import { ContentUploadForm } from '@/components/admin/content-upload-form';
import { content } from '@/entities/mypage/index.css';
import { Card, CardHeader, CardContent } from '@mui/material';
import { CardFooter } from '@nextui-org/react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { formatDate } from 'date-fns';
import { Badge, Eye, Calendar, BarChart3, Clock } from 'lucide-react';
import Image from 'next/image';
import { deleteContent } from '@/entities/program/api';

export default function ContentPage() {
  const [content, setContent] = useState<EduContent | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchContent = async () => {
      const userInfo = localStorage.getItem('userInfo');
      const token = userInfo ? JSON.parse(userInfo).token : null;
      try {
        const res = await request<IRes<EduContent>>({
          method: 'GET',
          url: `/api/admin/edu-content/${id}`,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setContent(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContent();
  }, [id]);

  if (!content) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">콘텐츠 업로드</h1>
      </div>
      <ContentView content={content} />
    </div>
  );
}
interface ContentViewProps {
  content: EduContent;
}

function ContentView({ content }: ContentViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // Get difficulty label
  const getDifficultyLabel = (level: number) => {
    const labels = ['상', '중', '하'];
    return labels[level - 1] || 'Unknown';
  };
  const router = useRouter();

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>ID: {content.eduContentId}</span>
          <span>•</span>
          <span className="px-2 py-0.5 text-xs rounded-full border border-gray-300">
            {content.categoryId}
          </span>
          <span>•</span>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {content.viewCount}
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {content.title}
        </h1>
      </div>

      <div className="mb-8 border rounded-lg overflow-hidden shadow-sm">
        <div className="mb-8 border rounded-lg overflow-hidden shadow-sm">
          {content.files && content.files.length > 0 && (
            <div>
              {/* 대표 이미지 */}
              <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
                <Image
                  src={content.files[selectedImageIndex].fileUrl}
                  alt={content.files[selectedImageIndex].fileName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* 썸네일 리스트 */}
              <div className="flex gap-2 overflow-x-auto p-4 bg-gray-50">
                {content.files.map((file, index) => (
                  <div
                    key={file.fileId}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded overflow-hidden cursor-pointer border ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'}`}
                  >
                    <Image
                      src={file.fileUrl}
                      alt={file.fileName}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {content.year}년 {content.month}월
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">
                  난이도: {getDifficultyLabel(content.difficultyLevel)}
                </span>
              </div>

              <span
                className={`px-2 py-1 text-xs rounded-full ${content.isUsed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {content.isUsed ? '사용중' : '미사용'}
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200 my-4"></div>

          <div className="py-4">
            <div className="prose max-w-none">
              {content.description || '설명이 없습니다.'}
            </div>
          </div>

          <div className="h-px w-full bg-gray-200 my-4"></div>

          <div className="flex justify-between pt-2">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>등록일: {content.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => router.push('/admin/content')}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
        >
          목록으로
        </button>
        <button
          onClick={() =>
            router.push(`/admin/content/upload?id=${content.eduContentId}`)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
