import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { convertGoogleDriveUrl } from "@/lib/utils";

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

interface ProductCardProps {
  product: DatabaseProduct;
  hideImage?: boolean;
}

export function ProductCard({ product, hideImage }: ProductCardProps) {
  const router = useRouter();
  const imageUrl = product.images[0] ? convertGoogleDriveUrl(product.images[0]) : '/placeholder-image.jpg';

  return (
    <div className="group mobile-card hover:border-secondary transition-mobile flex flex-col h-full cursor-pointer">
      <Link href={`/products/${product.id}`} className="block h-full" tabIndex={-1}>
        {!hideImage && (
          <div className="aspect-square overflow-hidden relative">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        )}
        <div className="p-2.5 sm:p-3 md:p-4 flex flex-col flex-1">
          <h3 className="font-medium text-primary-foreground mb-1 sm:mb-2 text-responsive-sm md:text-lg truncate overflow-hidden">
            {product.name}
          </h3>
          <p className="text-secondary/70 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between mt-auto p-2.5 sm:p-3 pt-0">
        <span className="text-responsive-base md:text-xl font-bold text-secondary">
          ${product.price.toFixed(2)}
        </span>
        <button
          type="button"
          className="flex items-center gap-1.5 sm:gap-2 bg-pink-500 text-white hover:bg-pink-600 px-2.5 sm:px-3 md:px-4 py-2 text-responsive-xs md:text-base rounded transition-all touch-manipulation mobile-button"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Customize & Order</span>
        </button>
      </div>
    </div>
  );
} 