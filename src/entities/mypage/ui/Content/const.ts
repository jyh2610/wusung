// payment/const/filter.ts

export const paymentFilters = {
  ALL: '전체',
  MONTH_3: '3개월',
  MONTH_6: '6개월',
  MONTH_12: '12개월',
  PAID_ONLY: '결제완료'
} as const;

export const filterOptions = [
  paymentFilters.ALL,
  paymentFilters.MONTH_3,
  paymentFilters.MONTH_6,
  paymentFilters.MONTH_12,
  paymentFilters.PAID_ONLY
] as const;

export type PaymentFilter = (typeof filterOptions)[number];
