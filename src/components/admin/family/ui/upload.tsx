'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { IFamily } from '../type';
import { registerFamily } from '../api';

interface UploadProps {
  onCancel: () => void;
}

export const Upload = ({ onCancel }: UploadProps) => {
  const [newFamily, setNewFamily] = useState<IFamily>({
    partnerId: 0,
    name: '',
    description: '',
    link: '',
    isVisible: true
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      if (!newFamily.name.trim()) {
        message.error('이름을 입력해주세요.');
        return;
      }
      if (!newFamily.description.trim()) {
        message.error('설명을 입력해주세요.');
        return;
      }
      if (!newFamily.link.trim()) {
        message.error('링크를 입력해주세요.');
        return;
      }
      if (!file) {
        message.error('이미지를 선택해주세요.');
        return;
      }

      setIsUploading(true);

      await registerFamily(newFamily, file);

      message.success('패밀리 사이트가 성공적으로 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['family'] });
      queryClient.refetchQueries({ queryKey: ['family'] });
      onCancel();
    } catch (error) {
      message.error('패밀리 사이트 등록 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          value={newFamily.name}
          onChange={e =>
            setNewFamily(prev => ({ ...prev, name: e.target.value }))
          }
          placeholder="이름을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Input
          id="description"
          value={newFamily.description}
          onChange={e =>
            setNewFamily(prev => ({ ...prev, description: e.target.value }))
          }
          placeholder="설명을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">링크</Label>
        <Input
          id="link"
          value={newFamily.link}
          onChange={e =>
            setNewFamily(prev => ({ ...prev, link: e.target.value }))
          }
          placeholder="링크를 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">이미지</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isVisible"
          checked={newFamily.isVisible}
          onCheckedChange={checked =>
            setNewFamily(prev => ({ ...prev, isVisible: checked }))
          }
        />
        <Label htmlFor="isVisible">활성화</Label>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={isUploading}>
          등록
        </Button>
      </div>
    </div>
  );
};
