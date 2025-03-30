import { benefit } from '../../const';
import {
  cardContainer,
  cardContent,
  cardHeader,
  warning,
  container
} from './index.css';

interface IProps {
  title: keyof typeof benefit;
  content: string;
}

export function Benefit() {
  const benefitList = Object.keys(benefit) as Array<keyof typeof benefit>;
  return (
    <div className={container}>
      {benefitList.map(item => (
        <BenefitCard key={item} title={item} content={benefit[item]} />
      ))}
    </div>
  );
}
function BenefitCard({ title, content }: IProps) {
  const cardTitle =
    title === 'benefit1'
      ? '혜택 1'
      : title === 'benefit2'
        ? '혜택 2'
        : '혜택 3';

  return (
    <div className={cardContainer}>
      <div className={cardHeader}>
        <span>{cardTitle}</span>
      </div>
      <div className={cardContent}>
        <pre>{content}</pre>
        {cardTitle === '혜택 3' && (
          <span className={warning}>
            ※ 현금영수증은 입금 당일만 발급 가능해요.
          </span>
        )}
      </div>
    </div>
  );
}
