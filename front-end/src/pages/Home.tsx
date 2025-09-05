import { useState } from "react";
import CheckoutCart from "./checkout/CheckoutCart";
import ProductList from "./products/List";
import { CartItem } from "./checkout/types";

export default function Home() {
    const [cart, setCart] = useState<CartItem[]>([]);

    const handleAdd = (productId: number) => {
        // This is just for demo; in a real app, fetch product info
        setCart((prev) => {
            const existing = prev.find((i) => i.id === productId);
            if (existing) {
                return prev.map((i) =>
                    i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [
                ...prev,
                {
                    id: productId,
                    name: `Product ${productId}`,
                    price: 0,
                    quantity: 1,
                },
            ];
        });
    };

    const handleUpdateQuantity = (id: number, quantity: number) => {
        setCart((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Kata Checkout</h1>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <ProductList onAdd={handleAdd} />
                </div>
                <CheckoutCart
                    cart={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                />
            </div>
        </div>
    );
}
