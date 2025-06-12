import {
  headerContainer,
  headerTitle,
  headerContent
} from '../Features/index.css';

interface IProps {
  title: string;
  content: string;
}

export function Header({ title, content }: IProps) {
  return (
    <div className={headerContainer}>
      <p className={headerTitle}>{title}</p>
      <p className={headerContent}>{content}</p>
    </div>
  );
}
