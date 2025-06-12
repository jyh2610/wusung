'use client';

import { IEmail } from '@/shared/ui';
import Select, { SingleValue } from 'react-select';

interface IProps {
  options: IEmail[];
  placeholder: string;
  isSearchable?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function DropDown({
  options,
  placeholder,
  isSearchable = true,
  value,
  onChange
}: IProps) {
  const selectedOption = options.find(option => option.value === value) || null;

  const handleChange = (newValue: SingleValue<IEmail>) => {
    if (newValue) {
      onChange(newValue.value); // 외부로 값 전달
    }
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
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
