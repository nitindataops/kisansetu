import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FarmerProfile,
  CropListing,
  BuyerMatch,
  ProcessorOpportunity,
  StorageFacility,
  MarketPriceRecord,
  OrderRecord,
  BuyerEnquiry,
  NotificationItem,
  FarmerDashboardTab,
} from '../../types/farmer';
import { LanguageCode } from '../../types';
import { AlertCircle, Sprout, RefreshCw } from 'lucide-react';
import {
  INITIAL_CROPS,
  INITIAL_BUYERS,
  INITIAL_PROCESSORS,
  INITIAL_STORAGES,
  INITIAL_MARKET_PRICES,
  INITIAL_ORDERS,
  INITIAL_ENQUIRIES,
  INITIAL_NOTIFICATIONS,
} from '../../data/farmerData';
import { fetchMandiPrices, mapOfficialToMarketPriceRecord } from '../../services/mandiApiService';
import {
  fetchFarmerProfileApi,
  getStoredAuthSession,
  fetchFarmerCropsApi,
  saveFarmerCropApi,
  deleteFarmerCropApi,
} from '../../services/authApiService';
import { isApprovedCrop } from '../../data/cropVarieties';

import { FarmerNavbar } from './FarmerNavbar';
import { FarmerMarketplaceHome } from './FarmerMarketplaceHome';
import { MyCropsView } from './MyCropsView';
import { SearchBuyersView } from './SearchBuyersView';
import { MarketPricesView } from './MarketPricesView';
import { StorageProcessingView } from './StorageProcessingView';
import { OrdersView } from './OrdersView';
import { EnquiriesView } from './EnquiriesView';
import { NotificationsView } from './NotificationsView';
import { FarmerProfileView } from './FarmerProfileView';
import { AIAnalysisView } from './AIAnalysisView';
import { VoiceAssistantView } from './VoiceAssistantView';
import { UserSupportHistoryView } from '../support/UserSupportHistoryView';

// Modals
import { AddCropModal } from './AddCropModal';
import { CropDetailsModal } from './CropDetailsModal';
import { BuyerDetailsModal } from './BuyerDetailsModal';
import { ContactBuyerModal } from './ContactBuyerModal';
import { MakeOfferModal } from './MakeOfferModal';
import { FarmerMapModal } from './FarmerMapModal';

