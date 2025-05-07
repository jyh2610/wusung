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
      const page = typeof pageParam === 'number' ? pageParam : 0; // 이 라인은 initialPageParam 덕분에 첫 호출에선 0이 될 것입니다.
      return getPaymentList(page, pageSize);
    },
    getNextPageParam: lastPage => {
      if (!lastPage.data) return undefined;

      const currentPage = lastPage.data.number;
      const totalPages = lastPage.data.totalPages;

      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
    select: data => {
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

    initialPageParam: 0 // API가 0부터 페이지를 시작하는 경우
  });
};
