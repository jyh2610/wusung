import React, { useState, useRef, useEffect } from 'react';
import { InquiryFilePreview } from './InquiryFilePreview';
import { IInquiry, Comment, File as ApiFile } from '@/entities/mypage/type';
import {
  detailWrapper,
  detailCard,
  detailButton,
  detailTitle,
  detailHr,
  detailTable,
  detailTh,
  detailTd,
  detailStatus,
  detailSectionTitle,
  detailImageList,
  detailCommentList,
  detailCommentItem,
  detailNoData
} from './inquiry.css';

interface InquiryDetailProps {
  inquiry: IInquiry;
  comments: Comment[];
  files: ApiFile[];
  onBack: () => void;
  onAddReply?: (
    commentId: number,
    content: string,
    files?: globalThis.File[]
  ) => Promise<void>;
  currentMemberId?: number;
  onRefresh?: () => void;
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
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      color: '#333',
      textDecoration: 'none',
      fontSize: '14px'
    }}
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

export function InquiryDetail({
  inquiry,
  comments,
  files,
  onBack,
  onAddReply,
  currentMemberId,
  onRefresh
}: InquiryDetailProps) {
  const [replyContent, setReplyContent] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<globalThis.File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentListRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim() && onAddReply && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await onAddReply(inquiry.inquiryId, replyContent.trim(), selectedFiles);
        setReplyContent('');
        setSelectedFiles([]);
        // 댓글 등록 성공 후 즉시 리페치
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error('댓글 작성 중 오류 발생:', error);
        alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 파일 ID 리스트를 파싱하는 함수
  const parseFileIdList = (fileIdList: string): number[] => {
    try {
      return JSON.parse(fileIdList);
    } catch {
      return [];
    }
  };

  // 특정 댓글의 파일들을 찾는 함수
  const getCommentFiles = (comment: Comment) => {
    const fileIds = parseFileIdList(comment.fileIdList);
    return files.filter(file => fileIds.includes(file.fileId));
  };

  // 문의 상세의 파일들을 찾는 함수
  const getInquiryFiles = () => {
    const fileIds = parseFileIdList(inquiry.fileIdList);
    return files.filter(file => fileIds.includes(file.fileId));
  };

  useEffect(() => {
    if (commentListRef.current) {
      commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div className={detailWrapper}>
      <div className={detailCard}>
        <button onClick={onBack} className={detailButton}>
          ← 목록으로
        </button>
        <h2 className={detailTitle}>문의 상세</h2>
        <hr className={detailHr} />
        <table className={detailTable}>
          <tbody>
            <tr>
              <th className={detailTh}>제목</th>
              <td className={detailTd}>{inquiry.title}</td>
            </tr>
            <tr>
              <th className={detailTh}>유형</th>
              <td className={detailTd}>{inquiry.type}</td>
            </tr>
            <tr>
              <th className={detailTh}>내용</th>
              <td className={detailTd}>{inquiry.content}</td>
            </tr>
            <tr>
              <th className={detailTh}>작성일</th>
              <td className={detailTd}>
                {inquiry.createdAt ? inquiry.createdAt.replace('T', ' ') : '-'}
              </td>
            </tr>
            <tr>
              <th className={detailTh}>수정일</th>
              <td className={detailTd}>
                {inquiry.updatedAt ? inquiry.updatedAt.replace('T', ' ') : '-'}
              </td>
            </tr>
            <tr>
              <th className={detailTh}>답변 상태</th>
              <td className={detailTd}>
                <span
                  className={detailStatus}
                  style={{
                    background: inquiry.isAnswered ? '#e1007b' : '#f0f0f0',
                    color: inquiry.isAnswered ? '#fff' : '#888'
                  }}
                >
                  {inquiry.isAnswered ? '답변 완료' : '답변 미완'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <strong className={detailSectionTitle}>첨부 파일</strong>
          <div className={detailImageList}>
            {getInquiryFiles().length ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {getInquiryFiles().map(file =>
                  isImageFile(file.fileName) ? (
                    <InquiryFilePreview
                      key={file.fileId}
                      url={file.fileUrl}
                      name={file.fileName}
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
            ) : (
              <span className={detailNoData}>첨부 파일 없음</span>
            )}
          </div>
        </div>

        <div>
          <strong className={detailSectionTitle}>댓글</strong>
          <div
            className={detailCommentList}
            ref={commentListRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '16px',
              border: '1px solid #eee',
              borderRadius: '8px',
              backgroundColor: '#fff',
              marginBottom: '16px'
            }}
          >
            {comments.length ? (
              comments.map(comment => {
                const isInquiryWriter = inquiry.memberId === comment.memberId;
                const commentFiles = getCommentFiles(comment);

                return (
                  <div
                    key={comment.commentId}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isInquiryWriter ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      alignSelf: isInquiryWriter ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: isInquiryWriter
                          ? '#e1007b'
                          : '#f0f0f0',
                        color: isInquiryWriter ? 'white' : 'black',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        marginBottom: '4px',
                        wordBreak: 'break-word'
                      }}
                    >
                      {comment.content || '내용 없음'}
                    </div>
                    {commentFiles.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '8px',
                          flexWrap: 'wrap'
                        }}
                      >
                        {commentFiles.map(file =>
                          isImageFile(file.fileName) ? (
                            <InquiryFilePreview
                              key={file.fileId}
                              url={file.fileUrl}
                              name={file.fileName}
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
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '4px'
                      }}
                    >
                      {comment.createdAt.replace('T', ' ')}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={detailNoData}>댓글 없음</div>
            )}
          </div>

          <form
            onSubmit={handleSubmitReply}
            style={{
              display: 'flex',
              gap: '8px',
              padding: '16px',
              border: '1px solid #eee',
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="댓글을 입력하세요"
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'none'
                }}
              />
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ flex: 1 }}
                />
                {selectedFiles.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {selectedFiles.length}개의 파일이 선택됨
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0 16px',
                backgroundColor: isSubmitting ? '#ccc' : '#e1007b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                height: '40px',
                alignSelf: 'flex-end',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? '전송 중...' : '전송'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
