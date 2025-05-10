import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface UsePrintWithPrepareOptions {
  queryKey: any[];
  prepareFn: () => Promise<void>;
}

export const usePrintWithPrepare = ({
  queryKey,
  prepareFn
}: UsePrintWithPrepareOptions) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: prepareFn,
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const print = async () => {
    try {
      setIsLoading(true);
      await mutateAsync(); // 서버 준비 호출
      setIsLoading(false);
      setTimeout(() => window.print(), 100); // 모달 닫힌 뒤 인쇄
    } catch (error) {
      setIsLoading(false);
      console.error('인쇄 준비 중 오류 발생:', error);
    }
  };

  return { print, isLoading };
};
