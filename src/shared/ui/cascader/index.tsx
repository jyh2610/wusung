'use client';
import React from 'react';
import type { CascaderProps } from 'antd';
import { Cascader } from 'antd';
import { ICategoryLeaf } from '@/entities/program/type.dto';

export interface CascaderOption {
  value: number;
  label: string;
  children?: CascaderOption[];
  isLeaf?: boolean;
}

interface CustomCascaderProps {
  options: ICategoryLeaf[];
  value?: number[];
  onChange?: (value: number[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CustomCascader({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  disabled = false,
  className,
  style
}: CustomCascaderProps) {
  // ICategoryLeaf를 CascaderOption으로 변환
  const transformOptions = (items: ICategoryLeaf[]): CascaderOption[] => {
    return items.map(item => ({
      value: item.categoryId,
      label: item.name,
      children: item.children?.length
        ? transformOptions(item.children)
        : undefined,
      isLeaf: !item.children?.length
    }));
  };

  const handleChange: CascaderProps<CascaderOption>['onChange'] = (
    newValue,
    selectedOptions
  ) => {
    if (newValue) {
      onChange?.(newValue as number[]);
    }
  };

  const getSelectedLabel = (value: number[] | undefined): string => {
    if (!value || value.length === 0) return '';

    const findLabel = (
      items: ICategoryLeaf[],
      targetId: number
    ): string | undefined => {
      for (const item of items) {
        if (item.categoryId === targetId) {
          return item.name;
        }
        if (item.children) {
          const found = findLabel(item.children, targetId);
          if (found) return found;
        }
      }
      return undefined;
    };

    const lastId = value[value.length - 1];
    return findLabel(options, lastId) || '';
  };

  return (
    <Cascader
      options={transformOptions(options)}
      value={value}
      onChange={handleChange}
      expandTrigger="hover"
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      style={style}
      changeOnSelect
      displayRender={() => getSelectedLabel(value)}
    />
  );
}