interface FarmerDashboardProps {
  onLogout: () => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  onSwitchToBuyer?: () => void;
  farmerProfile?: FarmerProfile;
  initialTab?: FarmerDashboardTab;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onLogout,
  currentLanguage,
  onSelectLanguage,
  onSwitchToBuyer,
  farmerProfile: initialFarmerProfileProp,
  initialTab = 'overview',
}) => {
  // Navigation State with URL SearchParams sync for natural browser Back
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as FarmerDashboardTab | null;
  const [currentTab, setCurrentTab] = useState<FarmerDashboardTab>(urlTab || initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isHindi = currentLanguage === 'hi';

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as FarmerDashboardTab | null;
    if (tabFromUrl && tabFromUrl !== currentTab) {
      setCurrentTab(tabFromUrl);
    } else if (!tabFromUrl && currentTab !== 'overview' && !initialFarmerProfileProp) {
      setCurrentTab('overview');
    }
  }, [searchParams]);

  const handleSelectTab = (tab: FarmerDashboardTab) => {
    setCurrentTab(tab);
    if (tab === 'overview') {
      setSearchParams({}, { replace: false });
    } else {
      setSearchParams({ tab }, { replace: false });
    }
  };

  // App Data State - Authenticated Farmer Profile
  const [profile, setProfile] = useState<FarmerProfile | null>(() => {
    if (initialFarmerProfileProp) return initialFarmerProfileProp;
    const stored = getStoredAuthSession();
    if (stored.role === 'farmer' && stored.user && stored.user.name) {
      return stored.user as FarmerProfile;
    }
    return null;
  });
  const [loadingProfile, setLoadingProfile] = useState<boolean>(!profile);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadAuthenticatedProfile = async () => {
    try {
      const res = await fetchFarmerProfileApi();
      if (res.success && (res.profile || res.user)) {
        const p = (res.profile || res.user) as FarmerProfile;
        setProfile(p);
        setProfileError(null);
      } else {
        if (!profile && !initialFarmerProfileProp) {
          setProfileError(res.message || (currentLanguage === 'hi' ? 'आपकी प्रोफ़ाइल लोड नहीं हो सकी।' : 'Unable to load your profile.'));
        }
      }
    } catch (err: any) {
      if (!profile && !initialFarmerProfileProp) {
        setProfileError(err?.message || (currentLanguage === 'hi' ? 'आपकी प्रोफ़ाइल लोड नहीं हो सकी।' : 'Unable to load your profile.'));
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (initialFarmerProfileProp) {
      setProfile(initialFarmerProfileProp);
      setLoadingProfile(false);
    }
    loadAuthenticatedProfile();
  }, [initialFarmerProfileProp]);

  const [crops, setCrops] = useState<CropListing[]>([]);
  const [buyers] = useState<BuyerMatch[]>(INITIAL_BUYERS);
  const [processors] = useState<ProcessorOpportunity[]>(INITIAL_PROCESSORS);
  const [storages] = useState<StorageFacility[]>(INITIAL_STORAGES);
  const [marketPrices, setMarketPrices] = useState<MarketPriceRecord[]>(INITIAL_MARKET_PRICES);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [enquiries, setEnquiries] = useState<BuyerEnquiry[]>(INITIAL_ENQUIRIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Fetch official AGMARKNET mandi prices on mount
  useEffect(() => {
    async function loadOfficialPrices() {
      try {
        const res = await fetchMandiPrices({
          state: 'Uttar Pradesh',
          district: 'All',
          mode: 'official',
          limit: 30,
        });
        if (res && res.records && res.records.length > 0) {
          const mapped = res.records.map(mapOfficialToMarketPriceRecord);
          setMarketPrices(mapped);
        }
      } catch (err) {
        console.warn('Could not fetch official mandi rates on dashboard mount, using fallback', err);
      }
    }
    loadOfficialPrices();
  }, []);

  // Fetch persisted farmer crops on mount / identity load
  useEffect(() => {
    async function loadPersistedCrops() {
      const fId = profile?.farmerId || (profile as any)?.id || 'KISAN-UP-2026-8842';
      try {
        const res = await fetchFarmerCropsApi(fId);
        if (res.success && Array.isArray(res.crops)) {
          // Strictly filter to approved crops (Wheat, Rice, Maize, Pulses)
          const approved = res.crops.filter((c) => isApprovedCrop(c.name || (c as any).crop));
          setCrops(approved);
        } else {
          setCrops([]);
        }
      } catch (err) {
        console.warn('Could not fetch persisted farmer crops:', err);
      }
    }
    loadPersistedCrops();

    const handleMarketplaceUpdate = () => {
      loadPersistedCrops();
    };
    window.addEventListener('kisansetu_marketplace_updated', handleMarketplaceUpdate);
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('kisansetu_marketplace');
      bc.onmessage = () => {
        loadPersistedCrops();
      };
    } catch {}

    return () => {
      window.removeEventListener('kisansetu_marketplace_updated', handleMarketplaceUpdate);
      if (bc) bc.close();
    };
  }, [profile?.farmerId, (profile as any)?.id]);

  // Modal States
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<CropListing | null>(null);
  const [viewingCropDetails, setViewingCropDetails] = useState<CropListing | null>(null);
  const [viewingBuyerDetails, setViewingBuyerDetails] = useState<BuyerMatch | null>(null);
  const [contactingBuyer, setContactingBuyer] = useState<BuyerMatch | null>(null);
  const [makingOfferToBuyer, setMakingOfferToBuyer] = useState<BuyerMatch | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleOpenAiAssistant = () => {
    handleSelectTab('voice-assistant');
  };

  const handleSupportNavigate = (actionType: string) => {
    if (actionType === 'NAVIGATE_MARKETPLACE' && onSwitchToBuyer) {
      onSwitchToBuyer();
    } else if (actionType === 'NAVIGATE_ADD_CROP') {
      setCurrentTab('my-crops');
      setIsAddCropModalOpen(true);
    } else if (actionType === 'NAVIGATE_ORDERS') {
      setCurrentTab('orders');
    } else if (actionType === 'NAVIGATE_PROFILE' || actionType === 'NAVIGATE_PROPERTY') {
      setCurrentTab('profile');
    } else if (actionType === 'NAVIGATE_MANDI') {
      setCurrentTab('market-prices');
    } else if (actionType === 'NAVIGATE_VOICE') {
      setCurrentTab('voice-assistant');
    }
  };

  // Unread counts
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const unresolvedEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;

  // Handlers
  const handleAddOrEditCrop = (newCrop: CropListing) => {
    const fId = profile?.farmerId || (profile as any)?.id || 'KISAN-UP-2026-8842';
    const district = profile?.district || newCrop.district || 'Bareilly';
    const completeCrop: CropListing = {
      ...newCrop,
      farmerId: fId,
      district,
      state: newCrop.state || 'Uttar Pradesh',
      location: newCrop.location || `${district}, Uttar Pradesh`,
      status: newCrop.status || 'Available for Sale',
      ...({
        sellerId: fId,
        farmerName: profile?.name || 'Kisan Producer',
        farmerPhone: profile?.mobile || '',
        farmerLocation: profile?.address || `${district}, Uttar Pradesh`,
        farmerVerified: profile?.eKycStatus === 'VERIFIED ✓' || true,
        availableQuantityKg: (newCrop as any).availableQuantityKg !== undefined ? Number((newCrop as any).availableQuantityKg) : Number(newCrop.quantityKg || 1000),
        pricePerKg: Number(newCrop.expectedPrice || (newCrop as any).pricePerKg || 25),
        crop: newCrop.name || (newCrop as any).crop || 'Crop',
        createdAt: (newCrop as any).createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any),
    };

    setCrops((prev) => {
      const exists = prev.some((c) => c.id === completeCrop.id);
      if (exists) {
        return prev.map((c) => (c.id === completeCrop.id ? completeCrop : c));
      }
      return [completeCrop, ...prev];
    });
    setEditingCrop(null);

    saveFarmerCropApi(completeCrop, fId).then((res) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kisansetu_marketplace_updated', { detail: { cropId: completeCrop.id } }));
        try {
          const bc = new BroadcastChannel('kisansetu_marketplace');
          bc.postMessage({ type: 'CROP_UPDATED', cropId: completeCrop.id });
          bc.close();
        } catch {}
      }
    });
  };

  const handleDeleteCrop = async (cropId: string) => {
    if (!cropId) return;
    const confirmMsg = isHindi
      ? 'क्या आप इस फसल लिस्टिंग को हटाना चाहते हैं?'
      : 'Are you sure you want to permanently delete this crop listing?';
    if (!window.confirm(confirmMsg)) {
      return;
    }

    const fId = profile?.farmerId || (profile as any)?.id || 'KISAN-UP-2026-8842';
    // Optimistic removal
    setCrops((prev) => prev.filter((c) => c.id !== cropId && (c as any).listingId !== cropId));

    try {
      const res = await deleteFarmerCropApi(cropId, fId);
      if (res && res.success) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('kisansetu_marketplace_updated', { detail: { cropId } }));
          try {
            const bc = new BroadcastChannel('kisansetu_marketplace');
            bc.postMessage({ type: 'CROP_DELETED', cropId });
            bc.close();
          } catch {}
        }
      } else {
        console.error('Failed to delete crop listing from server:', res?.message);
        const refreshed = await fetchFarmerCropsApi(fId);
        if (refreshed.success && Array.isArray(refreshed.crops)) {
          setCrops(refreshed.crops.filter((c) => isApprovedCrop(c.name || (c as any).crop)));
        }
      }
    } catch (err) {
      console.error('Error in handleDeleteCrop:', err);
    }
  };

  const handleSellCrop = (crop: CropListing) => {
    setSearchQuery(crop.name);
    setCurrentTab('search-buyers');
  };

  const handlePerformSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('search-buyers');
  };

  const handleAcceptEnquiry = (enquiryId: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: 'Accepted' } : e))
    );
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (enquiry) {
      const newOrder: OrderRecord = {
        id: `ord-${Date.now()}`,
        orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        buyerName: enquiry.buyerName,
        crop: enquiry.crop,
        variety: 'Verified Harvest Lot',
        quantityKg: enquiry.requestedQuantityKg,
        ratePerKg: enquiry.offeredPricePerKg,
        totalAmount: enquiry.requestedQuantityKg * enquiry.offeredPricePerKg,
        status: 'Pickup Scheduled',
        stepIndex: 3,
        orderDate: 'Today',
        pickupDate: 'Tomorrow, 10:00 AM',
        paymentStatus: 'In Escrow',
        driverName: 'Ramesh Singh',
        driverPhone: '+91 98765 43210',
        vehicleNumber: 'UP 15 BT 4421 (Tata 407)',
      };
      setOrders((prev) => [newOrder, ...prev]);
    }
  };

  const handleDeclineEnquiry = (enquiryId: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: 'Declined' } : e))
    );
  };

  const handleCounterOffer = (enquiryId: string, counterPrice: number) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === enquiryId ? { ...e, status: 'Countered', offeredPricePerKg: counterPrice } : e
      )
    );
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSubmitOffer = (offer: {
    buyerId: string;
    cropName: string;
    quantityKg: number;
    pricePerKg: number;
    notes?: string;
  }) => {
    const buyer = buyers.find((b) => b.id === offer.buyerId);
    const newEnquiry: BuyerEnquiry = {
      id: `enq-${Date.now()}`,
      buyerName: buyer?.name || 'Direct Buyer',
      buyerLocation: buyer?.location || 'Local Mandi Hub',
      crop: offer.cropName,
      requestedQuantityKg: offer.quantityKg,
      offeredPricePerKg: offer.pricePerKg,
      farmerExpectedPrice: offer.pricePerKg,
      distanceKm: buyer?.distanceKm || 12,
      message: offer.notes || 'Farmer submitted direct sales offer via KisanSetu portal.',
      timestamp: 'Just now',
      status: 'New',
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    setMakingOfferToBuyer(null);
  };

  // 11 & 12: Loading and Error States
  if (loadingProfile && !profile) {
    return (
      <div className="min-h-screen bg-[#FBFAF4] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#245C3A]/10 flex items-center justify-center mb-4 text-[#245C3A]">
          <Sprout className="w-8 h-8 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold font-serif text-[#26332B] mb-2">
          {currentLanguage === 'hi' ? 'आपकी प्रोफ़ाइल लोड हो रही है...' : 'Loading your profile...'}
        </h2>
        <p className="text-xs text-[#68736B] max-w-sm">
          {currentLanguage === 'hi'
            ? 'कृपया प्रतीक्षा करें, डेटाबेस से आपके किसान खाते की जानकारी प्राप्त की जा रही है।'
            : 'Please wait, fetching your authenticated farmer record from the database.'}
        </p>
      </div>
    );
  }

  if (profileError && !profile) {
    return (
      <div className="min-h-screen bg-[#FBFAF4] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center mb-4 text-amber-700">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-[#26332B] mb-2">
          {currentLanguage === 'hi' ? 'आपकी प्रोफ़ाइल लोड नहीं हो सकी।' : 'Unable to load your profile.'}
        </h2>
        <p className="text-xs text-red-600 mb-6 max-w-sm">
          {profileError}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoadingProfile(true);
              setProfileError(null);
              loadAuthenticatedProfile();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold hover:bg-[#1B432B] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{currentLanguage === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}</span>
          </button>
          <button
            onClick={onLogout}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#EEF3E8] text-[#26332B] text-xs font-bold hover:bg-[#FBFAF4] transition-colors"
          >
            {currentLanguage === 'hi' ? 'लॉग आउट' : 'Logout'}
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FBFAF4] text-[#26332B] flex flex-col font-sans selection:bg-[#5F8F45]/30 pb-12">
      {/* 1. TOP NAVBAR */}
      <FarmerNavbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenSellModal={() => {
          setEditingCrop(null);
          setIsAddCropModalOpen(true);
        }}
        onOpenAiAssistant={handleOpenAiAssistant}
        onLogout={onLogout}
        profile={profile}
        unreadNotifsCount={unreadNotifsCount}
        unresolvedEnquiriesCount={unresolvedEnquiriesCount}
        activeOrdersCount={orders.filter((o) => o.status !== 'Payment Completed').length}
        activeCropsCount={crops.length}
        currentLanguage={currentLanguage}
        onSelectLanguage={onSelectLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPerformSearch={handlePerformSearch}
        onSwitchToBuyer={onSwitchToBuyer}
      />

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {currentTab === 'overview' && (
          <FarmerMarketplaceHome
            profile={profile}
            crops={crops}
            buyers={buyers}
            orders={orders}
            marketPrices={marketPrices}
            enquiries={enquiries}
            notifications={notifications}
            onSelectTab={handleSelectTab}
            onOpenAddCropModal={() => {
              setEditingCrop(null);
              setIsAddCropModalOpen(true);
            }}
            onOpenCropDetails={setViewingCropDetails}
            onEditCrop={(crop) => {
              setEditingCrop(crop);
              setIsAddCropModalOpen(true);
            }}
            onDeleteCrop={handleDeleteCrop}
            onSellCrop={handleSellCrop}
            onOpenAiAssistant={handleOpenAiAssistant}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'my-crops' && (
          <MyCropsView
            crops={crops}
            onOpenAddCrop={() => {
              setEditingCrop(null);
              setIsAddCropModalOpen(true);
            }}
            onEditCrop={(crop) => {
              setEditingCrop(crop);
              setIsAddCropModalOpen(true);
            }}
            onDeleteCrop={handleDeleteCrop}
            onSellCrop={handleSellCrop}
            onViewCropDetails={setViewingCropDetails}
            onUpdateCropQuantity={(id, newQty) => {
              setCrops((prev) =>
                prev.map((c) => (c.id === id ? { ...c, quantityKg: newQty } : c))
              );
            }}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'search-buyers' && (
          <SearchBuyersView
            buyers={buyers}
            marketPrices={marketPrices}
            onOpenMakeOffer={setMakingOfferToBuyer}
            onOpenContactBuyer={setContactingBuyer}
            onOpenBuyerDetails={setViewingBuyerDetails}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'market-prices' && (
          <MarketPricesView marketPrices={marketPrices} currentLanguage={currentLanguage} />
        )}

        {currentTab === 'ai-analysis' && (
          <AIAnalysisView
            crops={crops}
            onSelectTab={handleSelectTab}
            onOpenSellModal={() => {
              setEditingCrop(null);
              setIsAddCropModalOpen(true);
            }}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'voice-assistant' && (
          <VoiceAssistantView
            crops={crops}
            onSelectTab={handleSelectTab}
            onOpenSellModal={() => {
              setEditingCrop(null);
              setIsAddCropModalOpen(true);
            }}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'storage-processing' && (
          <StorageProcessingView
            storages={storages}
            processors={processors}
            currentLanguage={currentLanguage}
            crops={crops}
            farmerProfile={profile}
            onUpdateCrops={setCrops}
          />
        )}

        {currentTab === 'orders' && <OrdersView orders={orders} currentLanguage={currentLanguage} />}

        {currentTab === 'enquiries' && (
          <EnquiriesView
            enquiries={enquiries}
            onAcceptEnquiry={handleAcceptEnquiry}
            onDeclineEnquiry={handleDeclineEnquiry}
            onCounterOffer={handleCounterOffer}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotifsRead}
            onSelectTab={handleSelectTab}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'profile' && (
          <FarmerProfileView
            profile={profile}
            currentLanguage={currentLanguage}
            onUpdateProfile={(updated) => setProfile(updated)}
          />
        )}

        {currentTab === 'support' && (
          <UserSupportHistoryView
            userId="farmer_01"
            userName={profile.name}
            userRole="farmer"
            currentLanguage={currentLanguage}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}
      </main>

      {/* 3. MODALS */}
      <AddCropModal
        isOpen={isAddCropModalOpen}
        onClose={() => {
          setIsAddCropModalOpen(false);
          setEditingCrop(null);
        }}
        onAddCrop={handleAddOrEditCrop}
        editCropData={editingCrop}
        currentLanguage={currentLanguage}
      />

      <CropDetailsModal
        crop={viewingCropDetails}
        onClose={() => setViewingCropDetails(null)}
        onSellCrop={handleSellCrop}
        onEditCrop={(crop) => {
          setViewingCropDetails(null);
          setEditingCrop(crop);
          setIsAddCropModalOpen(true);
        }}
        currentLanguage={currentLanguage}
      />

      <BuyerDetailsModal
        buyer={viewingBuyerDetails}
        onClose={() => setViewingBuyerDetails(null)}
        onMakeOffer={setMakingOfferToBuyer}
        onContactBuyer={setContactingBuyer}
      />

      <ContactBuyerModal
        buyer={contactingBuyer}
        onClose={() => setContactingBuyer(null)}
      />

      <MakeOfferModal
        buyer={makingOfferToBuyer}
        crops={crops}
        onClose={() => setMakingOfferToBuyer(null)}
        onSubmitOffer={handleSubmitOffer}
      />

      <FarmerMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        farmerName={profile.name}
        farmerVillage={profile.village}
      />
    </div>
  );
};
