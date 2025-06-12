import React from 'react';
import { MemberDetail } from '@/components/admin/member/detail';

const MemberDetailPage = async ({ params }: { params: { id: string } }) => {
  const memberId = parseInt(params.id);

  return (
    <div className="p-6 space-y-6 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">회원 상세 정보</h1>
      </div>
      <MemberDetail memberId={memberId} />
    </div>
  );
};

export default MemberDetailPage;
