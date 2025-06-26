"use client";

import { useState } from "react";
import { ProductCard } from "../components/product-card";
import { products as allProducts } from "../data/products";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./providers";
import { CartModal } from "../components/cart-modal";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems } = useCart();

  const categories = [
    "All",
    ...Array.from(new Set(allProducts.map((p) => p.category))),
  ];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Small Header with Context */}
      <div className="bg-gray-100 text-gray-700 py-2 px-4 text-center">
        <span className="text-sm font-medium">Nanah Store: Unique, handcrafted crochet items</span>
      </div>

      {/* Main Header */}
      <header className="border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold">Nanah Store</h1>
          </div>
          <button
            className="relative flex items-center gap-2 text-pink-500 hover:text-pink-600 focus:outline-none"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-7 w-7" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{cartItems.length}</span>
            )}
          </button>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-8">
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-400"
            />
          </div>
          <div className="flex items-center h-10">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 w-28 px-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-pink-400"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Simple Uniform Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-400 col-span-full py-12">No products found.</div>
          )}
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
