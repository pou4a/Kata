import api from "../../api/axios";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Props {
    cart: CartItem[];
    onUpdateQuantity: (id: number, quantity: number) => void;
}

export default function CheckoutCart({ cart, onUpdateQuantity }: Props) {
    const handleCheckout = async () => {
        const items = cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
        }));
        const res = await api.post("/checkout", { items });
        alert(`Total: €${res.data.total}`);
    };

    return (
        <div className="bg-gray-100 p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-3">Cart</h2>
            {cart.length === 0 && (
                <p className="text-gray-500">Your cart is empty</p>
            )}
            {cart.map((item) => (
                <div
                    key={item.id}
                    className="flex justify-between items-center mb-2"
                >
                    <span>{item.name}</span>
                    <div className="flex items-center">
                        <button
                            className="px-2 bg-gray-300 rounded"
                            onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                        >
                            -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                            className="px-2 bg-gray-300 rounded"
                            onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                            }
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
            {cart.length > 0 && (
                <button
                    onClick={handleCheckout}
                    className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg"
                >
                    Checkout
                </button>
            )}
        </div>
    );
}
