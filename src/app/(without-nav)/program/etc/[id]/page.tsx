'use client';

import { useEffect, useState } from 'react';
import request from '@/shared/api/axiosInstance';
import { IRes } from '@/shared/type';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Calendar, Eye, FileText, GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';
import { printUserPrint } from '@/entities/program/api';

// Interface for EduContent

export interface EduContent {
  eduContentId: number;
  title: string;
  difficultyLevel: number;
  categoryId: number;
  year: number;
  month: number;
  viewCount: number;
  description: string;
  previewUrl: string;
}

export default function ContentPage() {
  const [content, setContent] = useState<EduContent | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await request<IRes<EduContent>>({
          method: 'GET',
          url: `/api/program/use/content/${id}/detail`,
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

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 3:
        return '초급';
      case 2:
        return '중급';
      case 1:
        return '고급';
      default:
        return '중급';
    }
  };

  const getCategoryName = (id: number) => {
    switch (id) {
      case 1:
        return '건강';
      case 2:
        return '교육';
      case 3:
        return '취미';
      default:
        return '기타';
    }
  };

  const difficultyLabel = getDifficultyLabel(content.difficultyLevel);
  const categoryName = getCategoryName(content.categoryId);

  const handlePrint = async () => {
    try {
      const pdfUrl = await printUserPrint([Number(id)]);
      toast.info(
        'PDF가 새 탭에서 열립니다. 해당 탭의 인쇄 기능을 이용해 주세요.'
      );
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      } else {
        toast.error('PDF 파일을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('프린트 에러:', error);
      toast.error('인쇄 실패되었습니다!');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              {categoryName}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
            >
              난이도: {difficultyLabel}
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold">{content.title}</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {content.year}년 {content.month}월
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>조회수 {content.viewCount}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={content.previewUrl}
              alt={content.previewUrl}
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">설명</h2>
            <p>{content.description || '설명이 없습니다.'}</p>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-6 flex justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              교육 콘텐츠 ID: {content.eduContentId}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              목록으로
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              인쇄하기
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
