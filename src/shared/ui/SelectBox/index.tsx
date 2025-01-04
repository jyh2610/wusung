'use client';

import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { IEmail } from '../types';

// IProps 인터페이스 정의
interface IProps {
  options: IEmail[];
}

export function SelectBox({ options }: IProps) {
  const [selectedOption, setSelectedOption] = useState<IEmail | null>(null);
  console.log(options);
  const handleChange = (newValue: SingleValue<IEmail>, actionMeta: unknown) => {
    setSelectedOption(newValue);
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      isDisabled={false}
      options={options}
      styles={{
        container: provided => ({
          ...provided,
          width: '100%',
          height: '100%',
          border: 'none'
        }),
        control: provided => ({
          ...provided,
          width: '100%',
          height: '100%',
          border: '1px solid rgba(191, 191, 191, 1)',
          borderRadius: '12px'
        }),
        valueContainer: provided => ({
          ...provided,
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        })
      }}
    />
  );
}
