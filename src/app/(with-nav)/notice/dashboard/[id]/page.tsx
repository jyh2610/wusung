'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAnnouncementDetail } from '@/shared/api/common';
import { IAnnouncementResponse } from '@/shared/api/common';
import { format, parseISO } from 'date-fns';
import { colors } from '@/design-tokens';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';

function Detail() {
  const params = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] =
    useState<IAnnouncementResponse | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await getAnnouncementDetail(Number(params.id));
        if (response.data) {
          setAnnouncement(response.data.data);
        }
      } catch (error) {
        console.error('공지사항을 불러오는데 실패했습니다:', error);
      }
    };

    fetchAnnouncement();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy.MM.dd');
    } catch (error) {
      console.error('날짜 형식 오류:', error);
      return '날짜 오류';
    }
  };

  if (!announcement) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-8" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        목록으로 돌아가기
      </Button>

      <div className="space-y-6">
        <div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: colors.gray_scale[900],
              marginBottom: '16px'
            }}
          >
            {announcement.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{announcement.views}</span>
            </div>
            <span>수정일: {formatDate(announcement.updatedAt)}</span>
          </div>
        </div>

        <div className="border-t border-b py-8">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default Detail;
