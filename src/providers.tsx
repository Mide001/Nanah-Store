"use client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getConfig } from "./wagmi";
import { ReactNode, createContext, useContext, useState } from "react";

const queryClient = new QueryClient();
const config = getConfig();

// Database Product type
interface DatabaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  productionDays: number;
  createdAt: string;
  updatedAt: string;
}

interface CartItem extends DatabaseProduct {
  color: string;
  size: string;
  customMessage?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: DatabaseProduct,
    options: { color: string; size: string; customMessage?: string }
  ) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: DatabaseProduct,
    options: { color: string; size: string; customMessage?: string }
  ) => {
    setCartItems((prev) =>
      prev.find((item) => item.id === product.id)
        ? prev
        : [...prev, { ...product, ...options }]
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>{children}</CartProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
