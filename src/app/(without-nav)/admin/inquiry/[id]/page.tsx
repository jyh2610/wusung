'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getInquiryDetail,
  registerInquiryComment,
  updateInquiryComment,
  deleteInquiryComment
} from '@/components/admin/personal/api';
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
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditingFileRemove = (index: number) => {
    if (!editingComment) return;
    setEditingComment(prev => ({
      ...prev!,
      files: prev!.files.filter((_, i) => i !== index)
    }));
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
      await queryClient.invalidateQueries({
        queryKey: ['inquiry-detail', params.id]
      });
      const chatContainer = document.querySelector('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
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
      await queryClient.invalidateQueries({
        queryKey: ['inquiry-detail', params.id]
      });
    } catch (error) {
      message.error('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await deleteInquiryComment(Number(params.id), commentId);
      message.success('댓글이 삭제되었습니다.');
      await queryClient.invalidateQueries({
        queryKey: ['inquiry-detail', params.id]
      });
    } catch (error) {
      message.error('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 타입 가드 함수 추가
  function isCommentObj(
    comment: any
  ): comment is { id: number; content: string } {
    return (
      typeof comment === 'object' &&
      comment !== null &&
      'id' in comment &&
      'content' in comment
    );
  }

  // 이미지 파일 확장자 체크 함수 추가
  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  // 파일 다운로드 링크 컴포넌트 추가
  const FileDownloadLink = ({ url, name }: { url: string; name: string }) => (
    <a
      href={url}
      download={name}
      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md text-gray-700 text-sm hover:bg-gray-200 transition-colors"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {name}
    </a>
  );

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
                {inquiry.data.files
                  .filter((file: any) => {
                    const fileIdList = JSON.parse(
                      inquiry.data.inquiry.fileIdList || '[]'
                    );
                    return fileIdList.includes(file.fileId);
                  })
                  .map((file: any) => (
                    <a
                      key={file.fileId}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      {file.fileName}
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
        <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 border rounded-lg bg-white">
          {Array.isArray(inquiry.data.comments) &&
            inquiry.data.comments.map((comment, index) => {
              const commentId =
                typeof comment === 'object' &&
                comment !== null &&
                'id' in comment
                  ? (comment as { id: number }).id
                  : `comment-${index}`;
              const commentContent =
                typeof comment === 'object' &&
                comment !== null &&
                'content' in comment
                  ? (comment as { content: string }).content
                  : String(comment);
              const isInquiryWriter =
                inquiry.data.inquiry.memberId === comment.memberId;

              return (
                <div
                  key={commentId}
                  className={`flex flex-col ${
                    isInquiryWriter ? 'items-end' : 'items-start'
                  } max-w-[70%] ${isInquiryWriter ? 'ml-auto' : 'mr-auto'}`}
                >
                  {editingComment && editingComment.id === comment.commentId ? (
                    <div className="w-full space-y-4 bg-white p-4 rounded-lg border">
                      <Textarea
                        value={editingComment.content}
                        onChange={e =>
                          setEditingComment(prev => ({
                            ...prev!,
                            content: e.target.value
                          }))
                        }
                        placeholder="댓글을 수정해주세요."
                      />
                      <div>
                        <Label>첨부파일</Label>
                        <div className="mt-1 space-y-2">
                          {inquiry.data.files
                            .filter((file: any) => {
                              const fileIdList = JSON.parse(
                                comment.fileIdList || '[]'
                              );
                              return (
                                fileIdList.includes(file.fileId) &&
                                !editingComment?.deletedFilesIdList?.includes(
                                  file.fileId
                                )
                              );
                            })
                            .map((file: any) => (
                              <div
                                key={file.fileId}
                                className="flex items-center justify-between"
                              >
                                {isImageFile(file.fileName) ? (
                                  <img
                                    src={file.fileUrl}
                                    alt={file.fileName}
                                    className="max-w-[200px] max-h-[200px] object-contain rounded"
                                  />
                                ) : (
                                  <FileDownloadLink
                                    url={file.fileUrl}
                                    name={file.fileName}
                                  />
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingComment(prev => ({
                                      ...prev!,
                                      deletedFilesIdList: [
                                        ...(prev?.deletedFilesIdList || []),
                                        file.fileId
                                      ]
                                    }));
                                  }}
                                >
                                  삭제
                                </Button>
                              </div>
                            ))}
                        </div>
                        <Input
                          type="file"
                          multiple
                          onChange={e => {
                            if (e.target.files) {
                              setEditingComment(prev => ({
                                ...prev!,
                                files: [
                                  ...(prev?.files || []),
                                  ...Array.from(e.target.files!)
                                ]
                              }));
                            }
                          }}
                          className="mt-2"
                        />
                        {editingComment?.files.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {editingComment.files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gray-600">
                                  {file.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditingFileRemove(index)}
                                >
                                  삭제
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          * 최대 5개까지 첨부 가능합니다. (각 파일 최대 10MB)
                        </p>
                      </div>
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
                      <div
                        className={`p-3 rounded-lg ${
                          isInquiryWriter
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {commentContent}
                      </div>
                      {inquiry.data.files && inquiry.data.files.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {inquiry.data.files
                            .filter((file: any) => {
                              const fileIdList = JSON.parse(
                                comment.fileIdList || '[]'
                              );
                              return fileIdList.includes(file.fileId);
                            })
                            .map((file: any) =>
                              isImageFile(file.fileName) ? (
                                <img
                                  key={file.fileId}
                                  src={file.fileUrl}
                                  alt={file.fileName}
                                  className="max-w-[200px] max-h-[200px] object-contain rounded"
                                />
                              ) : (
                                <FileDownloadLink
                                  key={file.fileId}
                                  url={file.fileUrl}
                                  name={file.fileName}
                                />
                              )
                            )}
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setEditingComment({
                                id: comment.commentId,
                                content: commentContent,
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
                            onClick={() =>
                              handleCommentDelete(comment.commentId)
                            }
                          >
                            삭제
                          </Button>
                        </div>
                        <span>
                          {format(
                            new Date(comment.createdAt),
                            'yyyy-MM-dd HH:mm:ss'
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-bold">답변 작성</h2>
          <div className="space-y-4 p-4 border rounded-lg bg-white">
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
              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileRemove(index)}
                      >
                        삭제
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                * 최대 5개까지 첨부 가능합니다. (각 파일 최대 10MB)
              </p>
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
