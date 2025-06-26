export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  estimatedDays: number;
  colors: string[];
  sizes: string[];
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Crochet Tote Bag',
    description: 'A beautiful, handcrafted crochet tote bag. Perfect for everyday use or as a stylish accessory.',
    images: ['/products/item1.0.JPG', '/products/item1.1.JPG'],
    price: 45.00,
    category: 'Bags',
    estimatedDays: 10,
    colors: ['Red', 'Blue', 'Green'],
    sizes: ['Small', 'Medium', 'Large'],
  },
  {
    id: '2',
    name: 'Crochet Plush Toy',
    description: 'Adorable, custom-made crochet plush toy. A perfect gift for loved ones or a cute decor piece.',
    images: ['/products/item2.0.JPG', '/products/item2.1.JPG'],
    price: 30.00,
    category: 'Toys',
    estimatedDays: 20,
    colors: ['Yellow', 'Pink', 'White'],
    sizes: ['Small', 'Large'],
  },
]; 