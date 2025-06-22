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
import { IManager } from '@/shared/type';

export function ManagerSettings() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedManager, setSelectedManager] = useState<IManager | undefined>(
    undefined
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['managers'],
    queryFn: getManager
  });

  if (isLoading) return <div>로딩 중...</div>;

  if (isCreating) {
    return (
      <ManagerForm
        onCancel={() => {
          setIsCreating(false);
          setSelectedManager(undefined);
        }}
        initialData={selectedManager}
      />
    );
  }

  // data가 undefined이거나 배열이 아닌 경우를 처리
  const managerData = Array.isArray(data) ? data : data ? [data] : [];
  const isEmpty = error || !data || managerData.length === 0;

  return (
    <div className={container}>
      <div className={headcontainer}>
        <h1 className={header}>담당자 관리 페이지</h1>
        <div className={headerBtn}>
          <Button
            content={'담당자 정보수정'}
            type="borderBrand"
            onClick={() => setIsCreating(true)}
          />
        </div>
      </div>

      <div>
        {isEmpty ? (
          <div className={noData}>담당자 정보가 없습니다.</div>
        ) : (
          managerData.map((manager: any) => (
            <div
              key={manager.email}
              onClick={() => {
                setSelectedManager(manager);
                setIsCreating(true);
              }}
              style={{ cursor: 'pointer', padding: '8px 0' }}
            >
              {manager.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
