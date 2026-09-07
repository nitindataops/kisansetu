import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  ChevronRight,
  Store
} from 'lucide-react';
import { BuyerOrder } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

interface BuyerOrdersViewProps {
  orders: BuyerOrder[];
  currentLanguage: LanguageCode;
  onBrowseMore: () => void;
}

export const BuyerOrdersView: React.FC<BuyerOrdersViewProps> = ({
  orders,
  currentLanguage,
  onBrowseMore,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const [selectedOrder, setSelectedOrder] = useState<BuyerOrder | null>(null);

  const getStatusBadge = (status: BuyerOrder['status']) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#EEF3E8] text-[#245C3A] text-xs font-bold">Delivered ✓</span>;
      case 'in transit':
      case 'in_transit':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1"><Truck className="w-3 h-3" /> In Transit</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">Confirmed</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">{status}</span>;
    }
  };

  const handlePrintInvoice = (order: BuyerOrder) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const firstItem = order.items?.[0];
    const cropName = order.crop || firstItem?.crop || 'Produce';
    const varietyName = order.variety || firstItem?.variety || '';
    const gradeName = order.grade || firstItem?.grade || 'A';
    const farmerName = order.farmerName || firstItem?.farmerName || 'Verified Farmer';
    const farmerId = order.farmerId || firstItem?.farmerId || 'KISAN-FARMER';
    const qty = order.quantityKg || firstItem?.quantityKg || 0;
    const rate = order.pricePerKg || firstItem?.pricePerKg || 0;
    const orderDate = order.createdAt || order.orderDate || 'Today';

    printWindow.document.write(`
      <html>
        <head>
          <title>KisanSetu Mandi Invoice - ${order.id || order.orderNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #333; line-height: 1.5; }
            .header { border-bottom: 2px solid #245C3A; padding-bottom: 15px; margin-bottom: 20px; }
            .title { color: #245C3A; font-size: 24px; font-weight: bold; }
            .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f4efe6; }
            .total { font-weight: bold; font-size: 16px; color: #245C3A; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">KisanSetu Mandi Procurement Invoice</div>
            <div>Direct Farm-to-Warehouse Verified Tax Invoice</div>
          </div>
          <div class="details">
            <p><strong>Invoice / Order ID:</strong> ${order.id || order.orderNumber}</p>
            <p><strong>Date:</strong> ${orderDate}</p>
            <p><strong>Farmer / Seller:</strong> ${farmerName} (ID: ${farmerId})</p>
            <p><strong>Delivery Destination:</strong> ${order.deliveryAddress}</p>
            <p><strong>Batch Traceability ID:</strong> ${order.batchId || 'BATCH-VERIFIED'}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Crop & Variety</th>
                <th>Quality Grade</th>
                <th>Quantity (kg)</th>
                <th>Rate (₹/kg)</th>
                <th>Total Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${cropName} - ${varietyName}</td>
                <td>Grade ${gradeName}</td>
                <td>${(qty || 0).toLocaleString()}</td>
                <td>₹${rate}</td>
                <td>₹${(order.totalAmount || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <p class="total" style="margin-top: 20px; text-align: right;">
            Grand Total (Escrow Secured): ₹${(order.totalAmount || 0).toLocaleString()}
          </p>
          <p style="font-size: 12px; color: #777; margin-top: 40px;">
            Protected by KisanSetu Mandi Escrow. Quality verified at destination warehouse.
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E3DCB] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#26332B] tracking-tight">
            {t.orders.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#68736B] mt-1 font-medium">
            {t.orders.subtitle}
          </p>
        </div>

        <button
          onClick={onBrowseMore}
          className="px-4 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 self-start cursor-pointer shadow-xs"
        >
          <Store className="w-4 h-4" />
          <span>Browse Marketplace</span>
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E3DCB] p-12 text-center text-[#8D9B91] space-y-3">
          <Package className="w-12 h-12 mx-auto text-[#D5DDD2]" />
          <h3 className="text-base font-bold text-[#26332B]">No procurement orders yet</h3>
          <p className="text-xs max-w-sm mx-auto">
            Place your first farm-gate produce order from the marketplace or post bulk procurement requirements.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#E3DCB] p-5 shadow-2xs space-y-4 hover:border-[#245C3A] transition-all"
            >
              {/* Order Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EBE1]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-black text-[#245C3A]">{order.id || order.orderNumber}</span>
                  <span className="text-xs text-[#68736B]">Ordered: {order.createdAt || order.orderDate || 'Recent'}</span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintInvoice(order)}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#E3DCB] hover:bg-[#EEF3E8] text-xs font-bold text-[#245C3A] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.orders.viewInvoice}</span>
                  </button>
                </div>
              </div>

              {/* Order Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FBFAF4] border border-[#EBE5D8]">
                  <span className="text-[#68736B] text-[11px] block">{t.orders.crop}</span>
                  <strong className="text-sm font-black text-[#26332B]">{order.crop || order.items?.[0]?.crop || 'Produce'}</strong>
                  <span className="text-[10px] text-[#5F8F45] block">{order.variety || order.items?.[0]?.variety || ''} (Grade {order.grade || order.items?.[0]?.grade || 'A'})</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FBFAF4] border border-[#EBE5D8]">
                  <span className="text-[#68736B] text-[11px] block">{t.orders.farmer}</span>
                  <strong className="text-sm font-black text-[#26332B]">{order.farmerName || order.items?.[0]?.farmerName || 'Farmer'}</strong>
                  <span className="text-[10px] text-[#8D9B91] block">ID: {order.farmerId || order.items?.[0]?.farmerId || 'KISAN-FARMER'}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FBFAF4] border border-[#EBE5D8]">
                  <span className="text-[#68736B] text-[11px] block">{t.orders.quantity}</span>
                  <strong className="text-sm font-black text-[#26332B]">{(order.quantityKg || order.items?.[0]?.quantityKg || 0).toLocaleString()} kg</strong>
                  <span className="text-[10px] text-[#68736B] block">@ ₹{order.pricePerKg || order.items?.[0]?.pricePerKg || 0}/kg</span>
                </div>

                <div className="p-3 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/30">
                  <span className="text-[#5F8F45] text-[11px] font-bold block">{t.orders.total}</span>
                  <strong className="text-base font-black text-[#245C3A]">₹{(order.totalAmount || 0).toLocaleString()}</strong>
                  <span className="text-[10px] text-[#245C3A] block">Secured in Mandi Escrow</span>
                </div>
              </div>

              {/* Dispatch & Driver Tracking Info (Prompt Section 32) */}
              {order.dispatchInfo && (
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E3DCB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#245C3A] text-white flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[#26332B]">
                        Vehicle: {order.dispatchInfo.vehicleNumber} • Driver: {order.dispatchInfo.driverName}
                      </span>
                      <span className="text-[11px] text-[#68736B] block flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#245C3A]" />
                        <span>{order.dispatchInfo.currentLocation}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${order.dispatchInfo.driverPhone}`}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#D5DDD2] text-xs font-bold text-[#48534C] hover:bg-[#EEF3E8] flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-[#245C3A]" />
                      <span>{order.dispatchInfo.driverPhone}</span>
                    </a>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
