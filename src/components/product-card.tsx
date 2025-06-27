import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  hideImage?: boolean;
}

export function ProductCard({ product, hideImage }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <article className="modern-card group flex flex-col h-full hover-lift animate-fade-in focus-ring-enhanced">
        {/* Image */}
        {!hideImage && (
          <div className="aspect-square overflow-hidden relative bg-background-tertiary">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Hover Icon */}
            <div className="absolute top-4 right-4 bg-primary/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 backdrop-blur">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
        )}
        {/* Content */}
        <div className="flex flex-col flex-1" style={{ padding: 'var(--card-padding)' }}>
          <h3 className="text-heading text-foreground mb-4 line-clamp-1">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="mt-auto">
            <span className="text-price">
              ${product.price.toFixed(2)} USD
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
} 