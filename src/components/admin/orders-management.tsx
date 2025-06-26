"use client";

import { useState } from "react";
import { Eye, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    color: string;
    size: string;
    customMessage?: string;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  paymentId: string;
}

interface OrdersManagementProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

export function OrdersManagement({ orders, onUpdateStatus }: OrdersManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-500">Orders will appear here once customers make purchases.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Orders ({orders.length})</h2>
        <p className="text-sm text-gray-500">Manage customer orders and update their status</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-pink-600 hover:text-pink-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as Order["status"])}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{selectedOrder.id.slice(-6)}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedOrder.customerName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedOrder.customerEmail}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Address:</span> {selectedOrder.customerAddress}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <div className="mt-1 text-sm text-gray-600">
                              <span>Color: {item.color}</span>
                              <span className="mx-2">•</span>
                              <span>Size: {item.size}</span>
                            </div>
                            {item.customMessage && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium text-gray-700">Message:</span>
                                <p className="text-gray-600 italic">"{item.customMessage}"</p>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">${item.price.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Payment ID: {selectedOrder.paymentId}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Order Date: {formatDate(selectedOrder.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 