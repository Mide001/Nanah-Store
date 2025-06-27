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
    <div className="min-h-screen bg-background text-foreground page-transition">
      {/* Modern Header */}
      <header className="header-blur animate-slide-in-right sticky top-0 z-40">
        <div className="container-modern py-4 lg:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center">
              <h1 className="text-brand hover-scale interactive text-lg sm:text-xl lg:text-2xl">NANAH STORE</h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a href="#" className="text-foreground-secondary hover:text-foreground transition-all duration-200 interactive text-sm">All</a>
              <a href="#" className="text-foreground-secondary hover:text-foreground transition-all duration-200 interactive text-sm">Shirts</a>
              <a href="#" className="text-foreground-secondary hover:text-foreground transition-all duration-200 interactive text-sm">Stickers</a>
            </nav>
            
            {/* Search and Cart */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden md:block search-input">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-32 md:w-40 lg:w-48 xl:w-56 h-9 pl-8 pr-3 bg-transparent border-0 rounded-lg text-foreground placeholder-foreground-muted focus:outline-none text-sm"
                />
                <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              
              <button
                className="relative flex items-center text-foreground-secondary hover:text-foreground focus:outline-none transition-all duration-200 interactive hover-scale p-2 rounded-lg"
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartItems.length > 0 && (
                  <span className="cart-badge absolute -top-0.5 -right-0.5 bg-primary text-white rounded-full text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium animate-scale-in">{cartItems.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="section-spacing">
        <div className="container-modern">
          {/* Category Filter */}
          <div className="flex items-center gap-6 mb-12 animate-fade-in">
            <div className="flex items-center space-x-8">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-body font-medium transition-all duration-200 interactive hover-scale animate-slide-in-right category-btn ${
                    selectedCategory === category
                      ? 'text-foreground active'
                      : 'text-foreground-secondary hover:text-foreground'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mb-6 animate-fade-in">
            <div className="relative search-input">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-8 pr-3 bg-transparent border-0 rounded-lg text-body text-foreground placeholder-foreground-muted focus:outline-none text-sm"
              />
              <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid-modern grid-cols-4 animate-stagger">
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-20 animate-fade-in">
                <div className="text-heading text-foreground-muted mb-3">No products found</div>
                <div className="text-body text-foreground-subtle">Try adjusting your search or filter criteria</div>
              </div>
            )}
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
