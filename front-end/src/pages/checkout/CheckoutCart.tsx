import { useEffect, useState } from "react";
import api from "../../api/axios";
import { CheckoutCartProps, QuoteResponse } from "./types";

const EUR = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
});

export default function CheckoutCart({
    cart,
    onUpdateQuantity,
    onClearCart,
}: CheckoutCartProps) {
    const [quote, setQuote] = useState<QuoteResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subtotalLocal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    useEffect(() => {
        setQuote(null);
        setError(null);
    }, [cart]);

    const handleCheckout = async () => {
        setError(null);
        setLoading(true);
        try {
            const items = cart.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            }));
            const { data } = await api.post<QuoteResponse>("/checkout", {
                items,
            });
            setQuote(data);
        } catch (e: any) {
            const msg =
                e?.response?.data?.message ??
                e?.message ??
                "Failed to get quote";
            setError(Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = () => {
        alert("Payment flow is not implemented yet.");
    };

    return (
        <div className="bg-gray-100 p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-3">Cart</h2>

            {cart.length === 0 && (
                <p className="text-gray-500">Your cart is empty</p>
            )}

            {cart.map((item) => {
                const line = item.price * item.quantity;
                return (
                    <div
                        key={item.id}
                        className="mb-3 rounded-lg border bg-white p-3"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-600">
                                    {EUR.format(item.price)} × {item.quantity} ={" "}
                                    <span className="font-medium">
                                        {EUR.format(line)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button
                                    className="px-2 bg-gray-300 rounded disabled:opacity-50"
                                    onClick={() =>
                                        onUpdateQuantity(
                                            item.id,
                                            item.quantity - 1
                                        )
                                    }
                                    disabled={item.quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="px-3">{item.quantity}</span>
                                <button
                                    className="px-2 bg-gray-300 rounded"
                                    onClick={() =>
                                        onUpdateQuantity(
                                            item.id,
                                            item.quantity + 1
                                        )
                                    }
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {quote?.items &&
                            (() => {
                                const q = quote.items.find(
                                    (x) => x.productId === item.id
                                );
                                if (!q) return null;
                                return (
                                    <div className="mt-2 rounded-md bg-gray-50 p-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Line subtotal
                                            </span>
                                            <span>
                                                {EUR.format(q.subtotal)}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex justify-between">
                                            <span className="text-gray-600">
                                                Discount
                                            </span>
                                            <span className="text-green-700">
                                                - {EUR.format(q.discount)}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex justify-between font-medium">
                                            <span>Line total</span>
                                            <span>{EUR.format(q.total)}</span>
                                        </div>

                                        {q.composition?.offers?.length ||
                                        q.composition?.singles ? (
                                            <div className="mt-2 text-gray-600">
                                                <span className="text-xs uppercase tracking-wide">
                                                    Applied:
                                                </span>{" "}
                                                <span className="text-xs">
                                                    {[
                                                        ...(
                                                            q.composition
                                                                .offers ?? []
                                                        ).map(
                                                            (o) =>
                                                                `${o.count}× (${
                                                                    o.quantity
                                                                } for ${EUR.format(
                                                                    o.totalPrice
                                                                )})`
                                                        ),
                                                        q.composition.singles
                                                            ? `${q.composition.singles}× single`
                                                            : null,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" + ")}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })()}
                    </div>
                );
            })}

            {error && (
                <div className="mt-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            {cart.length > 0 && (
                <div className="mt-4 space-y-3">
                    {quote ? (
                        <>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{EUR.format(quote.subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Discount</span>
                                <span className="text-green-700">
                                    - {EUR.format(quote.discount)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-lg">
                                <span className="font-semibold">
                                    Final Total
                                </span>
                                <span className="font-bold">
                                    {EUR.format(quote.total)}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handlePay}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
                                >
                                    Pay
                                </button>
                                <button
                                    onClick={onClearCart}
                                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between text-lg">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold">
                                    {EUR.format(subtotalLocal)}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="flex-1 bg-green-500 text-white py-2 rounded-lg disabled:opacity-50"
                                >
                                    {loading ? "Calculating..." : "Checkout"}
                                </button>
                                <button
                                    onClick={onClearCart}
                                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
