import { MypageComponent } from '@/entities/mypage';
import { layoutContainer } from '../introduce/layout.css';
import { getManager } from '@/entities/mypage/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/utils';

async function Mypage() {
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
