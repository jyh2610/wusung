// components/common/DaumAddressSearchButton.tsx
'use client';

import React from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { Button } from '../Button';

const scriptUrl =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

interface DaumAddressSearchButtonProps {
  onAddressSelect: (address: string) => void;
  buttonText?: string;
}

export const DaumAddressSearchButton = ({
  onAddressSelect,
  buttonText = '주소검색'
}: DaumAddressSearchButtonProps) => {
  const open = useDaumPostcodePopup(scriptUrl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    open({
      onComplete: data => {
        const fullAddress = data.address;
        onAddressSelect(fullAddress);
      }
    });
  };

  return (
    <Button type="borderBrand" content={buttonText} onClick={handleClick} />
  );
};
