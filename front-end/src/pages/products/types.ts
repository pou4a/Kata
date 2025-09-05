export interface Product {
    id: number;
    name: string;
    price: number;
}

export interface ProductListProps {
    onAdd: (productId: number) => void;
}
