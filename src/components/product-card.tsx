import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "../data/products";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  hideImage?: boolean;
}

export function ProductCard({ product, hideImage }: ProductCardProps) {
  const router = useRouter();

  return (
    <div className="group bg-secondary/10 rounded-lg overflow-hidden border border-secondary/20 hover:border-secondary transition-all duration-200 flex flex-col h-full cursor-pointer">
      <Link href={`/products/${product.id}`} className="block h-full" tabIndex={-1}>
        {!hideImage && (
          <div className="aspect-square overflow-hidden relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <h3 className="font-medium text-primary-foreground mb-1 sm:mb-2 line-clamp-1 text-base sm:text-lg">
            {product.name}
          </h3>
          <p className="text-secondary/70 text-sm mb-2 sm:mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between mt-auto p-3 pt-0">
        <span className="text-lg sm:text-xl font-bold text-secondary">
          ${product.price.toFixed(2)}
        </span>
        <button
          type="button"
          className="flex items-center gap-2 bg-pink-500 text-white hover:bg-pink-600 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded transition-all"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden xs:inline">Customize & Order</span>
        </button>
      </div>
    </div>
  );
} 