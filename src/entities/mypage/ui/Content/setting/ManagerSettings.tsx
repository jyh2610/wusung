'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getManager } from '@/entities/mypage/api';
import { Button } from '@/shared/ui';
import {
  container,
  headcontainer,
  header,
  headerBtn,
  noData
} from './index.css';
import { ManagerForm } from './Manage';

// 담당자 추가 폼 컴포넌트 (별도 작성 필요)

export function ManagerSettings() {
  const [isCreating, setIsCreating] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['managers'],
    queryFn: getManager
  });

  if (isLoading) return <div>로딩 중...</div>;

  if (isCreating) {
    return <ManagerForm onCancel={() => setIsCreating(false)} />;
  }

  const isEmpty = error || !data || data.length === 0;

  return (
    <div className={container}>
      <div className={headcontainer}>
        <h1 className={header}>담당자 관리 페이지</h1>
        <div className={headerBtn}>
          <Button
            content={'담당자 추가'}
            type="borderBrand"
            onClick={() => setIsCreating(true)}
          />
        </div>
      </div>

      <div>
        {isEmpty ? (
          <div className={noData}>담당자 정보가 없습니다.</div>
        ) : (
          data.map(manager => <div key={manager.email}>{manager.name}</div>)
        )}
      </div>
    </div>
  );
}
