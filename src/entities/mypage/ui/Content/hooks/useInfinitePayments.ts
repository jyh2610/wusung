import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query'; // Import InfiniteData
import { ApiResponse, PaginatedResponse } from '@/shared/type';
import { filterPayments } from '@/entities/mypage/model/payment';
import { paymentListDTO } from '@/entities/mypage/type';
import { PaymentFilter } from '../const'; // Assuming PaymentFilter is correctly typed here
import { getPaymentList } from '@/entities/mypage/api';

const pageSize = 6;

export const useInfinitePayments = (selectedFilter: PaymentFilter) => {
  return useInfiniteQuery<
    ApiResponse<PaginatedResponse<paymentListDTO>>, // TQueryFnData: Type of a single page fetch result
    Error, // TError: Type of the error
    InfiniteData<ApiResponse<PaginatedResponse<paymentListDTO>>, number>, // TData: Type of the data returned by the hook after 'select', TPageParam is now number
    readonly ['paymentList', PaymentFilter], // TQueryKey: Specific key type
    number // TPageParam: Type of page parameter is number
  >({
    queryKey: ['paymentList', selectedFilter] as const, // Use 'as const' for better key typing
    queryFn: ({ pageParam }) => {
      // pageParam은 첫 호출 시 undefined일 수 있으며, getNextPageParam에서 number를 반환
      // 하지만 initialPageParam을 설정했으므로 첫 호출 시에도 number일 것입니다.
      // 안전하게 사용하기 위해 여전히 확인 로직을 두는 것은 나쁘지 않습니다.
      const page = typeof pageParam === 'number' ? pageParam : 0; // 이 라인은 initialPageParam 덕분에 첫 호출에선 0이 될 것입니다.
      return getPaymentList(page, pageSize);
    },
    getNextPageParam: lastPage => {
      if (!lastPage.data) return undefined;

      const currentPage = lastPage.data.number;
      const totalPages = lastPage.data.totalPages;

      // 다음 페이지 번호 (0-indexed)가 전체 페이지 수보다 작으면 다음 페이지 번호를 반환
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
    select: data => {
      // data는 InfiniteData<ApiResponse<PaginatedResponse<paymentListDTO>>, number> 타입
      return {
        ...data, // InfiniteData 구조 유지
        pages: data.pages.map(page => ({
          ...page, // 페이지 자체의 메타데이터 유지 (ApiResponse의 속성들)
          data: {
            ...page.data, // 페이지네이션 메타데이터 유지 (number, size, totalElements 등)
            content: filterPayments(page.data.content, selectedFilter) // content 배열만 필터링
          }
        }))
      };
    },
    // *** 추가된 부분: initialPageParam ***
    // 첫 번째 페이지 요청 시 사용할 페이지 매개변수 값을 설정
    initialPageParam: 0 // API가 0부터 페이지를 시작하는 경우
  });
};
