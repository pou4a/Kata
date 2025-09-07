export type ID = string | number;

export type ProductListProps = {
    products: Product[];
    onAdd: (productId: ID) => void;
};

export type Offer = {
    id: number | string;
    quantity: number;
    totalPrice: number;
};

export type Product = {
    id: number | string;
    name: string;
    price: number;
    offers?: Offer[];
};

export type CreateProductDto = {
    name: string;
    price: number;
};

export type OfferInput = {
    quantity: number;
    totalPrice: number;
};

export type AddProductProps = {
    onCreated?: (product: Product) => void;
};
