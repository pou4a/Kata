export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export type QuoteCompositionOffer = {
    quantity: number;
    totalPrice: number;
    count: number;
};
export type QuoteItem = {
    productId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discount: number;
    total: number;
    composition: { offers: QuoteCompositionOffer[]; singles: number };
};
export type QuoteResponse = {
    items: QuoteItem[];
    subtotal: number;
    discount: number;
    total: number;
};

export interface CheckoutCartProps {
    cart: CartItem[];
    onUpdateQuantity: (id: number, quantity: number) => void;
    onClearCart: () => void;
}
