"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X, Save, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  estimatedDays: number;
}

interface ProductsManagementProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, "id">) => void;
  onUpdateProduct: (productId: string, product: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductsManagement({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}: ProductsManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    images: string[];
    colors: string[];
    sizes: string[];
    estimatedDays: string;
  }>({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [""],
    colors: [""],
    sizes: [""],
    estimatedDays: "",
  });

  const handleAddProduct = () => {
    const newProduct = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      images: formData.images.filter((img: string) => img.trim() !== ""),
      colors: formData.colors.filter((color: string) => color.trim() !== ""),
      sizes: formData.sizes.filter((size: string) => size.trim() !== ""),
      estimatedDays: parseInt(formData.estimatedDays),
    };

    onAddProduct(newProduct);
    resetForm();
    setShowAddForm(false);
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    const updatedProduct = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      images: formData.images.filter((img: string) => img.trim() !== ""),
      colors: formData.colors.filter((color: string) => color.trim() !== ""),
      sizes: formData.sizes.filter((size: string) => size.trim() !== ""),
      estimatedDays: parseInt(formData.estimatedDays),
    };

    onUpdateProduct(editingProduct.id, updatedProduct);
    resetForm();
    setEditingProduct(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      images: [...product.images, ""],
      colors: [...product.colors, ""],
      sizes: [...product.sizes, ""],
      estimatedDays: product.estimatedDays.toString(),
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      images: [""],
      colors: [""],
      sizes: [""],
      estimatedDays: "",
    });
  };

  const addArrayItem = (field: "images" | "colors" | "sizes") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const updateArrayItem = (field: "images" | "colors" | "sizes", index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field: "images" | "colors" | "sizes", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Products ({products.length})</h2>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              {product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-pink-600">${product.price.toFixed(2)}</span>
              <span className="text-xs text-gray-500">{product.category}</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(product)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              >
                <Edit className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddForm || editingProduct) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Days
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedDays: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URLs
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => updateArrayItem("images", index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("images", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("images")}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  + Add Image URL
                </button>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Colors
                </label>
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => updateArrayItem("colors", index, e.target.value)}
                      placeholder="Red, Blue, etc."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900"
                    />
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("colors", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("colors")}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  + Add Color
                </button>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Sizes
                </label>
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => updateArrayItem("sizes", index, e.target.value)}
                      placeholder="Small, Medium, etc."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900"
                    />
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("sizes", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("sizes")}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  + Add Size
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={editingProduct ? handleEditProduct : handleAddProduct}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  <Save className="h-4 w-4" />
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 