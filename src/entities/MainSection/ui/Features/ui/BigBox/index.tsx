import Image from 'next/image';
import { IFeatureContents } from '../../const';
import {
  bigBoxContainer,
  iconContainer,
  contentContainer,
  title,
  content,
  subContent
} from './index.css';

export function BigBox({ feature }: { feature: IFeatureContents }) {
  return (
    <div className={bigBoxContainer}>
      <div className={iconContainer}>
        <Image src={feature.image} alt="icon" fill />
      </div>
      <div className={contentContainer}>
        <p className={title}>{feature.title}</p>
        <div className={content}>{feature.content}</div>
        <div className={subContent}>{feature.subContent}</div>
      </div>
    </div>
  );
}
