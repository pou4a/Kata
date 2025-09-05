import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Product, ProductListProps } from "./types";

export default function ProductList({ onAdd }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        api.get("/products").then((res) => setProducts(res.data));
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
                <div
                    key={p.id}
                    className="border rounded-xl p-4 shadow hover:shadow-lg transition"
                >
                    <h3 className="font-bold">{p.name}</h3>
                    <p className="text-gray-600">{p.price} €</p>
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg mt-2"
                        onClick={() => onAdd(p.id)}
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
}
