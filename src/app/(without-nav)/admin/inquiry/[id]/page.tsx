'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getInquiryDetail,
  registerInquiryComment,
  updateInquiryComment,
  deleteInquiryComment
} from '@/components/admin/personal/api';
import {
  IGetInquiryDetail,
  IInquiryComment
} from '@/components/admin/personal/type';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function InquiryDetailPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [editingComment, setEditingComment] = useState<{
    id: number;
    content: string;
    files: File[];
    deletedFilesIdList: number[];
  } | null>(null);

  const { data: inquiry, isLoading } = useQuery({
    queryKey: ['inquiry-detail', params.id],
    queryFn: () => getInquiryDetail(Number(params.id))
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      message.error('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await registerInquiryComment(Number(params.id), comment, files);
      message.success('댓글이 등록되었습니다.');
      setComment('');
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ['inquiry-detail'] });
    } catch (error) {
      message.error('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  const handleCommentUpdate = async () => {
    if (!editingComment) return;
    if (!editingComment.content.trim()) {
      message.error('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await updateInquiryComment(
        Number(params.id),
        editingComment.id,
        editingComment.content,
        editingComment.files,
        editingComment.deletedFilesIdList
      );
      message.success('댓글이 수정되었습니다.');
      setEditingComment(null);
      queryClient.invalidateQueries({ queryKey: ['inquiry-detail'] });
    } catch (error) {
      message.error('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await deleteInquiryComment(Number(params.id), commentId);
      message.success('댓글이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['inquiry-detail'] });
    } catch (error) {
      message.error('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (!inquiry?.data) {
    return <div>문의를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">1:1 문의 상세</h1>
        <Button variant="outline" onClick={() => router.back()}>
          목록으로
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>문의 유형</Label>
            <div className="mt-1">{inquiry.data.inquiry.type}</div>
          </div>
          <div>
            <Label>제목</Label>
            <div className="mt-1">{inquiry.data.inquiry.title}</div>
          </div>
          <div>
            <Label>내용</Label>
            <div className="mt-1 whitespace-pre-wrap">
              {inquiry.data.inquiry.content}
            </div>
          </div>
          {inquiry.data.files && inquiry.data.files.length > 0 && (
            <div>
              <Label>첨부파일</Label>
              <div className="mt-1 space-y-2">
                {inquiry.data.files.map((file: string, index: number) => (
                  <a
                    key={index}
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline"
                  >
                    {file}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div>
            <Label>작성일</Label>
            <div className="mt-1">
              {format(
                new Date(inquiry.data.inquiry.updatedAt),
                'yyyy-MM-dd HH:mm:ss'
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">답변 목록</h2>
        {inquiry.data.comments.map((comment, index) => (
          <Card key={index} className="p-4">
            {editingComment?.id === index ? (
              <div className="space-y-4">
                <Textarea
                  value={editingComment.content}
                  onChange={e =>
                    setEditingComment(prev => ({
                      ...prev!,
                      content: e.target.value
                    }))
                  }
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingComment(null)}
                  >
                    취소
                  </Button>
                  <Button onClick={handleCommentUpdate}>수정</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="whitespace-pre-wrap">{comment}</div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingComment({
                          id: index,
                          content: comment,
                          files: [],
                          deletedFilesIdList: []
                        })
                      }
                    >
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCommentDelete(index)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}

        <div className="space-y-4">
          <h2 className="text-xl font-bold">답변 작성</h2>
          <div className="space-y-4">
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="답변을 입력해주세요."
            />
            <div>
              <Label>첨부파일</Label>
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCommentSubmit}>답변 등록</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
