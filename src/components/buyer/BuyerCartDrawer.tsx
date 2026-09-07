import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Building,
  CreditCard,
  Truck
} from 'lucide-react';
import { BuyerCartItem, BuyerProfile, BuyerOrder } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { resolveCropImage, handleCropImageError } from '../../data/imageAssets';

interface BuyerCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BuyerCartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  buyerProfile?: BuyerProfile | null;
  currentLanguage: LanguageCode;
  onPlaceOrder: (order: Omit<BuyerOrder, 'id' | 'createdAt'>) => void;
}

export const BuyerCartDrawer: React.FC<BuyerCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  buyerProfile,
  currentLanguage,
  onPlaceOrder,
}) => {
  if (!isOpen) return null;

  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [selectedAddress, setSelectedAddress] = useState(buyerProfile?.deliveryAddress || '');
  const [paymentMethod, setPaymentMethod] = useState<'escrow' | 'rtgs' | 'credit'>('escrow');
  const [createdOrderIds, setCreatedOrderIds] = useState<string[]>([]);

  React.useEffect(() => {
    if (buyerProfile?.deliveryAddress) {
      setSelectedAddress(buyerProfile.deliveryAddress);
    }
  }, [buyerProfile]);

  // Subtotal calculations
  const subtotal = items.reduce((sum, item) => sum + (item.pricePerKg * item.quantityKg), 0);
  const mandiFee = Math.round(subtotal * 0.015); // 1.5% APMC market fee
  const logisticsEstimate = items.length > 0 ? 1200 + (items.reduce((s, i) => s + i.quantityKg, 0) * 0.4) : 0;
  const grandTotal = Math.round(subtotal + mandiFee + logisticsEstimate);

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Create an order for each distinct product lot
    const newOrderIds: string[] = [];
    items.forEach((item, index) => {
      const orderId = `KS-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      newOrderIds.push(orderId);

      onPlaceOrder({
        productId: item.productId,
        crop: item.crop,
        variety: item.variety,
        grade: item.grade,
        quantityKg: item.quantityKg,
        pricePerKg: item.pricePerKg,
        totalAmount: Math.round(item.pricePerKg * item.quantityKg + (item.pricePerKg * item.quantityKg * 0.015)),
        farmerId: item.farmerId,
        farmerName: item.farmerName,
        deliveryAddress: selectedAddress,
        status: 'confirmed',
        estimatedDelivery: '2-3 Business Days',
        batchId: item.batchId || `BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
        dispatchInfo: {
          driverName: 'Rajinder Kumar',
          driverPhone: '+91 98112 34509',
          vehicleNumber: 'UP-25-AT-4412',
          currentLocation: 'En route from Farm-Gate Bareilly Hub',
          status: 'dispatched',
        },
      });
    });

    setCreatedOrderIds(newOrderIds);
    onClearCart();
    setCheckoutStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF7F0] border-b border-[#E3DCB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <div>
              <h3 className="text-base font-black text-[#26332B]">{t.cart.title}</h3>
              <span className="text-[11px] text-[#68736B]">({items.length} items)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white border border-[#D5DDD2] text-[#68736B] hover:text-[#26332B] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {checkoutStep === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-[#8D9B91]">
                  <span className="text-4xl mb-2">🌾</span>
                  <p className="text-xs font-semibold max-w-[200px]">{t.cart.empty}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#E3DCB] flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveCropImage({ imageUrl: item.imageUrl, crop: item.crop, variety: item.variety })}
                            alt={item.crop}
                            onError={(e) => handleCropImageError(e, item.crop, item.variety)}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover bg-[#F4EFE6] shrink-0"
                          />
                          <div>
                            <h4 className="text-xs font-black text-[#26332B]">{item.crop} ({item.variety})</h4>
                            <span className="text-[10px] font-bold text-[#245C3A] bg-[#EEF3E8] px-1.5 py-0.2 rounded-sm">
                              Grade {item.grade}
                            </span>
                            <span className="text-[10px] text-[#68736B] block mt-0.5">
                              Farmer: <strong>{item.farmerName}</strong>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.productId)}
                          className="text-[#8D9B91] hover:text-red-500 p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price & Quantity Adjuster */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#F0EBE1]">
                        <div className="flex items-center gap-2 bg-white border border-[#D5DDD2] rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.productId, Math.max(50, item.quantityKg - 50))}
                            className="w-6 h-6 rounded flex items-center justify-center text-xs text-[#26332B] hover:bg-[#EEF3E8] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-[#245C3A] px-1">
                            {item.quantityKg} kg
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.productId, Math.min(item.availableQuantityKg, item.quantityKg + 50))}
                            className="w-6 h-6 rounded flex items-center justify-center text-xs text-[#26332B] hover:bg-[#EEF3E8] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-[#26332B]">
                            ₹{(item.pricePerKg * item.quantityKg).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#68736B] block">(@ ₹{item.pricePerKg}/kg)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#E3DCB] space-y-2">
                <label className="font-bold text-[#26332B] block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#245C3A]" />
                  <span>{t.cart.deliveryAddress}</span>
                </label>
                <textarea
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#D5DDD2] rounded-xl text-xs"
                  rows={2}
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#E3DCB] space-y-2">
                <label className="font-bold text-[#26332B] block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#245C3A]" />
                  <span>{t.cart.paymentMethod}</span>
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#5F8F45]/30 cursor-pointer">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === 'escrow'}
                      onChange={() => setPaymentMethod('escrow')}
                      className="text-[#245C3A]"
                    />
                    <div>
                      <span className="font-bold text-[#245C3A] block">KisanSetu Mandi Escrow (Recommended)</span>
                      <span className="text-[10px] text-[#68736B]">Released to farmer only after quality inspection at warehouse.</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#D5DDD2] cursor-pointer">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === 'rtgs'}
                      onChange={() => setPaymentMethod('rtgs')}
                      className="text-[#245C3A]"
                    />
                    <div>
                      <span className="font-bold text-[#26332B] block">Bank RTGS / NEFT Direct</span>
                      <span className="text-[10px] text-[#68736B]">Instant direct bank settlement to farmer's verified account.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/30 text-[10.5px] text-[#245C3A] leading-relaxed">
                {t.cart.escrowGuarantee}
              </div>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#EEF3E8] text-[#245C3A] flex items-center justify-center text-3xl shadow-sm">
                🎉
              </div>
              <h3 className="text-lg font-black text-[#26332B]">{t.cart.orderSuccess}</h3>
              <p className="text-xs text-[#68736B] max-w-xs">
                Your procurement request has been locked with verified farmers. Track live status under Orders.
              </p>
              <div className="p-3 rounded-xl bg-[#FBFAF4] border border-[#E3DCB] text-xs font-mono font-bold text-[#245C3A]">
                {createdOrderIds.join(', ')}
              </div>
            </div>
          )}

        </div>

        {/* Footer Totals & CTA */}
        {items.length > 0 && checkoutStep !== 'success' && (
          <div className="p-4 sm:p-5 bg-[#FAF7F0] border-t border-[#E3DCB] space-y-3">
            <div className="space-y-1.5 text-xs text-[#48534C]">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-bold text-[#26332B]">₹{(subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>{t.cart.mandiCess}</span>
                <span>₹{(mandiFee || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>{t.cart.transportEstimate}</span>
                <span>₹{(Math.round(logisticsEstimate) || 0).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-[#E3DCB] flex justify-between text-sm font-black text-[#245C3A]">
                <span>{t.cart.grandTotal}</span>
                <span className="text-base">₹{(grandTotal || 0).toLocaleString()}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-3 px-4 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>{t.cart.checkoutBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="px-3 py-2.5 rounded-xl bg-white border border-[#D5DDD2] text-xs font-bold text-[#48534C]"
                >
                  Back
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>{t.cart.placeOrder}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="p-4 sm:p-5 bg-[#FAF7F0] border-t border-[#E3DCB]">
            <button
              onClick={() => {
                setCheckoutStep('cart');
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-[#245C3A] text-white text-xs font-black cursor-pointer"
            >
              Done & View Marketplace
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
