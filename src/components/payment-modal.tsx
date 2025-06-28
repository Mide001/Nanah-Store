"use client";

import { ProviderInterface } from "@coinbase/wallet-sdk";
import { useEffect, useState } from "react";
import { encodeFunctionData, erc20Abi, numberToHex, parseUnits } from "viem";
import { useConnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Wallet,
  Mail,
  MapPin,
  Loader2,
  DollarSign,
  Shield,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CartItem {
  id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  customMessage?: string;
}

interface PaymentResult {
  success: boolean;
  error?: string;
  email?: string;
  address?: string;
  name?: string;
}

interface UserData {
  email?: string;
  physicalAddress?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    countryCode?: string;
    name?: {
      familyName?: string;
      firstName?: string;
    };
  };
}

interface DataResponse {
  capabilities?: {
    dataCallback?: UserData;
  };
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: PaymentResult) => void;
  cartItems: CartItem[];
  total: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  cartItems,
  total,
}: PaymentModalProps) {
  const [provider, setProvider] = useState<ProviderInterface | undefined>(
    undefined
  );
  const [dataToRequest, setDataToRequest] = useState({
    email: true,
    address: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);

  const { connectors } = useConnect();

  // Initialize provider from Coinbase Wallet connector
  useEffect(() => {
    async function getProvider() {
      const coinbaseConnector = connectors.find(
        (c) => c.name === "Coinbase Wallet"
      );
      if (coinbaseConnector) {
        const provider = await coinbaseConnector.getProvider();
        setProvider(provider as ProviderInterface);
      }
    }
    getProvider();
  }, [connectors]);

  // Function to get callback URL
  function getCallbackURL() {
    // Replace this with your actual deployed URL if needed
    return "https://nanah-store.vercel.app/api/data-validation";
  }

  // Handle one-click purchase
  async function handlePayment() {
    try {
      // Check if privacy policy has been accepted
      if (!hasAcceptedPrivacy) {
        setShowPrivacyPolicy(true);
        return;
      }

      setIsLoading(true);
      setResult(null);

      // First, execute the USDC transfer
      const paymentResponse = await provider?.request({
        method: "wallet_sendCalls",
        params: [
          {
            version: "1.0",
            chainId: numberToHex(8453), // Base mainnet
            calls: [
              {
                to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC contract address on Base mainnet
                data: encodeFunctionData({
                  abi: erc20Abi,
                  functionName: "transfer",
                  args: [
                    "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", // Recipient address
                    parseUnits(total.toString(), 6), // USDC amount
                  ],
                }),
              },
            ],
          },
        ],
      }) as { hash?: string } | undefined;

      console.log("Payment response:", paymentResponse);
      console.log("Transaction hash:", paymentResponse?.hash);
      console.log("Payment amount:", total, "USDC");
      console.log("Recipient:", "0xd8da6bf26964af9d7eed9e03e53415d37aa96045");

      if (!paymentResponse?.hash) {
        throw new Error("Payment transaction failed - no transaction hash received");
      }

      // Then, collect user data separately
      const requests = [];
      if (dataToRequest.email) requests.push({ type: "email", optional: false });
      if (dataToRequest.address) requests.push({ type: "physicalAddress", optional: false });

      let userData: UserData | null = null;
      if (requests.length > 0) {
        const dataResponse = await provider?.request({
          method: "wallet_sendCalls",
          params: [
            {
              version: "1.0",
              chainId: numberToHex(8453),
              calls: [], // No blockchain calls, just data collection
              capabilities: {
                dataCallback: {
                  requests: requests,
                  callbackURL: getCallbackURL(),
                },
              },
            },
          ],
        }) as DataResponse | undefined;

        if (dataResponse?.capabilities?.dataCallback) {
          userData = dataResponse.capabilities.dataCallback;
        }
      }

      // Process the results
      const result: PaymentResult = { success: true };

      // Extract user data if provided
      if (userData) {
        if (userData.email) result.email = userData.email;
        if (userData.physicalAddress) {
          const addr = userData.physicalAddress;
          result.address = [
            addr.address1,
            addr.address2,
            addr.city,
            addr.state,
            addr.postalCode,
            addr.countryCode,
          ]
            .filter(Boolean)
            .join(", ");
        }
        if (userData.physicalAddress?.name) {
          const name = userData.physicalAddress.name;
          const fullName = `${name.familyName} ${name.firstName}`.trim();
          result.name = fullName;
        }
      }

      // Save order to localStorage for admin dashboard
      const order = {
        id: Date.now().toString(),
        customerName: result.name || "Unknown",
        customerEmail: result.email || "No email provided",
        customerAddress: result.address || "No address provided",
        items: cartItems,
        total: total,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        paymentId: paymentResponse.hash,
      };

      // Get existing orders or initialize empty array
      const existingOrders = localStorage.getItem("orders");
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      setResult(result);
      onSuccess(result);
    } catch (error: unknown) {
      console.error("Payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Transaction failed";
      setResult({
        success: false,
        error: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-gray-200 text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-pink-500" />
            Checkout & Pay
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Pay in USDC and share your info for delivery
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Cart Items:</span>
              <span className="text-sm font-medium">{cartItems.length}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Total Value:</span>
              <span className="text-sm font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-medium">Payment Required:</span>
              <span className="font-bold text-pink-500">
                {total.toFixed(2)} USDC
              </span>
            </div>
          </div>

          {/* Profile Data Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Share Profile Data:</h3>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="email"
                checked={dataToRequest.email}
                onCheckedChange={(checked: boolean) =>
                  setDataToRequest((prev) => ({ ...prev, email: !!checked }))
                }
              />
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <label htmlFor="email" className="text-sm cursor-pointer">
                  Email Address
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="address"
                checked={dataToRequest.address}
                onCheckedChange={(checked: boolean) =>
                  setDataToRequest((prev) => ({ ...prev, address: !!checked }))
                }
              />
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <label htmlFor="address" className="text-sm cursor-pointer">
                  Physical Address
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Policy Acceptance */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Checkbox
                id="privacy-accept"
                checked={hasAcceptedPrivacy}
                onCheckedChange={(checked: boolean) =>
                  setHasAcceptedPrivacy(!!checked)
                }
              />
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <label
                  htmlFor="privacy-accept"
                  className="text-sm cursor-pointer"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="text-pink-500 underline hover:text-pink-600"
                  >
                    Privacy Policy
                  </button>{" "}
                  and data usage terms
                </label>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isLoading || !provider || !hasAcceptedPrivacy}
            className="w-full bg-pink-500 text-white hover:bg-pink-600"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Pay {total.toFixed(2)} USDC & Share Profile
              </>
            )}
          </Button>

          {/* Results Display */}
          {result && (
            <div
              className={`p-3 rounded-lg ${
                result.success
                  ? "bg-gray-100 border border-gray-200"
                  : "bg-red-100 border border-red-200"
              }`}
            >
              {result.success ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-pink-500">
                    Payment Successful! 🎉
                  </h3>
                  {result.name && (
                    <p className="text-xs">
                      <strong>Name:</strong> {result.name}
                    </p>
                  )}
                  {result.email && (
                    <p className="text-xs">
                      <strong>Email:</strong> {result.email}
                    </p>
                  )}
                  {result.address && (
                    <p className="text-xs">
                      <strong>Address:</strong> {result.address}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium text-red-500">Error</h3>
                  <p className="text-xs text-red-400">{result.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs space-y-1 text-gray-500">
              <p><strong>ONE-CLICK SMART WALLET PAYMENT:</strong></p>
              <p>No connection required! Just click to pay with your smart wallet.</p>
              <p>Running on Base mainnet - real USDC payments.</p>
              <p>Make sure you have sufficient USDC balance in your wallet.</p>
            </div>
          </div>
        </div>
      </DialogContent>
      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <Dialog
          open={showPrivacyPolicy}
          onOpenChange={() => setShowPrivacyPolicy(false)}
        >
          <DialogContent className="max-w-2xl bg-white border-gray-200 text-gray-900 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-pink-500" />
                Privacy Policy & Data Usage
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                How we use your information when you order from Nanah Store
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Data We Collect
                </h3>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>
                    • <strong>Name:</strong> To personalize your order and
                    delivery
                  </li>
                  <li>
                    • <strong>Email:</strong> For delivery notifications and
                    support
                  </li>
                  <li>
                    • <strong>Address:</strong> For shipping your order
                  </li>
                  <li>
                    • <strong>Order Items:</strong> Products you purchase
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  How We Use Your Data
                </h3>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>
                    • <strong>Order Fulfillment:</strong> Ship your order to
                    your address
                  </li>
                  <li>
                    • <strong>Communication:</strong> Send order confirmations
                    and updates
                  </li>
                  <li>
                    • <strong>Support:</strong> Help with any issues related to
                    your order
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Data Sharing
                </h3>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>
                    • <strong>Shipping Partners:</strong> Your address is shared
                    only for delivery
                  </li>
                  <li>
                    • <strong>Third Parties:</strong> We do not sell or share
                    your data with third parties
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Data Security
                </h3>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>
                    • <strong>Encryption:</strong> All data is encrypted in
                    transit and at rest
                  </li>
                  <li>
                    • <strong>Secure Storage:</strong> Data is stored in secure
                    cloud databases
                  </li>
                  <li>
                    • <strong>Access Control:</strong> Limited access to
                    authorized personnel only
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Your Rights
                </h3>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>
                    • <strong>Access:</strong> View and download your data at
                    any time
                  </li>
                  <li>
                    • <strong>Delete:</strong> Request deletion of your data and
                    orders
                  </li>
                  <li>
                    • <strong>Update:</strong> Modify your information through
                    your account
                  </li>
                  <li>
                    • <strong>Contact:</strong> Reach us at
                    privacy@nanahstore.com
                  </li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPrivacyPolicy(false)}
                  className="flex-1 border-gray-200 hover:bg-gray-100 text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setHasAcceptedPrivacy(true);
                    setShowPrivacyPolicy(false);
                  }}
                  className="flex-1 bg-pink-500 text-white hover:bg-pink-600"
                >
                  Accept & Continue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
