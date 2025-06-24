'use client';

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { IRegPopup } from '@/components/admin/popup/tpye';
import {
  getPopup,
  updatePopup,
  regPopupFile,
  getPopupById
} from '@/components/admin/popup/api';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />
});

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [popup, setPopup] = useState<IRegPopup>({
    title: '',
    content: '',
    positionCode: 'L',
    isActive: true,
    priority: 1,
    startTime: '',
    endTime: ''
  });
  const [editorContent, setEditorContent] = useState('');
  const quillRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const popupData = await getPopupById(Number(params.id));
        if (popupData) {
          // 서버에서 받은 시간을 yyyy-MM-dd HH:mm 형식으로 변환
          const formatDateTimeForInput = (dateTimeString: string) => {
            const date = new Date(dateTimeString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
          };

          const startDateTime = formatDateTimeForInput(popupData.startTime);
          const endDateTime = formatDateTimeForInput(popupData.endTime);

          setPopup({
            title: popupData.title,
            content: popupData.content,
            positionCode: popupData.positionCode,
            isActive: popupData.isActive,
            priority: popupData.priority,
            startTime: startDateTime,
            endTime: endDateTime
          });
          setEditorContent(popupData.content);
        }
      } catch (error) {
        message.error('팝업 정보를 불러오는 중 오류가 발생했습니다.');
        router.push('/admin/popup');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopup();
  }, [params.id, router]);

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
      if (!popup.title.trim()) {
        message.error('제목을 입력해주세요.');
        return;
      }
      if (!editorContent.trim()) {
        message.error('내용을 입력해주세요.');
        return;
      }
      if (!popup.startTime) {
        message.error('시작일시를 입력해주세요.');
        return;
      }
      if (!popup.endTime) {
        message.error('종료일시를 입력해주세요.');
        return;
      }

      setIsUpdating(true);

      // datetime-local 값을 yyyy-MM-dd HH:mm 형식으로 변환
      const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:00`;
      };

      const formattedStartTime = formatDateTime(popup.startTime);
      const formattedEndTime = formatDateTime(popup.endTime);
      console.log(formattedStartTime, formattedEndTime);
      await updatePopup(Number(params.id), {
        ...popup,
        content: editorContent,
        startTime: formattedStartTime,
        endTime: formattedEndTime
      });

      message.success('팝업이 성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['popup'] });
      router.push('/admin/popup');
    } catch (error) {
      message.error('팝업 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
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

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={popup.title}
          onChange={e =>
            setPopup((prev: IRegPopup) => ({ ...prev, title: e.target.value }))
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
          <Label htmlFor="startDate">시작일시</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={popup.startTime}
            onChange={e =>
              setPopup((prev: IRegPopup) => ({
                ...prev,
                startTime: e.target.value
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">종료일시</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={popup.endTime}
            onChange={e =>
              setPopup((prev: IRegPopup) => ({
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
            value={popup.positionCode}
            onChange={e =>
              setPopup((prev: IRegPopup) => ({
                ...prev,
                positionCode: e.target.value
              }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="L">왼쪽</option>
            <option value="R">오른쪽</option>
            <option value="M">중앙</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">우선순위</Label>
          <Input
            id="priority"
            type="number"
            min="1"
            value={popup.priority}
            onChange={e =>
              setPopup((prev: IRegPopup) => ({
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
          checked={popup.isActive}
          onCheckedChange={checked =>
            setPopup((prev: IRegPopup) => ({ ...prev, isActive: checked }))
          }
          className="bg-gray-200 data-[state=checked]:bg-gray-200 [&>span]:bg-white data-[state=checked]:[&>span]:bg-blue-600"
        />
        <Label htmlFor="isActive">공개 여부</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.push('/admin/popup')}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={isUpdating}>
          {isUpdating ? '수정 중...' : '수정'}
        </Button>
      </div>
    </div>
  );
};

export default Page;
