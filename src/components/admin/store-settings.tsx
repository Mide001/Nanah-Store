"use client";

import { useState, useEffect } from "react";
import { Save, Store, FileText } from "lucide-react";

interface StoreSettings {
  id: string;
  storeName: string;
  description: string;
  updatedAt: string;
}

interface StoreSettingsProps {
  settings: StoreSettings | null;
  onUpdateSettings: (settings: Partial<StoreSettings>) => void;
}

export function StoreSettings({ settings, onUpdateSettings }: StoreSettingsProps) {
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName,
        description: settings.description,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/store-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedSettings = await response.json();
        onUpdateSettings(updatedSettings);
        setMessage({ type: 'success', text: 'Store settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update store settings' });
      }
    } catch (error) {
      console.error('Error updating store settings:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating settings' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Store className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Store Settings</h2>
        </div>
        <p className="text-sm text-gray-500">Customize your store name and description</p>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Store className="h-4 w-4 inline mr-2" />
              Store Name
            </label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              placeholder="Enter your store name"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will appear in the header and browser tab
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Store Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-none"
              placeholder="Enter a brief description of your store"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will appear in the header banner
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {settings && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Settings</h3>
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Store Name:</span> {settings.storeName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Description:</span> {settings.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {new Date(settings.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 