'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IProductDetail } from '@/components/admin/product/type';
import { getProductDetail } from '@/components/admin/product/api';
import { message } from 'antd';
import { format } from 'date-fns';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<IProductDetail | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductDetail(Number(params.id));
        if (data) {
          const productDetail: IProductDetail = {
            productId: data.productId,
            name: data.name,
            periodMonths: data.periodMonths,
            price: data.price,
            description: data.description || '',
            imageUrl: data.imageUrl || null,
            isDeleted: data.isDeleted || false,
            discountRate: data.discountRate || 0,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            active: data.active
          };
          setProduct(productDetail);
        }
      } catch (error) {
        message.error('상품 정보를 불러오는 중 오류가 발생했습니다.');
        router.push('/admin/product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">상품 상세 정보</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">기본 정보</h2>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">상품명:</span> {product.name}
              </p>
              <p>
                <span className="font-medium">기간:</span>{' '}
                {product.periodMonths}개월
              </p>
              <p>
                <span className="font-medium">가격:</span>{' '}
                {product.price.toLocaleString()}원
              </p>
              <p>
                <span className="font-medium">할인율:</span>{' '}
                {product.discountRate}%
              </p>
              <p>
                <span className="font-medium">상태:</span>{' '}
                {product.active ? '활성' : '비활성'}
              </p>
              <p>
                <span className="font-medium">삭제 여부:</span>{' '}
                {product.isDeleted ? '삭제됨' : '삭제되지 않음'}
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">상품 설명</h2>
            <div className="mt-2">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>
          {product.imageUrl && (
            <div>
              <h2 className="text-lg font-semibold">상품 이미지</h2>
              <div className="mt-2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-w-md rounded-lg"
                />
              </div>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">등록 정보</h2>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">등록일:</span>{' '}
                {format(new Date(product.createdAt), 'yyyy-MM-dd HH:mm')}
              </p>
              <p>
                <span className="font-medium">수정일:</span>{' '}
                {format(new Date(product.updatedAt), 'yyyy-MM-dd HH:mm')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={() => router.push('/admin/product')}>
          목록으로
        </Button>
        <Button
          onClick={() =>
            router.push(`/admin/product/edit/${product.productId}`)
          }
        >
          수정하기
        </Button>
      </div>
    </div>
  );
}
