import React from 'react';
import { InquiryFilePreview } from './InquiryFilePreview';
import { IInquiry } from '@/entities/mypage/type';
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
  comments: { [key: string]: any }[];
  files: { url: string; name?: string }[];
  onBack: () => void;
}

export function InquiryDetail({
  inquiry,
  comments,
  files,
  onBack
}: InquiryDetailProps) {
  console.log('InquiryDetail props:', inquiry);
  console.log('inquiry:', inquiry);
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
                {inquiry.updatedAt ? inquiry.updatedAt.replace('T', ' ') : '-'}
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
            {files.length ? (
              files.map((file, idx) => (
                <InquiryFilePreview key={idx} url={file.url} name={file.name} />
              ))
            ) : (
              <span className={detailNoData}>첨부 파일 없음</span>
            )}
          </div>
        </div>

        <div>
          <strong className={detailSectionTitle}>댓글</strong>
          <ul className={detailCommentList}>
            {comments.length ? (
              comments.map((c, idx) => (
                <li key={idx} className={detailCommentItem}>
                  {c.content || '내용 없음'}
                </li>
              ))
            ) : (
              <li className={detailNoData}>댓글 없음</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
