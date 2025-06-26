import { useCart } from "../providers";
import Image from "next/image";
import { X, Trash2 } from "lucide-react";

// CartItem type for proper typing
interface CartItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  color: string;
  size: string;
  customMessage?: string;
}

export function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={onClose}
          aria-label="Close cart"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-gray-500 text-center py-12">Your cart is empty.</div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="max-h-64 overflow-y-auto flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 border-b pb-3 last:border-b-0">
                  <div className="relative w-16 h-16 rounded overflow-hidden border flex-shrink-0">
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-pink-500 font-mono">${item.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>Color: <span className="font-medium">{item.color}</span></div>
                      <div>Size: <span className="font-medium">{item.size}</span></div>
                      {item.customMessage && (
                        <div className="mt-1">
                          <div className="text-xs text-gray-500">Message for Nanah:</div>
                          <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded mt-1">
                            "{item.customMessage}"
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-pink-500 focus:outline-none flex-shrink-0"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="font-semibold text-lg">Total:</span>
              <span className="text-pink-600 font-bold text-xl">${total.toFixed(2)}</span>
            </div>
            <button
              className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg text-lg transition-all"
              onClick={() => {
                clearCart();
                onClose();
                alert('Thank you for your purchase! (Checkout placeholder)');
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 