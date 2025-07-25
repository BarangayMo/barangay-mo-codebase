
import { formatCurrency } from '@/lib/utils';
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

interface CheckoutOrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  estimatedTaxes: number;
  finalTotal: number;
}

export const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  cartItems,
  subtotal,
  shippingCost,
  estimatedTaxes,
  finalTotal,
}) => {
  return (
    <div className="bg-white md:bg-gray-100 p-4 md:p-6 rounded-lg md:border h-fit md:sticky md:top-24">
      <div className="space-y-3">
        {cartItems.length === 0 && <p className="text-gray-600 text-sm">Your cart is empty. Add items to proceed.</p>}
        {cartItems.map(item => (
          <div key={item.product_id} className="flex items-center gap-4 pb-3 border-b last:border-b-0">
            <div className="relative">
              <img
                src={item.image || DEFAULT_PRODUCT_IMAGE}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md border"
                onError={e => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE; }}
              />
              <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-800 truncate">{item.name}</h3>
            </div>
            <span className="text-sm font-medium text-gray-800">{formatCurrency(item.price * item.quantity, 'PHP')}</span>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <>
          <div className="space-y-2 pt-6 border-t mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-800">{formatCurrency(subtotal, 'PHP')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              {shippingCost === 0 ? (
                <span className="font-medium text-green-600">FREE</span>
              ) : (
                <span className="font-medium text-gray-800">{formatCurrency(shippingCost, 'PHP')}</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimated taxes (7.5%)</span> {/* Consider making tax rate dynamic */}
              <span className="font-medium text-gray-800">{formatCurrency(estimatedTaxes, 'PHP')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t mt-4">
            <span className="text-gray-800">Total</span>
            <div className="flex items-baseline">
              <span className="text-xs text-gray-500 mr-1">PHP</span>
              <span className="text-gray-900">{formatCurrency(finalTotal, 'PHP').replace('PHP', '').trim()}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
