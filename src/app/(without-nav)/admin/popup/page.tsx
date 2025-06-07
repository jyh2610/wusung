'use client';

import React, { useState } from 'react';
import { List } from '@/components/admin/popup/ui/list';
import { Upload } from '@/components/admin/popup/ui/upload';

const Page = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="p-6">
      {isUploading ? (
        <Upload onCancel={() => setIsUploading(false)} />
      ) : (
        <List onAdd={() => setIsUploading(true)} />
      )}
    </div>
  );
};

export default Page;
