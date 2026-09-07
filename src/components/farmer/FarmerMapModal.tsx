import React, { useState } from 'react';
import {
  X,
  MapPin,
  Building,
  Warehouse,
  Truck,
  Navigation,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';

interface FarmerMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerName?: string;
  farmerVillage?: string;
}

export const FarmerMapModal: React.FC<FarmerMapModalProps> = ({
  isOpen,
  onClose,
  farmerName = 'Your Farm',
  farmerVillage = 'Village Haridaspur',
}) => {
  const [selectedPin, setSelectedPin] = useState<{
    name: string;
    type: 'farm' | 'buyer' | 'storage' | 'mandi';
    distanceKm: number;
    description: string;
    rateOrCapacity: string;
  } | null>(null);

  if (!isOpen) return null;

  const locations = [
    {
      id: 'farm',
      name: farmerName ? `Your Farm (${farmerName})` : 'Your Farm',
      type: 'farm' as const,
      x: 48,
      y: 52,
      distanceKm: 0,
      description: `${farmerVillage}, Verified Agricultural Land`,
      rateOrCapacity: 'Active Registered Produce Lots',
    },
    {
      id: 'store-1',
      name: 'Sheetal Kisan Cold Storage',
      type: 'storage' as const,
      x: 38,
      y: 42,
      distanceKm: 8,
      description: 'Modern Ammonia 0-4°C Multi-Chamber Storage',
      rateOrCapacity: '₹28/qtl/mo • 3,400 qtl space',
    },
    {
      id: 'mandi-1',
      name: 'Meerut APMC Mandi Yard',
      type: 'mandi' as const,
      x: 62,
      y: 35,
      distanceKm: 18,
      description: 'Principal Agricultural Produce Market',
      rateOrCapacity: 'Live Rice: ₹42/kg • Wheat: ₹26.5/kg',
    },
    {
      id: 'itc-1',
      name: 'ITC Choupal Sagar Logistics',
      type: 'buyer' as const,
      x: 72,
      y: 58,
      distanceKm: 18,
      description: 'Institutional Grain Sourcing Depot',
      rateOrCapacity: 'Buying Wheat @ ₹26.50/kg',
    },
    {
      id: 'mother-dairy',
      name: 'Reliance Retail Agri Hub',
      type: 'buyer' as const,
      x: 30,
      y: 72,
      distanceKm: 24,
      description: 'NCR Direct Agro Procurement Hub',
      rateOrCapacity: 'Buying Maize @ ₹25.50/kg',
    },
    {
      id: 'patanjali',
      name: 'Patanjali Mega Food Park',
      type: 'buyer' as const,
      x: 82,
      y: 22,
      distanceKm: 42,
      description: 'Organic & Food Processing Complex',
      rateOrCapacity: 'Buying Pulses @ ₹64.00/kg',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#EEF3E8] overflow-hidden animate-in fade-in-50 zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Modal Topbar */}
        <div className="p-5 bg-linear-to-r from-[#245C3A] to-[#1A3D27] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
              🗺️
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">
                Regional Farm, Buyer & Mandi Corridor Map
              </h3>
              <p className="text-xs text-white/80">
                Meerut – Ghaziabad – Bareilly Agricultural Trading Zone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Canvas & Interactive Pins */}
        <div className="relative flex-1 bg-[#EEF3E8] overflow-hidden min-h-[380px] p-4 sm:p-6 flex items-center justify-center">
          {/* Subtle Topographical & Route Grid Background */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(#5F8F45 1.5px, transparent 1.5px), radial-gradient(#245C3A 1.5px, #EEF3E8 1.5px)',
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 15px 15px',
            }}
          />

          {/* Radii Circles around Farm */}
          <div className="absolute w-[240px] h-[240px] rounded-full border border-[#5F8F45]/30 pointer-events-none flex items-start justify-center">
            <span className="text-[10px] bg-white/80 px-1.5 py-0.5 rounded-full text-[#245C3A] font-bold mt-1">
              10 km Radius
            </span>
          </div>
          <div className="absolute w-[420px] h-[420px] rounded-full border border-dashed border-[#5F8F45]/20 pointer-events-none flex items-start justify-center">
            <span className="text-[10px] bg-white/80 px-1.5 py-0.5 rounded-full text-[#245C3A] font-bold mt-1">
              25 km Radius
            </span>
          </div>

          {/* Interactive Pins */}
          {locations.map((loc) => {
            const isFarm = loc.type === 'farm';
            const isSelected = selectedPin?.name === loc.name;

            return (
              <button
                key={loc.id}
                onClick={() => setSelectedPin(loc)}
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 transition-all duration-200 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div
                  className={`p-2 rounded-2xl shadow-lg flex items-center gap-1.5 border-2 ${
                    isFarm
                      ? 'bg-[#245C3A] border-[#D6A63A] text-white'
                      : loc.type === 'storage'
                      ? 'bg-[#B86F4B] border-white text-white'
                      : loc.type === 'mandi'
                      ? 'bg-[#D6A63A] border-[#245C3A] text-[#1A2E20]'
                      : 'bg-white border-[#245C3A] text-[#245C3A]'
                  }`}
                >
                  <span className="text-sm">
                    {isFarm ? '🏡' : loc.type === 'storage' ? '❄️' : loc.type === 'mandi' ? '🏛️' : '🏢'}
                  </span>
                  <span className="text-[11px] font-black hidden sm:inline-block max-w-[120px] truncate">
                    {loc.name.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Location Bottom Drawer / Info */}
        <div className="p-5 bg-white border-t border-[#EEF3E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {selectedPin ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-[#26332B]">{selectedPin.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-[#5F8F45]/15 text-[#245C3A] text-xs font-bold">
                  {selectedPin.distanceKm === 0 ? 'Your Base' : `${selectedPin.distanceKm} km away`}
                </span>
              </div>
              <p className="text-xs text-[#68736B]">{selectedPin.description}</p>
              <span className="text-xs font-bold text-[#245C3A] block">
                {selectedPin.rateOrCapacity}
              </span>
            </div>
          ) : (
            <div className="text-xs text-[#68736B]">
              👉 Tap any pin on the map to view buyer pricing, storage rates, and logistics distance from your farm.
            </div>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold transition-colors self-end sm:self-auto"
          >
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
};
