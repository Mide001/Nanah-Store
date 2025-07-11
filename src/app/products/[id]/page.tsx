"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../../providers';
import { PaymentModal } from '@/components/payment-modal';
import { convertGoogleDriveUrl } from '@/lib/utils';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
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

// Color mapping for visual swatches
const colorMap: { [key: string]: string } = {
  'Red': '#ef4444',
  'Blue': '#3b82f6', 
  'Green': '#10b981',
  'Yellow': '#f59e0b',
  'Pink': '#ec4899',
  'White': '#ffffff',
  'Black': '#000000',
  'Purple': '#8b5cf6',
  'Orange': '#f97316',
  'Gray': '#6b7280',
};

// CartItem type for proper typing
interface CartItem {
  id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  customMessage?: string;
}

interface PaymentResult {
  success: boolean;
  error?: string;
  email?: string;
  address?: string;
  name?: string;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = React.use(params);
  const [product, setProduct] = useState<DatabaseProduct | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Move all hooks to the top before any conditional returns
  const [mainImg, setMainImg] = useState<string>("");
  const { cartItems, addToCart, clearCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");

  // Fetch product and store settings from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product
        const productResponse = await fetch(`/api/products/${id}`);
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProduct(productData);
          setMainImg(productData.images[0] ? convertGoogleDriveUrl(productData.images[0]) : "");
        } else if (productResponse.status === 404) {
          setError('Product not found');
        } else {
          setError('Failed to load product');
        }

        // Fetch store settings
        const settingsResponse = await fetch('/api/store-settings');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setStoreSettings(settingsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  const isInCart = cartItems.some((item: CartItem) => item.id === product.id);
  const canAddToCart = !isInCart && selectedColor && selectedSize;
  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price, 0);

  const handleAddToCart = () => {
    if (canAddToCart) {
      addToCart(product, {
        color: selectedColor,
        size: selectedSize,
        customMessage: customMessage.trim() || undefined
      });
    }
  };

  const handlePaymentSuccess = (result: PaymentResult) => {
    setShowPaymentModal(false);
    if (result.success) {
      clearCart();
    }
  };

  // Default colors and sizes since they're not in the database schema
  const defaultColors = ['Pink', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Red', 'White', 'Black', 'Gray'];
  const defaultSizes = ['Small', 'Medium', 'Large', 'X-Large'];

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
      <div className="py-6 sm:py-10 px-3 sm:px-4 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <Link href="/" className="text-pink-500 hover:underline mb-4 sm:mb-6 inline-block text-sm sm:text-base">&larr; Back to store</Link>
          <div className="flex flex-col md:flex-row gap-6 sm:gap-10 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            {/* Images */}
            <div className="flex flex-col gap-3 sm:gap-4 md:w-1/2">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                <Image 
                  src={mainImg || '/placeholder-image.jpg'} 
                  alt={product.name} 
                  fill 
                  className="object-cover" 
                  priority 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImg(convertGoogleDriveUrl(img))}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded border-2 flex-shrink-0 ${mainImg === convertGoogleDriveUrl(img) ? 'border-pink-500' : 'border-gray-200'} overflow-hidden focus:outline-none`}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <Image 
                        src={convertGoogleDriveUrl(img)} 
                        alt={product.name + ' thumbnail ' + (i + 1)} 
                        fill 
                        className="object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">{product.name}</h1>
                <div className="text-pink-500 font-semibold text-xl sm:text-2xl mb-2">${product.price.toFixed(2)}</div>
                <div className="text-gray-500 mb-2 text-sm sm:text-base">Category: <span className="font-medium text-gray-800">{product.category}</span></div>
                <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">{product.description}</p>
                <div className="mb-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    product.productionDays > 0 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.productionDays > 0 ? `In Production (${product.productionDays} days)` : "Out of Stock"}
                  </span>
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <label className="font-medium text-gray-700 text-sm sm:text-base">Select color:</label>
                  <div className="flex gap-2 flex-wrap items-center">
                    {defaultColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all hover:scale-110 touch-manipulation ${selectedColor === color ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-300'}`}
                        style={{ backgroundColor: colorMap[color] || color }}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                  {selectedColor && (
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      Selected: <span className="font-medium">{selectedColor}</span>
                    </div>
                  )}
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <label className="font-medium text-gray-700 text-sm sm:text-base">Select size:</label>
                  <div className="flex gap-2 flex-wrap">
                    {defaultSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded border text-xs sm:text-sm font-medium transition-colors touch-manipulation ${selectedSize === size ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-pink-50'}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6 flex flex-col gap-2">
                  <label className="font-medium text-gray-700 text-sm sm:text-base">
                    Custom message for Nanah (optional):
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Any special requests or messages for Nanah..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-400 resize-none text-sm sm:text-base"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {customMessage.length}/500 characters
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg text-base sm:text-lg font-semibold transition-all shadow-sm border-none focus:outline-none touch-manipulation ${
                  isInCart 
                    ? 'bg-green-100 text-green-600 cursor-not-allowed' 
                    : !canAddToCart
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
              >
                {isInCart ? (
                  <>
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    Added to Cart
                  </>
                ) : !canAddToCart ? (
                  'Select Color & Size'
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
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