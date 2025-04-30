'use client';

import { IContent } from '@/entities/program/type.dto';
import { DashBoard } from '@/shared';
import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore';
import React, { useEffect, useState } from 'react';
import { fetchEvaluationContentsOnly } from './utils';

function Evaluation() {
  const categoryTree = useCategoryTreeStore.getState().categoryTree;
  const [categoryContentMap, setCategoryContentMap] = useState<IContent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchEvaluationContentsOnly(categoryTree);
      setCategoryContentMap(result);
    };
    fetchData();
  }, [categoryTree]);
  return (
    <div>
      <DashBoard rows={categoryContentMap} />
    </div>
  );
}

export default Evaluation;
