export type OfferLite = { quantity: number; totalPrice: number };

export interface QuoteItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  composition: {
    offers: { quantity: number; totalPrice: number; count: number }[];
    singles: number;
  };
}

export interface QuoteResponse {
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  total: number;
}
