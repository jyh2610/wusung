'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { IRegProduct } from '../type';
import { regProduct } from '../api';

interface UploadProps {
  onCancel: () => void;
}

export const Upload = ({ onCancel }: UploadProps) => {
  const [newProduct, setNewProduct] = useState<IRegProduct>({
    name: '',
    periodMonths: 0,
    price: 0,
    description: '',
    discountRate: 0,
    active: true
  });
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      if (!newProduct.name.trim()) {
        message.error('상품명을 입력해주세요.');
        return;
      }
      if (!newProduct.description.trim()) {
        message.error('상품 설명을 입력해주세요.');
        return;
      }
      if (newProduct.periodMonths <= 0) {
        message.error('기간을 입력해주세요.');
        return;
      }
      if (newProduct.price <= 0) {
        message.error('가격을 입력해주세요.');
        return;
      }
      if (newProduct.discountRate < 0 || newProduct.discountRate > 100) {
        message.error('할인율은 0~100 사이여야 합니다.');
        return;
      }

      setIsUploading(true);

      await regProduct(newProduct);

      message.success('상품이 성공적으로 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['product'] });
      onCancel();
    } catch (error) {
      message.error('상품 등록 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name">상품명</Label>
        <Input
          id="name"
          value={newProduct.name}
          onChange={e =>
            setNewProduct(prev => ({ ...prev, name: e.target.value }))
          }
          placeholder="상품명을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">상품 설명</Label>
        <Input
          id="description"
          value={newProduct.description}
          onChange={e =>
            setNewProduct(prev => ({ ...prev, description: e.target.value }))
          }
          placeholder="상품 설명을 입력하세요"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="periodMonths">기간(개월)</Label>
          <Input
            id="periodMonths"
            type="number"
            min="1"
            value={newProduct.periodMonths}
            onChange={e =>
              setNewProduct(prev => ({
                ...prev,
                periodMonths: parseInt(e.target.value)
              }))
            }
            placeholder="기간을 입력하세요"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">가격</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={newProduct.price}
            onChange={e =>
              setNewProduct(prev => ({
                ...prev,
                price: parseInt(e.target.value)
              }))
            }
            placeholder="가격을 입력하세요"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="discountRate">할인율(%)</Label>
        <Input
          id="discountRate"
          type="number"
          min="0"
          max="100"
          value={newProduct.discountRate}
          onChange={e =>
            setNewProduct(prev => ({
              ...prev,
              discountRate: parseInt(e.target.value)
            }))
          }
          placeholder="할인율을 입력하세요"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={newProduct.active}
          onCheckedChange={checked =>
            setNewProduct(prev => ({ ...prev, active: checked }))
          }
          className="bg-gray-200 data-[state=checked]:bg-gray-200 [&>span]:bg-white data-[state=checked]:[&>span]:bg-blue-600"
        />
        <Label htmlFor="active">활성화 여부</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={isUploading}>
          {isUploading ? '등록 중...' : '등록'}
        </Button>
      </div>
    </div>
  );
};
