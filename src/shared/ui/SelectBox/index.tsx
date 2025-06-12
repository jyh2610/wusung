'use client';

import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { IEmail } from '../types';

// IProps 인터페이스 정의
interface IProps {
  options: { value: string; label: string }[];
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
  isSearchable?: boolean;
}

export function SelectBox({
  options,
  placeholder,
  value,
  onChange,
  isSearchable = true
}: IProps) {
  const handleChange = (
    newValue: SingleValue<{ value: string; label: string }>
  ) => {
    if (newValue) {
      onChange(newValue.value);
    }
  };

  return (
    <Select
      value={options.find(option => option.value === value)}
      onChange={handleChange}
      isDisabled={false}
      options={options}
      placeholder={placeholder}
      isSearchable={isSearchable}
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
