"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "../components/product-card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../providers";
import { PaymentModal } from "@/components/payment-modal";

interface PaymentResult {
  success: boolean;
  error?: string;
  email?: string;
  address?: string;
  name?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  customMessage?: string;
}

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

// Store Settings type
interface StoreSettings {
  id: string;
  storeName: string;
  description: string;
  updatedAt: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { cartItems, clearCart } = useCart();

  // Fetch products and store settings from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        } else {
          console.error('Failed to fetch products');
        }

        // Fetch store settings
        const settingsResponse = await fetch('/api/store-settings');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setStoreSettings(settingsData);
        } else {
          console.error('Failed to fetch store settings');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price, 0);

  const handlePaymentSuccess = (result: PaymentResult) => {
    setShowPaymentModal(false);
    if (result.success) {
      clearCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Small Header with Context */}
      <div className="bg-gray-100 text-gray-700 py-2 px-3 sm:px-4 text-center">
        <span className="text-xs sm:text-sm font-medium leading-tight">
          {storeSettings?.description || "Nanah Store: Unique, handcrafted crochet items"}
        </span>
      </div>

      {/* Main Header */}
      <header className="border-b border-gray-200 p-3 sm:p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 sm:gap-0">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold">
              {storeSettings?.storeName || "Nanah Store"}
            </h1>
          </div>
          <button
            className="relative flex items-center gap-1 sm:gap-2 text-pink-500 hover:text-pink-600 focus:outline-none p-2 rounded-lg hover:bg-pink-50 transition-colors"
            onClick={() => setShowPaymentModal(true)}
            aria-label="Checkout"
            disabled={cartItems.length === 0}
          >
            <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-pink-500 text-white rounded-full text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto p-responsive">
        <div className="flex flex-col sm:flex-row gap-responsive mb-6 sm:mb-8">
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 sm:h-10 pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-400 text-responsive-sm mobile-input"
            />
          </div>
          <div className="flex items-center h-11 sm:h-10">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 sm:h-10 w-full sm:w-28 px-3 sm:px-2 text-responsive-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-pink-400 mobile-input"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid - Optimized for mobile */}
        <div className="grid-mobile">
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-400 col-span-full py-8 sm:py-12">
              <p className="text-responsive-sm">
                {products.length === 0 ? "No products available." : "No products found."}
              </p>
            </div>
          )}
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        cartItems={cartItems}
        total={total}
      />
    </div>
  );
}
