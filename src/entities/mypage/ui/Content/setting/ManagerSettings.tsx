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
  noData,
  managerCard,
  managerHeader,
  managerAvatar,
  managerInfo,
  managerName,
  managerJobGrade,
  managerDetails,
  detailItem,
  detailLabel,
  detailValue,
  editButton
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
  const managerData = data ? [data] : [];
  const isEmpty = error || !data;
  const manager = data?.data;

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split('').slice(0, 2).join('');
  };

  console.log(managerData);

  return (
    <div className={container}>
      <div className={headcontainer}>
        <h1 className={header}>담당자 관리</h1>
        <div className={headerBtn}>
          <Button
            content={'담당자 정보수정'}
            type="borderBrand"
            onClick={() => setIsCreating(true)}
          />
        </div>
      </div>

      <div>
        {isEmpty || !manager ? (
          <div className={noData}>담당자 정보가 없습니다.</div>
        ) : (
          <div
            className={managerCard}
            onClick={() => {
              setSelectedManager(manager);
              setIsCreating(true);
            }}
          >
            <div className={editButton}>수정</div>

            <div className={managerHeader}>
              <div className={managerAvatar}>{getInitials(manager.name)}</div>
              <div className={managerInfo}>
                <div className={managerName}>{manager.name}</div>
                <div className={managerJobGrade}>{manager.jobGrade}</div>
              </div>
            </div>

            <div className={managerDetails}>
              <div className={detailItem}>
                <div className={detailLabel}>이메일</div>
                <div className={detailValue}>{manager.email}</div>
              </div>
              <div className={detailItem}>
                <div className={detailLabel}>연락처</div>
                <div className={detailValue}>{manager.phoneNumber}</div>
              </div>
              <div className={detailItem}>
                <div className={detailLabel}>주소</div>
                <div className={detailValue}>{manager.address}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
