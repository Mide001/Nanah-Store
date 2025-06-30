# Nanah Store

A modern, responsive e-commerce platform for handcrafted crochet items. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **Product Catalog**: Browse beautiful handcrafted crochet items
- 🔍 **Search & Filter**: Find products by name, description, or category
- 🎨 **Customization**: Select colors, sizes, and add custom messages
- 🛒 **Shopping Cart**: Add items with custom options and manage cart
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- ⚡ **Fast Performance**: Built with Next.js 15 for optimal speed
- 🎯 **Made-to-Order**: Specialized for custom crochet orders
- 🔐 **Secure Admin Panel**: Protected admin dashboard for store management

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React
- **Database**: MongoDB with Prisma ORM
- **Web3**: Wagmi (for future blockchain integration)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="your-mongodb-atlas-connection-string"

# Admin Authentication
ADMIN_USERNAME="your-admin-username"
ADMIN_PASSWORD="your-secure-admin-password"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Admin Authentication Setup

1. Set secure `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your environment variables
2. Access the admin panel at `/admin`
3. Use your configured credentials to log in
4. Never commit credentials to version control

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Mide001/Nanah-Store.git
cd Nanah-Store
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see above)

4. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Homepage with product grid
│   ├── providers.tsx   # Cart context provider
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   └── products/       # Product detail pages
├── components/         # Reusable UI components
├── data/              # Product data and types
└── styles/            # Custom CSS styles
```

## Features in Detail

### Product Customization
- Visual color swatches for easy selection
- Size options for each product
- Optional custom messages for the artisan
- Made-to-order workflow

### Shopping Experience
- Global cart state management
- Cart modal with item details
- Search and category filtering
- Responsive product grid

### Admin Dashboard
- Secure authentication system
- Product management (add, edit, delete)
- Order management and status updates
- Store settings configuration
- Mobile-optimized interface

## Contributing

This is a personal project for Nanah's crochet store. For questions or support, please contact the repository owner.

## License

Private project - All rights reserved.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
