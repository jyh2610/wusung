"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pencil, Trash2, MoreVertical, Eye, Calendar } from "lucide-react"

export function ContentList() {
  // Sample data - in a real app, this would come from an API
  const [contents, setContents] = useState([
    {
      id: 1,
      title: "2024년 트렌드 분석",
      type: "블로그",
      status: "published",
      date: "2024-03-25",
      views: 1245,
    },
    {
      id: 2,
      title: "신제품 출시 안내",
      type: "뉴스",
      status: "published",
      date: "2024-03-23",
      views: 876,
    },
    {
      id: 3,
      title: "여름 이벤트 안내",
      type: "이벤트",
      status: "draft",
      date: "2024-03-20",
      views: 0,
    },
    {
      id: 4,
      title: "사용자 인터뷰",
      type: "비디오",
      status: "published",
      date: "2024-03-18",
      views: 2341,
    },
    {
      id: 5,
      title: "제품 사용 가이드",
      type: "문서",
      status: "published",
      date: "2024-03-15",
      views: 543,
    },
    {
      id: 6,
      title: "회사 소개",
      type: "페이지",
      status: "published",
      date: "2024-03-10",
      views: 987,
    },
    {
      id: 7,
      title: "고객 후기 모음",
      type: "블로그",
      status: "draft",
      date: "2024-03-05",
      views: 0,
    },
  ])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            <TableHead>유형</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>날짜</TableHead>
            <TableHead className="text-right">조회수</TableHead>
            <TableHead className="w-[100px]">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((content) => (
            <TableRow key={content.id}>
              <TableCell className="font-medium">{content.title}</TableCell>
              <TableCell>{content.type}</TableCell>
              <TableCell>
                <Badge variant={content.status === "published" ? "default" : "outline"}>
                  {content.status === "published" ? "게시됨" : "초안"}
                </Badge>
              </TableCell>
              <TableCell>{content.date}</TableCell>
              <TableCell className="text-right">{content.views.toLocaleString()}</TableCell>
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
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>일정 변경</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>삭제</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

