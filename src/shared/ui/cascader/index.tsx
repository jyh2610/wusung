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
  onClick?: () => void;
}

export function CustomCascader({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  disabled = false,
  className,
  style,
  onClick
}: CustomCascaderProps) {
  // ICategoryLeaf를 CascaderOption으로 변환
  const transformOptions = (items: ICategoryLeaf[]): CascaderOption[] => {
    // items가 배열이 아닌 경우 빈 배열로 처리
    if (!Array.isArray(items)) {
      return [];
    }

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

  const getSelectedPath = (
    value: number[] | undefined
  ): { id: number; label: string }[] => {
    if (!value || value.length === 0) return [];

    const findPath = (
      items: ICategoryLeaf[],
      targetIds: number[]
    ): { id: number; label: string }[] => {
      const result: { id: number; label: string }[] = [];

      const findPathRecursive = (
        currentItems: ICategoryLeaf[],
        remainingIds: number[],
        currentPath: { id: number; label: string }[]
      ): boolean => {
        for (const item of currentItems) {
          const newPath = [
            ...currentPath,
            { id: item.categoryId, label: item.name }
          ];

          if (item.categoryId === remainingIds[0]) {
            if (remainingIds.length === 1) {
              // 마지막 노드를 찾았을 때
              result.push(...newPath);
              return true;
            } else {
              // 하위 노드에서 계속 검색
              if (
                item.children &&
                findPathRecursive(item.children, remainingIds.slice(1), newPath)
              ) {
                return true;
              }
            }
          }

          // 현재 아이템의 하위에서 검색
          if (
            item.children &&
            findPathRecursive(item.children, remainingIds, newPath)
          ) {
            return true;
          }
        }
        return false;
      };

      findPathRecursive(items, targetIds, []);
      return result;
    };

    return findPath(options, value);
  };

  const renderDisplay = () => {
    const path = getSelectedPath(value);

    if (path.length === 0) {
      return <span style={{ color: '#999' }}>{placeholder}</span>;
    }

    return (
      <span>
        {path.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <span style={{ color: '#999', margin: '0 4px' }}>/</span>
            )}
            <span
              style={{
                color: index === path.length - 1 ? '#1890ff' : '#333',
                fontWeight: index === path.length - 1 ? '600' : 'normal'
              }}
            >
              {item.label}
            </span>
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <Cascader
      options={transformOptions(options || [])}
      value={value}
      onChange={handleChange}
      expandTrigger="hover"
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      style={style}
      changeOnSelect
      displayRender={renderDisplay}
      onClick={onClick}
    />
  );
}
