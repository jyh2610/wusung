import { MypageComponent } from '@/entities/mypage';
import { layoutContainer } from '../introduce/layout.css';
import { getManager } from '@/entities/mypage/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/utils';
import { cookies } from 'next/headers'; // ✅ cookie에서 token 추출
import { redirect } from 'next/navigation'; // ✅ redirect 사용
import { getRole } from '@/shared/api/common';

async function Mypage() {
  // ✅ 1. 쿠키에서 token 꺼내기
  const token = cookies().get('token')?.value ?? null;

  // ✅ 2. 권한 확인
  const roleRes = await getRole(token);

  if (!roleRes) {
    redirect('/'); // ✅ 3. UNKNOWN이면 홈으로 이동
  }

  // ✅ 4. 데이터 prefetch
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['managers'],
    queryFn: getManager
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className={layoutContainer}>
        <MypageComponent />
      </main>
    </HydrationBoundary>
  );
}

export default Mypage;
