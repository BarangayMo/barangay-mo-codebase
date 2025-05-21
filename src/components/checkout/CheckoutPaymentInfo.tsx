
import { CreditCard } from "lucide-react";

export const CheckoutPaymentInfo: React.FC = () => {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Shipping method</h2>
        <div className="border rounded-md p-4 flex justify-between items-center bg-white">
          <span className="text-sm">Standard</span>
          <span className="text-sm font-medium">FREE</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Payment</h2>
        <p className="text-xs text-gray-500 mb-2">All transactions are secure and encrypted.</p>
        <div className="border rounded-md bg-white">
          <div className="p-4 border-b flex justify-between items-center">
            <span className="font-medium">Paystack</span>
            <div className="flex items-center space-x-1">
              <CreditCard className="h-5 w-5 text-yellow-500" />
              <span className="text-xs">VISA</span>
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span className="text-xs">Mastercard</span>
              <span className="text-xs border px-1 rounded-sm">+3</span>
            </div>
          </div>
          <div className="p-6 text-center bg-gray-50 rounded-b-md">
            <svg className="mx-auto h-12 w-auto text-gray-400 mb-3" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <rect width="48" height="30" rx="3" fill="#E5E7EB" />
              <path d="M0 8C0 5.23858 2.23858 3 5 3H43C45.7614 3 48 5.23858 48 8V12H0V8Z" fill="#D1D5DB" />
              <circle cx="6" cy="7" r="1.5" fill="#fff" />
              <circle cx="10" cy="7" r="1.5" fill="#fff" />
              <circle cx="14" cy="7" r="1.5" fill="#fff" />
              <path d="M30 20L38 20M34 16V24" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xs text-gray-500">After clicking "Pay now", you will be redirected to Paystack to complete your purchase securely.</p>
          </div>
        </div>
      </div>
    </>
  );
};
