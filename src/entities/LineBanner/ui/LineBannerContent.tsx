'use client';

import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';
import {
  LineBannerContentStyles,
  contentStyles
} from './LineBannerContentStyles.css';

export function LineBannerContent({
  content,
  link
}: {
  content: string;
  link: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      router.push(link);
    }
  };

  return (
    <div className={LineBannerContentStyles} onClick={handleClick}>
      <span className={contentStyles}>
        {content}
        <FaArrowRight />
      </span>
    </div>
  );
}
