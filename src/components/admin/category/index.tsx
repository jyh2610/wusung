'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCategoryList,
  regCategory,
  updateCategory,
  deleteCategory
} from '../api';
import { ICategory } from '@/shared/type';
import { RegCategory } from '@/components/admin/tpye';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { message } from 'antd';

function TableSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 4 }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export const Category = () => {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [newCategory, setNewCategory] = useState<
    RegCategory & { categoryId?: number }
  >({
    name: '',
    parentId: 0,
    isUsed: true
  });
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoryList
  });

  // 모든 카테고리를 평탄화하는 함수
  const flattenCategories = (categories: ICategory[]): ICategory[] => {
    return categories.reduce((acc: ICategory[], category) => {
      return [...acc, category, ...flattenCategories(category.children || [])];
    }, []);
  };

  // 모든 카테고리 목록
  const allCategories = categories ? flattenCategories(categories) : [];

  const handleAddCategory = async () => {
    try {
      if (!newCategory.parentId) {
        message.error('상위 카테고리를 선택해주세요.');
        return;
      }
      if (isEditMode && selectedCategoryId) {
        await updateCategory(selectedCategoryId, newCategory);
        message.success('카테고리가 성공적으로 수정되었습니다.');
      } else {
        await regCategory(newCategory);
        message.success('카테고리가 성공적으로 등록되었습니다.');
      }
      setIsAddModalOpen(false);
      setIsEditMode(false);
      setSelectedCategoryId(null);
      setNewCategory({
        name: '',
        parentId: 0,
        isUsed: true
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (error) {
      message.error(
        isEditMode
          ? '카테고리 수정 중 오류가 발생했습니다.'
          : '카테고리 등록 중 오류가 발생했습니다.'
      );
    }
  };

  const handleEditClick = (category: ICategory) => {
    if (!category.parentId) {
      message.error('최상위 카테고리는 수정할 수 없습니다.');
      return;
    }
    setIsEditMode(true);
    setSelectedCategoryId(category.categoryId);
    setNewCategory({
      name: category.name,
      parentId: category.parentId || 0,
      isUsed: category.isUsed
    });
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setSelectedCategoryId(null);
    setNewCategory({
      name: '',
      parentId: 0,
      isUsed: true
    });
  };

  const handleDeleteClick = async (category: ICategory) => {
    if (!category.parentId) {
      message.error('최상위 카테고리는 삭제할 수 없습니다.');
      return;
    }
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    await deleteCategory(selectedCategory.categoryId);
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const renderCategoryRow = (category: ICategory, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.categoryId);
    const isTopLevel = !category.parentId;

    return (
      <React.Fragment key={category.categoryId}>
        <TableRow>
          <TableCell className="pl-4">
            <div className="flex items-center gap-2">
              <div style={{ marginLeft: `${level * 20}px` }} />
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleCategory(category.categoryId)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {!hasChildren && <div className="w-6" />}
              {category.name}
            </div>
          </TableCell>
          <TableCell>{category.categoryId}</TableCell>
          <TableCell>{category.parentId || '-'}</TableCell>
          <TableCell>
            <Badge variant={category.isUsed ? 'default' : 'secondary'}>
              {category.isUsed ? '사용중' : '미사용'}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              {!isTopLevel && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(category)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </TableCell>
        </TableRow>
        {hasChildren &&
          isExpanded &&
          category.children?.map((child: ICategory) =>
            renderCategoryRow(child, level + 1)
          )}
      </React.Fragment>
    );
  };

  // 재귀적으로 카테고리 옵션을 렌더링하는 컴포넌트
  const renderCategoryOptions = (category: ICategory, depth: number = 0) => {
    return (
      <React.Fragment key={category.categoryId}>
        <SelectItem
          value={category.categoryId.toString()}
          style={{ paddingLeft: `${depth * 20}px` }}
          className={`${depth === 0 ? 'font-bold' : 'text-gray-700'}`}
        >
          {category.name}
        </SelectItem>
        {category.children?.map(child =>
          renderCategoryOptions(child, depth + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="카테고리 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm bg-white"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>카테고리 등록</Button>
      </div>

      <div className="rounded-md border bg-[#FFFFFF]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>카테고리명</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>상위 카테고리 ID</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableSkeleton key={index} />
              ))
            ) : filteredCategories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  카테고리가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories?.map(category => renderCategoryRow(category))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>카테고리 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              정말로 &quot;{selectedCategory?.name}&quot; 카테고리를
              삭제하시겠습니까?
            </p>
            <p className="text-sm text-red-500 mt-2">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? '카테고리 수정' : '카테고리 등록'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">카테고리명</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={e =>
                  setNewCategory(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="카테고리명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">상위 카테고리</Label>
              <Select
                value={newCategory.parentId?.toString()}
                onValueChange={value =>
                  setNewCategory(prev => ({
                    ...prev,
                    parentId: Number(value)
                  }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="상위 카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map(category =>
                    renderCategoryOptions(category, 0)
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isUsed"
                checked={newCategory.isUsed}
                onCheckedChange={checked =>
                  setNewCategory(prev => ({ ...prev, isUsed: checked }))
                }
                className="data-[state=checked]:bg-blue-500 border-2 border-gray-200 [&>span]:bg-gray-400"
              />
              <Label htmlFor="isUsed" className="text-sm font-medium">
                {newCategory.isUsed ? (
                  <span className="text-blue-600 font-semibold">사용</span>
                ) : (
                  <span className="text-gray-500 px-2 py-1 rounded-md">
                    미사용
                  </span>
                )}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleModalClose}>
              취소
            </Button>
            <Button onClick={handleAddCategory}>
              {isEditMode ? '수정' : '등록'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
