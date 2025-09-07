import { useState, FormEvent } from "react";
import api from "../../api/axios";
import {
    AddProductProps,
    CreateProductDto,
    OfferInput,
    Product,
} from "./types";

export default function AddProduct({ onCreated }: AddProductProps) {
    const [form, setForm] = useState<CreateProductDto>({ name: "", price: 0 });
    const [offers, setOffers] = useState<OfferInput[]>([]);
    const [addOffers, setAddOffers] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addOfferRow = () =>
        setOffers((prev) => [...prev, { quantity: 2, totalPrice: 0 }]);

    const removeOfferRow = (idx: number) =>
        setOffers((prev) => prev.filter((_, i) => i !== idx));

    const updateOffer = (idx: number, patch: Partial<OfferInput>) =>
        setOffers((prev) =>
            prev.map((o, i) => (i === idx ? { ...o, ...patch } : o))
        );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.name.trim()) return setError("Name is required");
        if (isNaN(form.price) || form.price <= 0)
            return setError("Price must be a positive number");

        if (addOffers) {
            for (let i = 0; i < offers.length; i++) {
                const o = offers[i];
                if (!o.quantity || o.quantity < 1) {
                    setError(`Offer #${i + 1}: quantity must be ≥ 1`);
                    return;
                }
                if (!Number.isFinite(o.totalPrice) || o.totalPrice <= 0) {
                    setError(`Offer #${i + 1}: total price must be > 0`);
                    return;
                }
            }
        }

        try {
            setLoading(true);

            const { data: product } = await api.post<Product>("/products", {
                name: form.name.trim(),
                price: Number(form.price),
            } as CreateProductDto);

            if (addOffers && offers.length) {
                const payloads = offers
                    .filter((o) => o.quantity > 0 && o.totalPrice > 0)
                    .map((o) => ({
                        productId: Number(product.id),
                        quantity: Math.floor(o.quantity),
                        totalPrice: Math.floor(o.totalPrice),
                    }));

                if (payloads.length) {
                    await Promise.all(
                        payloads.map((p) => api.post("/offers", p))
                    );
                }
            }

            setForm({ name: "", price: 0 });
            setOffers([]);
            setAddOffers(false);

            onCreated?.(product);
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ??
                err?.message ??
                "Failed to create";
            setError(Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border p-4 shadow"
        >
            <h2 className="text-lg font-semibold">Add Product</h2>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Coffee Beans"
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="price">
                    Price (€)
                </label>
                <input
                    id="price"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                        setForm((f) => ({
                            ...f,
                            price: Number(e.target.value),
                        }))
                    }
                    placeholder="e.g. 24.99"
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                />
            </div>

            <div className="flex items-center gap-2 pt-2">
                <input
                    id="toggle-offers"
                    type="checkbox"
                    checked={addOffers}
                    onChange={(e) => setAddOffers(e.target.checked)}
                    className="h-4 w-4"
                />
                <label htmlFor="toggle-offers" className="text-sm">
                    Add special offers (e.g., “2 for 45”)
                </label>
            </div>

            {addOffers && (
                <div className="rounded-lg border bg-gray-50 p-3">
                    <div className="mb-2 text-sm font-medium">Offers</div>

                    <div className="space-y-3">
                        {offers.map((o, idx) => (
                            <div key={idx} className="flex items-end gap-3">
                                <div className="flex-1">
                                    <label className="text-xs font-medium block mb-1">
                                        Quantity (units)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        step={1}
                                        value={o.quantity}
                                        onChange={(e) =>
                                            updateOffer(idx, {
                                                quantity: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                                        placeholder="e.g. 2"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-medium block mb-1">
                                        Total Price (EUR)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        step={1}
                                        value={o.totalPrice}
                                        onChange={(e) =>
                                            updateOffer(idx, {
                                                totalPrice: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                                        placeholder="e.g. 45"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="h-9 rounded-lg border px-3 text-sm"
                                    onClick={() => removeOfferRow(idx)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white"
                            onClick={addOfferRow}
                        >
                            + Add Offer
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading ? "Saving..." : "Add"}
            </button>
        </form>
    );
}
