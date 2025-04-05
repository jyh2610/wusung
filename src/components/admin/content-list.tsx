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
import { Pencil, Trash2, MoreVertical, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { IContent } from '@/entities/program/type.dto';
import { getContentList } from './api';
import { useRouter } from 'next/navigation';

export function ContentList() {
  const [contents, setContents] = useState<IContent[]>([]);
  const router = useRouter();

  const handleRowClick = (id: number) => {
    router.push(`/admin/content/${id}`); // 상세 페이지 경로
  };
  // 실제 구현 시에는 아래 주석을 해제하여 API에서 데이터를 가져오도록 함
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await getContentList({
          categoryId: 1,
          difficultyLevel: 2,
          year: 2025,
          month: 3
        });
        setContents(response || []);
      } catch (error) {
        console.error('콘텐츠 목록 조회 실패:', error);
      }
    };

    fetchContents();
  }, []);

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            <TableHead>작성일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">조회수</TableHead>
            <TableHead className="w-[100px]">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                콘텐츠가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            contents.map(content => (
              <TableRow
                onClick={() => handleRowClick(content.eduContentId!)}
                key={content.categoryId}
              >
                <TableCell className="font-medium">{content.title}</TableCell>
                <TableCell>{formatDate(content?.createdAt!)}</TableCell>
                <TableCell>
                  <Badge variant={content.isUsed ? 'default' : 'outline'}>
                    {content.isUsed ? '사용' : '미사용'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {content?.viewCount?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">메뉴 열기</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>보기</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>수정</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>삭제</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
