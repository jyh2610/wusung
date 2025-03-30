import Image from 'next/image';
import { IFeatureContents } from '../../const';
import {
  smallBoxContainer,
  title,
  iconContainer,
  contentContainer,
  content
} from './index.css';

export function SmallBox({ feature }: { feature: IFeatureContents }) {
  return (
    <div className={smallBoxContainer}>
      <div className={iconContainer}>
        <Image src={feature.image} alt="icon" fill />
      </div>
      <div className={contentContainer}>
        <p className={title}>{feature.title}</p>
        <div className={content}>{feature.content}</div>
      </div>
    </div>
  );
}
