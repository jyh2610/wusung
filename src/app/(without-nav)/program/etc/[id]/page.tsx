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
      const token = sessionStorage.getItem('token');
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
      // 이 함수는 selectedActivities 대신 단일 id를 사용하는 버전입니다.
      const pdfUrl = await printUserPrint([Number(id)]);

      if (pdfUrl) {
        // PDF가 준비되면 인쇄 대화 상자를 띄울 것임을 사용자에게 알림
        toast.info('PDF가 로딩되면 인쇄 대화 상자가 나타납니다.');

        // 👉 사용자에게 보이지 않는 iframe을 생성해서 자동 프린트
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed'; // 화면에 고정
        iframe.style.right = '0'; // 화면 오른쪽 바깥
        iframe.style.bottom = '0'; // 화면 아래쪽 바깥
        iframe.style.width = '0'; // 너비 0
        iframe.style.height = '0'; // 높이 0
        iframe.style.border = 'none'; // 테두리 없음
        iframe.style.visibility = 'hidden'; // 숨김 처리
        iframe.style.pointerEvents = 'none'; // 마우스 이벤트 무시

        iframe.src = pdfUrl; // 아이프레임 소스를 PDF URL로 설정

        // 아이프레임 로딩 완료 시 인쇄 실행
        iframe.onload = () => {
          // 인쇄 대화 상자가 뜨는 데 약간의 지연이 필요할 수 있습니다.
          setTimeout(() => {
            // iframe의 contentWindow가 존재하는지 확인 후 focus와 print 호출
            if (iframe.contentWindow) {
              try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                console.log('Print dialog initiated.');
                // 아이프레임은 사용자가 인쇄 대화 상자를 닫으면 연결이 해제되므로
                // 여기서 별도로 제거하는 코드는 추가하지 않습니다.
              } catch (printError) {
                console.error('Error initiating print on iframe:', printError);
                toast.error('인쇄 대화 상자를 열 수 없습니다.');
                // 오류 발생 시 아이프레임 제거
                if (iframe.parentElement) {
                  iframe.parentElement.removeChild(iframe);
                }
              }
            } else {
              console.error(
                'iframe contentWindow is not available after load.'
              );
              toast.error('인쇄 창을 열 수 없습니다.');
              // 오류 발생 시 아이프레임 제거
              if (iframe.parentElement) {
                iframe.parentElement.removeChild(iframe);
              }
            }
          }, 500); // 500ms 지연 (조정 가능)
        };

        // 아이프레임 로딩 오류 처리
        iframe.onerror = e => {
          console.error('Error loading PDF in iframe:', e);
          toast.error('PDF 로딩 중 오류가 발생했습니다.');
          // 오류 발생 시 아이프레임 제거
          if (iframe.parentElement) {
            iframe.parentElement.removeChild(iframe);
          }
        };

        // 생성한 아이프레임을 문서 본문에 추가
        document.body.appendChild(iframe);

        // 아이프레임을 특정 시간 후에 제거하는 코드는 삭제했습니다.
        // 사용자가 인쇄 대화 상자를 직접 닫을 때까지 아이프레임이 유지됩니다.
      } else {
        toast.error('PDF 파일을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('프린트 에러:', error);
      toast.error('인쇄 실패되었습니다!'); // 일반적인 오류 메시지
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
