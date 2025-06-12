'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  getDashboardDetail,
  updateDashboard
} from '@/components/admin/dashboard/api';
import type { DashboardDetail } from '@/components/admin/dashboard/type';
import { message } from 'antd';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />
});

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [detail, setDetail] = useState<DashboardDetail | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getDashboardDetail(Number(params.id));
        if (data) {
          setDetail(data);
          setEditedContent(data.content);
        }
      } catch (error) {
        message.error('공지사항을 불러오는데 실패했습니다.');
      }
    };

    fetchDetail();
  }, [params.id]);

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!detail) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{detail.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            onClick={() =>
              router.push(`/admin/dashboard/edit/${detail.announcementId}`)
            }
          >
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() =>
              router.push(`/admin/dashboard/edit/${detail.announcementId}`)
            }
          >
            삭제
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span>조회수: {detail.views}</span>
        <span>작성일: {new Date(detail.createdAt).toLocaleString()}</span>
        <span>수정일: {new Date(detail.updatedAt).toLocaleString()}</span>
        <span
          className={`px-2 py-1 rounded ${detail.isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {detail.isVisible ? '공개' : '비공개'}
        </span>
        {detail.topExposure && (
          <span className="flex items-center space-x-2">
            {'노출 :' + ' '}
            <div className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
              {detail.topExposureTag}
            </div>
          </span>
        )}
      </div>

      <div className="border-t pt-4">
        {isEditing ? (
          <ReactQuill
            theme="snow"
            value={editedContent}
            onChange={setEditedContent}
            className="h-[400px]"
          />
        ) : (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: detail.content }}
          />
        )}
      </div>

      {detail.files && detail.files.length > 0 && (
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">첨부파일</h2>
          <div className="space-y-2">
            {detail.files.map(file => (
              <div
                key={file.fileId}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm">{file.fileName}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(file.fileUrl, file.fileName)}
                >
                  다운로드
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
