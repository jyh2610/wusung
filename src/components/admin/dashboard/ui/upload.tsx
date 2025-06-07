'use client';

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect
} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { regDashboard, uploaContent } from '../api';
import type { RegDashboard, ResponseFile } from '../type';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />
});

interface UploadProps {
  onCancel: () => void;
}

export const Upload = ({ onCancel }: UploadProps) => {
  const [newDashboard, setNewDashboard] = useState<RegDashboard>({
    title: '',
    content: '',
    topExposure: false,
    topExposureTag: '',
    isVisible: true,
    files: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const quillRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

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

  const handleSubmit = async () => {
    try {
      if (!newDashboard.title.trim()) {
        message.error('제목을 입력해주세요.');
        return;
      }
      if (!editorContent.trim()) {
        message.error('내용을 입력해주세요.');
        return;
      }

      setIsUploading(true);

      // 공지사항 등록
      await regDashboard({
        ...newDashboard,
        content: editorContent
      });

      message.success('공지사항이 성공적으로 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onCancel();
    } catch (error) {
      message.error('공지사항 등록 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewDashboard(prev => ({
        ...prev,
        files: Array.from(e.target.files || [])
      }));
    }
  };

  const handleEditorChange = useCallback((content: string) => {
    setEditorContent(content);
  }, []);

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

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={newDashboard.title}
          onChange={e =>
            setNewDashboard(prev => ({ ...prev, title: e.target.value }))
          }
          placeholder="제목을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label>내용</Label>
        <div
          className="h-[400px]"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            className="h-[350px]"
            preserveWhitespace
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>파일 첨부</Label>
        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        {newDashboard.files.length > 0 && (
          <div className="text-sm text-gray-500">
            {newDashboard.files.length}개의 파일이 선택되었습니다.
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="topExposure"
            checked={newDashboard.topExposure}
            onCheckedChange={checked =>
              setNewDashboard(prev => ({ ...prev, topExposure: checked }))
            }
            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 border border-gray-300"
          />
          <Label htmlFor="topExposure">최상단 노출</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isVisible"
            checked={newDashboard.isVisible}
            onCheckedChange={checked =>
              setNewDashboard(prev => ({ ...prev, isVisible: checked }))
            }
            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 border border-gray-300"
          />
          <Label htmlFor="isVisible">공개 여부</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={isUploading}>
          {isUploading ? '업로드 중...' : '등록'}
        </Button>
      </div>
    </div>
  );
};
