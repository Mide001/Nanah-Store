"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingBag, Users, DollarSign, LogOut } from "lucide-react";
import { AdminLogin } from "../../components/admin/admin-login";
import { OrdersManagement } from "../../components/admin/orders-management";
import { ProductsManagement } from "../../components/admin/products-management";
import { StoreSettings } from "../../components/admin/store-settings";

// Database Order type
interface DatabaseOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentTxHash?: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      category: string;
    };
  }>;
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

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "settings">("orders");
  const [orders, setOrders] = useState<DatabaseOrder[]>([]);
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch orders from database
      const ordersResponse = await fetch('/api/orders');
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        
        const totalRevenue = ordersData.reduce((sum: number, order: DatabaseOrder) => 
          order.status !== "CANCELLED" ? sum + order.totalAmount : sum, 0
        );
        const pendingOrders = ordersData.filter((order: DatabaseOrder) => 
          order.status === "PENDING"
        ).length;

        setStats(prev => ({
          totalOrders: ordersData.length,
          totalRevenue,
          pendingOrders,
          totalProducts: prev.totalProducts,
        }));
      }

      // Fetch products from database
      const productsResponse = await fetch('/api/products');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setStats(prev => ({ ...prev, totalProducts: productsData.length }));
      }

      // Fetch store settings
      const settingsResponse = await fetch('/api/store-settings');
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setStoreSettings(settingsData);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if admin is authenticated
  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    if (adminToken) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, [loadData]);

  const handleLogin = (token: string) => {
    localStorage.setItem("admin-token", token);
    setIsAuthenticated(true);
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setIsAuthenticated(false);
    router.push("/admin");
  };

  const updateOrderStatus = async (orderId: string, newStatus: DatabaseOrder["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Reload data to get updated stats
        loadData();
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const addProduct = async (product: Omit<DatabaseProduct, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        loadData(); // Reload data
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const updateProduct = async (productId: string, updatedProduct: Partial<DatabaseProduct>) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        loadData(); // Reload data
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadData(); // Reload data
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const updateStoreSettings = async (settings: Partial<StoreSettings>) => {
    try {
      const response = await fetch('/api/store-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const updatedSettings = await response.json();
        setStoreSettings(updatedSettings);
      }
    } catch (error) {
      console.error("Failed to update store settings:", error);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {storeSettings?.storeName || "Nanah Store"} Admin
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 px-3 sm:px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "orders"
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "products"
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "settings"
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          <div className="p-3 sm:p-6">
            {activeTab === "orders" ? (
              <OrdersManagement 
                orders={orders} 
                onUpdateStatus={updateOrderStatus}
              />
            ) : activeTab === "products" ? (
              <ProductsManagement 
                products={products}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
              />
            ) : (
              <StoreSettings 
                settings={storeSettings}
                onUpdateSettings={updateStoreSettings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 