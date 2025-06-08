'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { IFamily } from '../type';
import { updateFamily } from '../api';

interface EditProps {
  family: IFamily;
  onCancel: () => void;
}

export const Edit = ({ family, onCancel }: EditProps) => {
  const [editedFamily, setEditedFamily] = useState<IFamily>(family);
  const [file, setFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      if (!editedFamily.name.trim()) {
        message.error('이름을 입력해주세요.');
        return;
      }
      if (!editedFamily.description.trim()) {
        message.error('설명을 입력해주세요.');
        return;
      }
      if (!editedFamily.link.trim()) {
        message.error('링크를 입력해주세요.');
        return;
      }

      setIsUpdating(true);

      await updateFamily(
        family.partnerId,
        editedFamily,
        file || new File([], '')
      );

      message.success('패밀리 사이트가 성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['family'] });
      queryClient.refetchQueries({ queryKey: ['family'] });
      onCancel();
    } catch (error) {
      message.error('패밀리 사이트 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
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
          value={editedFamily.name}
          onChange={e =>
            setEditedFamily(prev => ({ ...prev, name: e.target.value }))
          }
          placeholder="이름을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Input
          id="description"
          value={editedFamily.description}
          onChange={e =>
            setEditedFamily(prev => ({ ...prev, description: e.target.value }))
          }
          placeholder="설명을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">링크</Label>
        <Input
          id="link"
          value={editedFamily.link}
          onChange={e =>
            setEditedFamily(prev => ({ ...prev, link: e.target.value }))
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
        {family.imageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">현재 이미지:</p>
            <img
              src={family.imageUrl}
              alt={family.name}
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isVisible"
          checked={editedFamily.isVisible}
          onCheckedChange={checked =>
            setEditedFamily(prev => ({ ...prev, isVisible: checked }))
          }
          className="bg-gray-200 data-[state=checked]:bg-blue-600"
        />
        <Label htmlFor="isVisible">활성화</Label>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={isUpdating}>
          수정
        </Button>
      </div>
    </div>
  );
};
