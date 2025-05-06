export const calculateDiscount = ({
  amount,
  rate
}: {
  amount: number;
  rate: number;
}) => {
  return Math.round(amount * (1 - rate / 100));
};
