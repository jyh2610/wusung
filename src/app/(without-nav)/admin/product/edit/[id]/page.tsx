'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { IRegProduct } from '@/components/admin/product/type';
import {
  getProductDetail,
  updateProduct
} from '@/components/admin/product/api';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [product, setProduct] = useState<IRegProduct>({
    name: '',
    periodMonths: 0,
    price: 0,
    description: '',
    discountRate: 0,
    active: true
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const dataParam = searchParams.get('data');
        if (dataParam) {
          const parsedData = JSON.parse(
            decodeURIComponent(dataParam)
          ) as IRegProduct;
          setProduct(parsedData);
          setIsLoading(false);
          return;
        }

        const data = await getProductDetail(Number(params.id));
        if (data) {
          setProduct({
            name: data.name,
            periodMonths: data.periodMonths,
            price: data.price,
            description: data.description,
            discountRate: data.discountRate,
            active: data.active
          });
        }
      } catch (error) {
        message.error('상품 정보를 불러오는 중 오류가 발생했습니다.');
        router.push('/admin/product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router, searchParams]);

  const handleSubmit = async () => {
    try {
      if (!product.name.trim()) {
        message.error('상품명을 입력해주세요.');
        return;
      }
      if (!product.description.trim()) {
        message.error('상품 설명을 입력해주세요.');
        return;
      }
      if (product.periodMonths <= 0) {
        message.error('기간을 입력해주세요.');
        return;
      }
      if (product.price <= 0) {
        message.error('가격을 입력해주세요.');
        return;
      }
      if (product.discountRate < 0 || product.discountRate > 100) {
        message.error('할인율은 0~100 사이여야 합니다.');
        return;
      }

      setIsUpdating(true);

      await updateProduct(Number(params.id), product);

      message.success('상품이 성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['product'] });
      router.push('/admin/product');
    } catch (error) {
      message.error('상품 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name">상품명</Label>
        <Input
          id="name"
          value={product.name}
          onChange={e =>
            setProduct(prev => ({ ...prev, name: e.target.value }))
          }
          placeholder="상품명을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">상품 설명</Label>
        <Input
          id="description"
          value={product.description}
          onChange={e =>
            setProduct(prev => ({ ...prev, description: e.target.value }))
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
            value={product.periodMonths}
            onChange={e =>
              setProduct(prev => ({
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
            value={product.price}
            onChange={e =>
              setProduct(prev => ({
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
          value={product.discountRate}
          onChange={e =>
            setProduct(prev => ({
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
          checked={product.active}
          onCheckedChange={checked =>
            setProduct(prev => ({ ...prev, active: checked }))
          }
          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 border border-gray-300"
        />
        <Label htmlFor="active">활성화 여부</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.push('/admin/product')}>
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
