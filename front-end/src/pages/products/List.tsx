import { ProductListProps } from "./types";

const EUR = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
});

export default function ProductList({ products, onAdd }: ProductListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((p) => (
                <div
                    key={String(p.id)}
                    className="rounded-xl border p-4 shadow hover:shadow-lg transition"
                >
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-gray-600">
                        {EUR.format(p.price)} / unit
                    </p>

                    {p.offers?.length ? (
                        <div className="mt-3 space-y-2">
                            <div className="text-sm font-medium">Offers</div>
                            <ul className="space-y-2">
                                {p.offers.map((o) => {
                                    const baseTotal = p.price * o.quantity;
                                    const savings = Math.max(
                                        0,
                                        baseTotal - o.totalPrice
                                    );

                                    return (
                                        <li
                                            key={String(
                                                o.id ??
                                                    `${p.id}-${o.quantity}-${o.totalPrice}`
                                            )}
                                            className="overflow-hidden rounded-lg border bg-gray-50 p-3"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] sm:items-center gap-2">
                                                <div className="min-w-0 text-sm leading-snug">
                                                    <span className="font-medium">
                                                        {o.quantity} for{" "}
                                                        {EUR.format(
                                                            o.totalPrice
                                                        )}
                                                    </span>
                                                    {savings > 0 && (
                                                        <span className="ml-2 items-center justify-center whitespace-nowrap rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                                                            save{" "}
                                                            {EUR.format(
                                                                savings
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : null}

                    <button
                        className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
                        onClick={() => onAdd(p.id)}
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
}
