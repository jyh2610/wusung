import { MemberList } from '@/components/admin/member';
const MemberPage = () => {
  return (
    <div className="p-6 space-y-6 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">회원 관리</h1>
      </div>
      <MemberList />
    </div>
  );
};

export default MemberPage;
