import { colors } from '@/design-tokens';
import { filterOptions, PaymentFilter } from '../const';
import { paymentBtn, selectedPaymentBtn } from './paymentHistory.css';
import { VerticalLine } from '@/shared/ui/VerticalLine';

interface Props {
  selected: PaymentFilter;
  onSelect: (filter: PaymentFilter) => void;
}
export const FilterBar = ({ selected, onSelect }: Props) => {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      {filterOptions.slice(0, -1).map(option => (
        <button
          key={option}
          className={`${paymentBtn} ${selected === option ? selectedPaymentBtn : ''}`}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
      <div style={{ margin: 'auto' }}>
        <VerticalLine
          height="48px"
          thickness="1px"
          color={colors.gray_scale['300']}
        />
      </div>
      <button
        className={`${paymentBtn} ${
          selected === filterOptions.at(-1) ? selectedPaymentBtn : ''
        }`}
        onClick={() => onSelect(filterOptions.at(-1)!)}
      >
        {filterOptions.at(-1)}
      </button>
    </div>
  );
};
