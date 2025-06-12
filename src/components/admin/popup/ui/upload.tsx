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
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { IPopup, IRegPopup } from '../tpye';
import { regPopup, regPopupFile } from '../api';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />
});

interface UploadProps {
  onCancel: () => void;
}

export const Upload = ({ onCancel }: UploadProps) => {
  const [newPopup, setNewPopup] = useState<IRegPopup>({
    title: '',
    content: '',
    positionCode: 'L',
    isActive: true,
    priority: 1,
    startTime: '',
    endTime: ''
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
      const response = await regPopupFile(file);
      if (response && response.popup) {
        return response.popup;
      }
      return '';
    } catch (error) {
      message.error('이미지 업로드 중 오류가 발생했습니다.');
      return '';
    }
  };

  const handleSubmit = async () => {
    try {
      if (!newPopup.title.trim()) {
        message.error('제목을 입력해주세요.');
        return;
      }
      if (!editorContent.trim()) {
        message.error('내용을 입력해주세요.');
        return;
      }
      if (!newPopup.startTime) {
        message.error('시작일을 입력해주세요.');
        return;
      }
      if (!newPopup.endTime) {
        message.error('종료일을 입력해주세요.');
        return;
      }

      setIsUploading(true);

      await regPopup({
        ...newPopup,
        content: editorContent
      });

      message.success('팝업이 성공적으로 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['popup'] });
      onCancel();
    } catch (error) {
      message.error('팝업 등록 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
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
          value={newPopup.title}
          onChange={e =>
            setNewPopup((prev: IRegPopup) => ({
              ...prev,
              title: e.target.value
            }))
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
            value={editorContent}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            className="h-[350px]"
            preserveWhitespace
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">시작일</Label>
          <Input
            id="startDate"
            type="date"
            value={newPopup.startTime}
            onChange={e =>
              setNewPopup((prev: IRegPopup) => ({
                ...prev,
                startTime: e.target.value
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">종료일</Label>
          <Input
            id="endDate"
            type="date"
            value={newPopup.endTime}
            onChange={e =>
              setNewPopup((prev: IRegPopup) => ({
                ...prev,
                endTime: e.target.value
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="positionCode">위치</Label>
          <select
            id="positionCode"
            value={newPopup.positionCode}
            onChange={e =>
              setNewPopup((prev: IRegPopup) => ({
                ...prev,
                positionCode: e.target.value
              }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="L">왼쪽</option>
            <option value="R">오른쪽</option>
            <option value="C">중앙</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">우선순위</Label>
          <Input
            id="priority"
            type="number"
            min="1"
            value={newPopup.priority}
            onChange={e =>
              setNewPopup((prev: IRegPopup) => ({
                ...prev,
                priority: parseInt(e.target.value)
              }))
            }
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={newPopup.isActive}
          onCheckedChange={checked =>
            setNewPopup((prev: IRegPopup) => ({ ...prev, isActive: checked }))
          }
          className="bg-gray-200 data-[state=checked]:bg-gray-200 [&>span]:bg-white data-[state=checked]:[&>span]:bg-blue-600"
        />
        <Label htmlFor="isActive">공개 여부</Label>
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
