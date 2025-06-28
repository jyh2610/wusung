'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAnnouncementDetail } from '@/shared/api/common';
import { IAnnouncementResponse } from '@/shared/api/common';
import { format, parseISO } from 'date-fns';
import { colors } from '@/design-tokens';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Download } from 'lucide-react';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { toast } from 'react-toastify';

function Detail() {
  const params = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] =
    useState<IAnnouncementResponse | null>(null);
  const username = useAuthStore(state => state.username);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!username || username === 'null') {
      setShowModal(true);
    }
  }, [username]);

  const handleModalConfirm = () => {
    setShowModal(false);
    router.push('/signin');
  };

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await getAnnouncementDetail(Number(params.id));
        if (response.data) {
          setAnnouncement(response.data.data);
        }
      } catch (error) {
        toast.error('로그인이 필요합니다.');
        router.push('/signin');
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

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        {announcement.files && announcement.files.length > 0 && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">첨부파일</h3>
            <div className="space-y-2">
              {announcement.files.map(file => (
                <div
                  key={file.fileId}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <span className="text-sm truncate">{file.fileName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(file.fileUrl, file.fileName)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    다운로드
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-b py-8">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>
      </div>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
              textAlign: 'center'
            }}
          >
            <h3 style={{ marginBottom: '20px' }}>로그인이 필요합니다</h3>
            <p style={{ marginBottom: '20px' }}>
              해당 기능을 이용하기 위해서는 로그인이 필요합니다.
            </p>
            <button
              onClick={handleModalConfirm}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
