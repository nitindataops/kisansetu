import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  FileText,
  PhoneCall,
  ShieldCheck,
  MapPin,
  Scale,
  DollarSign,
  Download,
  AlertCircle,
} from 'lucide-react';
import { OrderRecord } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';

interface OrdersViewProps {
  orders: OrderRecord[];
  currentLanguage: LanguageCode;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, currentLanguage }) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed'>('All');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderRecord | null>(null);

  const t = getFarmerTranslations(currentLanguage);
  const oT = t.ordersView;

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'Active') return o.status !== 'Payment Completed';
    if (filterStatus === 'Completed') return o.status === 'Payment Completed';
    return true;
  });

  const steps = [
    oT.offerSubmitted,
    oT.pickupScheduled,
    oT.inTransit,
    oT.delivered,
    oT.paymentCompleted,
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF3E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#26332B]">
              {oT.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#68736B] mt-0.5">
            {oT.subtitle}
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EEF3E8] border border-[#5F8F45]/20 self-start md:self-auto">
          {(['All', 'Active', 'Completed'] as const).map((stat) => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === stat
                  ? 'bg-[#245C3A] text-white shadow-2xs'
                  : 'text-[#26332B] hover:text-[#245C3A]'
              }`}
            >
              {stat === 'All' ? t.common.all : stat === 'Active' ? oT.activeOrdersTab : oT.completedOrdersTab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border border-[#EEF3E8] text-center">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#26332B]">{oT.noOrdersFound}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#EEF3E8] hover:border-[#5F8F45]/40 transition-all p-5 sm:p-7 shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#EEF3E8]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#68736B]">
                      {order.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5F8F45]/15 text-[#245C3A] text-xs font-bold">
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#26332B] mt-1">
                    {order.buyerName} • {order.crop} ({order.variety})
                  </h3>
                </div>

                <div className="text-left lg:text-right">
                  <div className="text-xl font-black font-serif text-[#245C3A]">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-[#68736B]">
                    {order.quantityKg.toLocaleString('en-IN')} kg @ ₹{order.ratePerKg}/kg
                  </span>
                </div>
              </div>

              {/* Progress Tracker Bar */}
              <div className="py-5">
                <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold text-[#68736B] mb-2">
                  {steps.map((step, idx) => (
                    <div key={idx} className="truncate px-1">
                      {step}
                    </div>
                  ))}
                </div>
                <div className="w-full bg-[#EEF3E8] h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#245C3A] h-full rounded-full transition-all duration-500"
                    style={{
                      width:
                        order.status === 'Payment Completed'
                          ? '100%'
                          : order.status === 'Delivered'
                          ? '80%'
                          : order.status === 'In Transit'
                          ? '60%'
                          : order.status === 'Pickup Scheduled'
                          ? '40%'
                          : '20%',
                    }}
                  />
                </div>
              </div>

              {/* Driver & Pickup details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] text-xs text-[#68736B]">
                <div>
                  <span className="text-[10px] uppercase font-bold block">{oT.pickupSchedule}:</span>
                  <strong className="text-[#26332B]">{order.pickupDate}</strong>
                </div>
                {order.driverName && (
                  <div>
                    <span className="text-[10px] uppercase font-bold block">{oT.assignedDriver}:</span>
                    <strong className="text-[#26332B]">
                      {order.driverName} ({order.driverVehicle})
                    </strong>
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold block">{oT.escrowStatus}:</span>
                  <strong className="text-[#5F8F45]">✓ {order.paymentStatus}</strong>
                </div>
              </div>

              {/* Receipt action */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[#68736B]">
                  Direct Escrow Transfer: <b>HDFC Bank A/C ****4821</b>
                </span>
                <button
                  onClick={() => setSelectedReceiptOrder(order)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-[#245C3A] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{oT.viewReceiptBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EEF3E8] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEF3E8] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <div>
                  <h3 className="font-bold text-base font-serif text-[#245C3A]">KisanSetu Escrow Receipt</h3>
                  <span className="text-[10px] text-[#68736B]">{selectedReceiptOrder.orderNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#68736B] p-4 rounded-2xl bg-[#FBFAF4] border border-[#EEF3E8] mb-4">
              <div className="flex justify-between">
                <span>Crop Lot:</span>
                <b className="text-[#26332B]">{selectedReceiptOrder.crop}</b>
              </div>
              <div className="flex justify-between">
                <span>Buyer:</span>
                <b className="text-[#26332B]">{selectedReceiptOrder.buyerName}</b>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <b className="text-[#26332B]">{selectedReceiptOrder.quantityKg} kg</b>
              </div>
              <div className="flex justify-between">
                <span>Agreed Rate:</span>
                <b className="text-[#26332B]">₹{selectedReceiptOrder.ratePerKg}/kg</b>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#EEF3E8] text-sm font-bold text-[#245C3A]">
                <span>Total Amount:</span>
                <span>₹{selectedReceiptOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="w-full py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold cursor-pointer"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
