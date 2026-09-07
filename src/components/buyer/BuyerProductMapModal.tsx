import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Navigation, Compass, ExternalLink, ShieldCheck, Truck } from 'lucide-react';
import L from 'leaflet';
import { MarketplaceProduct } from '../../types/buyer';
import { getCoordinatesForLocation, calculateHaversineDistanceKm } from '../../utils/distanceCalculator';

interface BuyerProductMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MarketplaceProduct;
  buyerLocation?: string;
  buyerDistrict?: string;
  currentLanguage?: 'en' | 'hi';
}

export const BuyerProductMapModal: React.FC<BuyerProductMapModalProps> = ({
  isOpen,
  onClose,
  product,
  buyerLocation = 'Bareilly APMC Mandi, Bareilly, Uttar Pradesh',
  buyerDistrict = 'Bareilly',
  currentLanguage = 'en',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [buyerCoords, setBuyerCoords] = useState<{ lat: number; lng: number; isLive: boolean }>(() => {
    const coords = getCoordinatesForLocation(buyerLocation, buyerDistrict);
    return { lat: coords.lat, lng: coords.lng, isLive: false };
  });

  const [isLocating, setIsLocating] = useState(false);

  // Compute Farmer's authentic coordinates
  const farmerCoords = getCoordinatesForLocation(
    product.location,
    product.district,
    (product as any).latitude,
    (product as any).longitude
  );

  const distanceKm = calculateHaversineDistanceKm(
    buyerCoords.lat,
    buyerCoords.lng,
    farmerCoords.lat,
    farmerCoords.lng
  );

  const isHi = currentLanguage === 'hi';

  // Request Buyer's real live device GPS if desired
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setBuyerCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isLive: true,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation failed or denied:', err);
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Destroy existing instance before recreation
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      // High-performance OpenStreetMap Carto tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom Farmer Icon (Green Badge)
      const farmerIcon = L.divIcon({
        className: 'custom-farmer-icon',
        html: `
          <div style="
            background-color: #245C3A;
            color: #ffffff;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 3px solid #ffffff;
            font-size: 18px;
          ">
            🌾
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20],
      });

      // Custom Buyer Icon (Navy Badge)
      const buyerIcon = L.divIcon({
        className: 'custom-buyer-icon',
        html: `
          <div style="
            background-color: #1E3A8A;
            color: #ffffff;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 3px solid #ffffff;
            font-size: 18px;
          ">
            🏢
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20],
      });

      // Farmer Marker & Popup
      const farmerMarker = L.marker([farmerCoords.lat, farmerCoords.lng], { icon: farmerIcon }).addTo(map);
      farmerMarker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 190px;">
          <div style="font-size: 11px; font-weight: 800; color: #245C3A; text-transform: uppercase;">
            ${isHi ? 'किसान का खेत / भंडारण' : 'Farmer Farm & Storage'}
          </div>
          <div style="font-size: 14px; font-weight: bold; color: #1f2937; margin: 2px 0;">
            ${product.farmerName}
          </div>
          <div style="font-size: 12px; color: #4b5563;">
            📍 ${product.location || 'Baheri, Bareilly'}
          </div>
          <div style="font-size: 11px; color: #166534; font-weight: 600; margin-top: 4px; background: #EEF3E8; padding: 2px 6px; border-radius: 6px;">
            ${product.crop} (${product.variety || 'Quality Lot'}) • ${(product.quantityKg || 0).toLocaleString()} kg
          </div>
          <div style="font-size: 10px; color: #6b7280; margin-top: 4px;">
            GPS: ${farmerCoords.lat.toFixed(4)}° N, ${farmerCoords.lng.toFixed(4)}° E
          </div>
        </div>
      `).openPopup();

      // Buyer Marker & Popup
      const buyerMarker = L.marker([buyerCoords.lat, buyerCoords.lng], { icon: buyerIcon }).addTo(map);
      buyerMarker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 180px;">
          <div style="font-size: 11px; font-weight: 800; color: #1E3A8A; text-transform: uppercase;">
            ${buyerCoords.isLive ? (isHi ? 'आपका लाइव स्थान' : 'Your Live Location') : (isHi ? 'खरीदार प्रापण केंद्र' : 'Buyer Procurement Center')}
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #1f2937; margin: 2px 0;">
            ${buyerCoords.isLive ? 'Current Buyer GPS' : buyerLocation}
          </div>
          <div style="font-size: 10px; color: #6b7280; margin-top: 4px;">
            GPS: ${buyerCoords.lat.toFixed(4)}° N, ${buyerCoords.lng.toFixed(4)}° E
          </div>
        </div>
      `);

      // Draw direct route polyline
      const latlngs: [number, number][] = [
        [farmerCoords.lat, farmerCoords.lng],
        [buyerCoords.lat, buyerCoords.lng],
      ];

      const polyline = L.polyline(latlngs, {
        color: '#245C3A',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);

      // Fit map viewport to encompass both points comfortably
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, farmerCoords.lat, farmerCoords.lng, buyerCoords.lat, buyerCoords.lng]);

  if (!isOpen) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${buyerCoords.lat},${buyerCoords.lng}&destination=${farmerCoords.lat},${farmerCoords.lng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#EEF3E8]">
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-4 bg-[#FBFAF4] border-b border-[#EEF3E8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#245C3A] text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-[#26332B] font-serif leading-tight">
                  {isHi ? 'खेत का वास्तविक जीपीएस स्थान व पारगमन' : 'Farmer Farm Geolocation & Transit Corridor'}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EEF3E8] text-[#245C3A] text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-[#5F8F45]" />
                  {isHi ? 'सत्यापित' : 'GPS Verified'}
                </span>
              </div>
              <p className="text-xs text-[#68736B]">
                {product.farmerName} • {product.location || 'Bareilly, Uttar Pradesh'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGetLiveLocation}
              disabled={isLocating}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EEF3E8] bg-white text-[#245C3A] hover:bg-[#EEF3E8] text-xs font-semibold transition-colors cursor-pointer"
              title="Use current GPS location"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? (isHi ? 'खोज रहे हैं...' : 'Locating...') : isHi ? 'मेरी लाइव स्थिति' : 'My Live GPS'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-[#EEF3E8] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Leaflet Map Canvas Container */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[440px] w-full bg-gray-100">
          <div ref={mapContainerRef} className="w-full h-full min-h-[340px] sm:min-h-[440px] z-0" />

          {/* Floating Route Distance Overlay */}
          <div className="absolute top-3 left-3 z-40 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[#EEF3E8] max-w-xs pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#245C3A]/10 text-[#245C3A]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#68736B] block">
                  {isHi ? 'सीधी पारगमन दूरी' : 'Transit Corridor'}
                </span>
                <span className="text-base font-black text-[#26332B]">
                  {distanceKm} km
                </span>
                <span className="text-xs text-gray-500 ml-1.5">
                  (~{Math.max(20, Math.round((distanceKm / 45) * 60))} mins)
                </span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-[#68736B] flex items-center justify-between">
              <span>{isHi ? 'सीधा खेत से उठाव' : 'Direct Farm Gate Pickup'}</span>
              <span className="text-emerald-700 font-bold">✓ {isHi ? 'सड़क पहुंच योग्य' : 'Road Accessible'}</span>
            </div>
          </div>
        </div>

        {/* Footer info & external navigation trigger */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#EEF3E8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-[#68736B] w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#245C3A] inline-block" />
              <span>{isHi ? 'किसान का स्थान' : 'Farmer Origin'}: <strong>{farmerCoords.lat.toFixed(4)}°N, {farmerCoords.lng.toFixed(4)}°E</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1E3A8A] inline-block" />
              <span>{isHi ? 'खरीदार गंतव्य' : 'Buyer Hub'}: <strong>{buyerCoords.lat.toFixed(4)}°N, {buyerCoords.lng.toFixed(4)}°E</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isHi ? 'गूगल मैप्स में खोलें' : 'Open in Google Maps Navigation'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EEF3E8] text-[#26332B] hover:bg-gray-50 text-xs font-bold cursor-pointer"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
