import { useEffect, useState } from "react";
import CheckoutCart from "./checkout/CheckoutCart";
import ProductList from "./products/List";
import AddProduct from "./products/Add";
import { CartItem } from "./checkout/types";
import api from "../api/axios";
import { Product, ID } from "./products/types";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const load = async () => {
            const { data } = await api.get<Product[]>("/products");
            setProducts(data);
        };
        load();
    }, []);

    const handleAdd = (productId: ID) => {
        const p = products.find((x) => String(x.id) === String(productId));
        if (!p) return;

        setCart((prev) => {
            const existing = prev.find((i) => String(i.id) === String(p.id));
            if (existing) {
                return prev.map((i) =>
                    String(i.id) === String(p.id)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [
                ...prev,
                { id: p.id as any, name: p.name, price: p.price, quantity: 1 },
            ];
        });
    };

    const handleUpdateQuantity = (id: ID, quantity: number) => {
        setCart((prev) =>
            prev.map((i) =>
                String(i.id) === String(id) ? { ...i, quantity } : i
            )
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="mb-6 text-2xl font-bold">Kata Checkout</h1>

            <div className="mb-6">
                <AddProduct
                    onCreated={(p) => {
                        setProducts((prev) => [p, ...prev]);
                    }}
                />
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <ProductList products={products} onAdd={handleAdd} />
                </div>

                <CheckoutCart
                    cart={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onClearCart={() => setCart([])}
                />
            </div>
        </div>
    );
}
