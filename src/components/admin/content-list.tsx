'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Pencil, Trash2, MoreVertical, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteCategory, Category, deleteContent } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategoryList, getContentList } from './api';
import { IContent } from '@/entities/program/type.dto';
import { useState } from 'react';
import { CustomCascader } from '@/shared/ui/cascader';
import { Pageable } from '@/shared/ui/Pageable';

// 최하위 노드만 추출하는 함수
function getLeafNodes(categories: Category[] = []): Category[] {
  let result: Category[] = [];

  function traverse(category: Category) {
    if (category.children.length === 0) {
      result.push(category);
    } else {
      category.children.forEach(traverse);
    }
  }

  categories.forEach(traverse);
  return result;
}

// 년도 생성 함수
function getYears() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
}

// 월 생성 함수
function getMonths() {
  return Array.from({ length: 12 }, (_, i) => i + 1);
}

export function ContentList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoryList
  });

  const leafCategories = getLeafNodes(categories);

  const { data: contentData } = useQuery({
    queryKey: [
      'contents',
      selectedCategory,
      selectedYear,
      selectedMonth,
      selectedDifficulty,
      currentPage,
      pageSize
    ],
    queryFn: () => {
      if (!selectedCategory) return Promise.resolve(undefined);
      return getContentList({
        categoryId: selectedCategory,
        difficultyLevel: selectedDifficulty,
        year: selectedYear,
        month: selectedMonth,
        page: currentPage,
        size: pageSize
      }).then(response => {
        if (response?.content) {
          return {
            ...response,
            content: response.content.map(content => ({
              ...content,
              difficultyLevel: selectedDifficulty
            }))
          };
        }
        return response;
      });
    },
    enabled: !!selectedCategory
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    }
  });

  const handleRowClick = (id: number) => {
    router.push(`/admin/content/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 필터 변경 시 페이지를 0으로 리셋
  const handleFilterChange = () => {
    setCurrentPage(0);
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 p-4 bg-white rounded-lg border">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">카테고리</label>
          <CustomCascader
            options={categories}
            value={selectedCategory ? [selectedCategory] : undefined}
            onChange={value => {
              if (value && value.length > 0) {
                setSelectedCategory(value[value.length - 1]);
                handleFilterChange();
              }
            }}
            placeholder="카테고리 선택"
            style={{ width: '240px' }}
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">년도</label>
          <Select
            value={selectedYear.toString()}
            onValueChange={value => {
              setSelectedYear(Number(value));
              handleFilterChange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="년도 선택" />
            </SelectTrigger>
            <SelectContent>
              {getYears().map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">월</label>
          <Select
            value={selectedMonth.toString()}
            onValueChange={value => {
              setSelectedMonth(Number(value));
              handleFilterChange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="월 선택" />
            </SelectTrigger>
            <SelectContent>
              {getMonths().map(month => (
                <SelectItem key={month} value={month.toString()}>
                  {month}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">난이도</label>
          <Select
            value={selectedDifficulty.toString()}
            onValueChange={value => {
              setSelectedDifficulty(Number(value));
              handleFilterChange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="난이도 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">상</SelectItem>
              <SelectItem value="2">중</SelectItem>
              <SelectItem value="3">하</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-[#FFFFFF]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>난이도</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!contentData?.content || contentData.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  콘텐츠가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              contentData.content.map((content: IContent) => (
                <TableRow key={content.eduContentId}>
                  <TableCell>{content.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {content.difficultyLevel === 1
                        ? '상'
                        : content.difficultyLevel === 2
                          ? '중'
                          : '하'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {content.createdAt && formatDate(content.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRowClick(content.eduContentId!)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(content.eduContentId!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {contentData && (
        <div className="flex justify-center">
          <Pageable
            currentPage={currentPage}
            totalPages={contentData.totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
