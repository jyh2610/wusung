'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { pageContainer } from '@/app/(with-nav)/signup/index.css';
import { FindInfoComponent } from '@/entities';
function Find() {
  const params = useParams();
  const { type } = params; // "id" 또는 "password"

  if (type !== 'id' && type !== 'password') {
    return <p>잘못된 접근입니다.</p>;
  }
  return (
    <div className={pageContainer}>
      <FindInfoComponent type={type} />
    </div>
  );
}

export default Find;
