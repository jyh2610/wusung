'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import {
  getDashboardDetail,
  updateDashboard,
  uploaContent
} from '@/components/admin/dashboard/api';
import type {
  DashboardDetail,
  RegDashboard,
  ResponseFile,
  UploadedFile
} from '@/components/admin/dashboard/type';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />
});

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [detail, setDetail] = useState<DashboardDetail | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletedFilesIdList, setDeletedFilesIdList] = useState<number[]>([]);
  const quillRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (editorContainerRef.current) {
      const editor = editorContainerRef.current.querySelector('.ql-editor');
      if (editor) {
        editor.addEventListener('drop', handleDrop as unknown as EventListener);
        editor.addEventListener(
          'dragover',
          handleDragOver as unknown as EventListener
        );
      }
    }
  }, []);

  const handleImageUpload = async (file: File) => {
    try {
      const response = await uploaContent([file]);
      if (response && response.announcement) {
        return response.announcement;
      }
      return '';
    } catch (error) {
      message.error('이미지 업로드 중 오류가 발생했습니다.');
      return '';
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      message.warning('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true) || { index: quill.getLength() };

    for (const file of imageFiles) {
      const url = await handleImageUpload(file);
      if (url) {
        quill.insertEmbed(
          range.index,
          'image',
          url,
          'photo-in-text-cloudfront-src'
        );
        range.index += 1;
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleSubmit = async () => {
    if (!detail) return;

    try {
      if (!detail.title.trim()) {
        message.error('제목을 입력해주세요.');
        return;
      }
      if (!editedContent.trim()) {
        message.error('내용을 입력해주세요.');
        return;
      }

      setIsUploading(true);

      const formData = new FormData();
      const announcementEditDTO = {
        announcementRegisterDTO: {
          title: detail.title,
          content: editedContent,
          topExposure: detail.topExposure,
          topExposureTag: detail.topExposureTag,
          isVisible: detail.isVisible
        },
        deletedFilesIdList: deletedFilesIdList
      };
      formData.append(
        'announcementEditDTO',
        JSON.stringify(announcementEditDTO)
      );

      if (newFiles.length > 0) {
        newFiles.forEach(file => {
          formData.append('files', file);
        });
      }

      await updateDashboard(detail.announcementId, formData);

      message.success('공지사항이 성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      router.push(`/admin/dashboard/${detail.announcementId}`);
    } catch (error) {
      message.error('공지사항 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (fileId: number) => {
    if (!detail) return;
    setDetail(prev => {
      if (!prev) return prev;
      const updatedFiles = prev.files.filter(file => file.fileId !== fileId);
      return {
        ...prev,
        files: updatedFiles
      };
    });
    setDeletedFilesIdList(prev => [...prev, fileId]);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: function () {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (file) {
                const url = await handleImageUpload(file);
                if (url) {
                  const quill = (this as any).quill;
                  const range = quill.getSelection(true);
                  quill.insertEmbed(
                    range.index,
                    'image',
                    url,
                    'photo-in-text-cloudfront-src'
                  );
                }
              }
            };
          }
        }
      },
      clipboard: {
        matchVisual: false
      }
    }),
    []
  );

  const formats = useMemo(
    () => [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'list',
      'bullet',
      'align',
      'link',
      'image'
    ],
    []
  );

  if (!detail) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={detail.title}
          onChange={e =>
            setDetail(prev =>
              prev ? { ...prev, title: e.target.value } : prev
            )
          }
          placeholder="제목을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label>내용</Label>
        <div
          className="h-[400px]"
          ref={editorContainerRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ReactQuill
            theme="snow"
            value={editedContent}
            onChange={setEditedContent}
            modules={modules}
            formats={formats}
            className="h-[350px]"
            preserveWhitespace
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>첨부파일</Label>
        <div className="space-y-4">
          {detail.files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">기존 파일</h3>
              {detail.files.map(file => (
                <div
                  key={file.fileId}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{file.fileName}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFile(file.fileId)}
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">새 파일 추가</h3>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {newFiles.length > 0 && (
              <div className="text-sm text-gray-500">
                {newFiles.length}개의 파일이 선택되었습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="topExposure"
            checked={detail.topExposure}
            onCheckedChange={checked =>
              setDetail(prev =>
                prev ? { ...prev, topExposure: checked } : prev
              )
            }
            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 border border-gray-300"
          />
          <Label htmlFor="topExposure">최상단 노출</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isVisible"
            checked={detail.isVisible}
            onCheckedChange={checked =>
              setDetail(prev => (prev ? { ...prev, isVisible: checked } : prev))
            }
            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 border border-gray-300"
          />
          <Label htmlFor="isVisible">공개 여부</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/admin/dashboard/${detail.announcementId}`)
          }
        >
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={isUploading}>
          {isUploading ? '수정 중...' : '수정'}
        </Button>
      </div>
    </div>
  );
};

export default Page;
