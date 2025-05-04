export interface Item {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export type PaymentStatus =
  | { status: 'IDLE' }
  | { status: 'PENDING' }
  | { status: 'FAILED'; message: string }
  | { status: 'PAID' };
