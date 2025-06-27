import { useCart } from "../app/providers";
import Image from "next/image";
import { X, Trash2 } from "lucide-react";

export function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-strong animate-fade-in">
      <div className="glass-card shadow-2xl w-full max-w-md relative animate-scale-in" style={{ padding: 'var(--card-padding)' }}>
        <button
          className="absolute top-4 right-4 text-foreground-muted hover:text-foreground focus:outline-none transition-all duration-200 interactive hover-scale"
          onClick={onClose}
          aria-label="Close cart"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-brand text-center mb-8">Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-foreground-muted text-center py-20">
            <div className="text-heading mb-3">Your cart is empty</div>
            <div className="text-body text-foreground-subtle">Add some items to get started</div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="max-h-72 overflow-y-auto space-y-4">
              {cartItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-4 border-b border-border pb-4 last:border-b-0 animate-fade-in-up" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-background-tertiary hover-scale">
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-subheading text-foreground mb-2">{item.name}</div>
                    <div className="text-price mb-3">${item.price.toFixed(2)} USD</div>
                    <div className="text-body-sm text-foreground-secondary space-y-1">
                      <div>Color: <span className="font-medium text-foreground">{item.color}</span></div>
                      <div>Size: <span className="font-medium text-foreground">{item.size}</span></div>
                      {item.customMessage && (
                        <div className="mt-3">
                          <div className="text-caption text-foreground-muted mb-1">Message for Nanah:</div>
                          <div className="text-body-sm text-foreground bg-background-tertiary p-2 rounded-lg border border-border">
                            "{item.customMessage}"
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-foreground-muted hover:text-error focus:outline-none flex-shrink-0 transition-all duration-200 interactive hover-scale"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-border">
              <span className="text-heading text-foreground">Total:</span>
              <span className="text-price-large">${total.toFixed(2)} USD</span>
            </div>
            <button
              className="btn-primary w-full text-body font-medium"
              style={{ padding: 'var(--button-padding-y) var(--button-padding-x)' }}
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