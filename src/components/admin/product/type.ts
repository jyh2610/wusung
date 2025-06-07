export interface IRegProduct {
  name: string;
  periodMonths: number;
  price: number;
  description: string;
  discountRate: number;
  active: boolean;
}

export interface IProduct {
  productId: number;
  name: string;
  periodMonths: number;
  currentPrice: number;
  active: boolean;
}
