'use client';

import { liBox, text, selectedText } from './listComponent.css';

interface ListItem {
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onClick: React.Dispatch<React.SetStateAction<string>>;
}

export const ListComponent = ({
  icon,
  label,
  isSelected,
  onClick
}: ListItem) => {
  return (
    <li onClick={() => onClick(label)} className={liBox}>
      {icon}
      <span className={isSelected ? selectedText : text}>{label}</span>
    </li>
  );
};
