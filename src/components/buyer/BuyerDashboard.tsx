import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Store, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Search, 
  ChevronRight,
  TrendingDown,
  RotateCcw,
  X,
  ArrowRight,
  Loader2,
  AlertCircle,
  LogIn,
  RefreshCw
} from 'lucide-react';
import {
  fetchBuyerProfileApi,
  updateBuyerProfileApi,
  fetchBuyerOrdersApi,
  createBuyerOrderApi,
  fetchBuyerRequirementsApi,
  createBuyerRequirementApi,
  updateBuyerRequirementStatusApi,
  fetchBuyerMessagesApi,
  sendBuyerMessageApi,
  fetchMarketplaceListingsApi,
  fetchMarketplaceFarmersApi,
  fetchMarketplaceFarmerProfileApi,
  fetchBuyerCartApi,
  saveBuyerCartApi,
  fetchBuyerFavoritesApi,
  saveBuyerFavoritesApi,
  toggleBuyerFavoriteApi,
} from '../../services/authApiService';
import { 
  BuyerProfile, 
  BuyerTab, 
  MarketplaceProduct, 
  BuyerCartItem, 
  BuyerOrder, 
  BuyerRequirement, 
  PriceLockProposal, 
  FutureDemandPost, 
  BatchTraceabilityInfo, 
  BuyerMessageThread, 
  PriceWatchItem 
} from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { 
  INITIAL_BUYER_PROFILE, 
  INITIAL_MARKETPLACE_PRODUCTS, 
  INITIAL_FEATURED_FARMERS, 
  INITIAL_BUYER_ORDERS, 
  INITIAL_BUYER_REQUIREMENTS, 
  INITIAL_PRICE_LOCKS, 
  INITIAL_FUTURE_DEMANDS, 
  INITIAL_BATCH_TRACEABILITY, 
  INITIAL_MESSAGE_THREADS,
  INITIAL_PRICE_WATCHES
} from '../../data/buyerData';
import { 
  getAvailableFilterCrops, 
  getVarietiesForCrop, 
  matchesCropAndVariety,
  FilterCropOption,
  FilterVarietyOption
} from '../../utils/cropFilterUtils';

// Subcomponents
import { BuyerNavbar } from './BuyerNavbar';
import { BuyerTopNotification } from './BuyerTopNotification';
import { BuyerWelcomeBar } from './BuyerWelcomeBar';
import { BuyerCategoryNav } from './BuyerCategoryNav';
import { BuyerFilterSidebar, BuyerFilterState } from './BuyerFilterSidebar';
import { BuyerMobileFilterModal } from './BuyerMobileFilterModal';
import { BuyerProductCard } from './BuyerProductCard';
import { BuyerProductDetailPage } from './BuyerProductDetailPage';
import { BuyerFarmerProfilePage } from './BuyerFarmerProfilePage';
import { BuyerSmartBuyModal } from './BuyerSmartBuyModal';
import { BuyerProcurementView } from './BuyerProcurementView';
import { BuyerCartDrawer } from './BuyerCartDrawer';
import { BuyerOrdersView } from './BuyerOrdersView';
import { BuyerMessagesView } from './BuyerMessagesView';
import { BuyerProfileView } from './BuyerProfileView';
import { BuyerSaveTheHarvestSection } from './BuyerSaveTheHarvestSection';
import { BuyerBatchQRModal } from './BuyerBatchQRModal';
import { KisanSetuSupportAssistant } from '../support/KisanSetuSupportAssistant';
import { FloatingHelpButton } from '../support/FloatingHelpButton';
import { UserSupportHistoryView } from '../support/UserSupportHistoryView';

interface BuyerDashboardProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onSwitchToFarmerPortal?: () => void;
  onLogout?: () => void;
  buyerProfile?: BuyerProfile;
  onOpenLogin?: (role?: 'farmer' | 'buyer') => void;
  initialTab?: ExtendedBuyerTab;
}

export type ExtendedBuyerTab = BuyerTab | 'product-detail' | 'farmer-profile';

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  currentLanguage,
  onSelectLanguage,
  onSwitchToFarmerPortal,
  onLogout,
  buyerProfile: initialBuyerProfileProp,
  onOpenLogin,
  initialTab = 'home',
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const isHi = currentLanguage === 'hi';

  // Active Tab & Page Navigation
  const [activeTab, setActiveTab] = useState<ExtendedBuyerTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [showTopNotification, setShowTopNotification] = useState(true);

  // Core Data States
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(initialBuyerProfileProp || null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(!initialBuyerProfileProp);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);

  const [products, setProducts] = useState<MarketplaceProduct[]>(INITIAL_MARKETPLACE_PRODUCTS);
  const [featuredFarmers, setFeaturedFarmers] = useState(INITIAL_FEATURED_FARMERS);
  const [isSyncingMarketplace, setIsSyncingMarketplace] = useState<boolean>(false);
  const [lastMarketplaceSync, setLastMarketplaceSync] = useState<Date | null>(null);
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [priceLocks, setPriceLocks] = useState<PriceLockProposal[]>(INITIAL_PRICE_LOCKS);
  const [futureDemands, setFutureDemands] = useState<FutureDemandPost[]>(INITIAL_FUTURE_DEMANDS);
  const [traceabilityBatches, setTraceabilityBatches] = useState<BatchTraceabilityInfo[]>(
    Object.values(INITIAL_BATCH_TRACEABILITY)
  );
  const [messageThreads, setMessageThreads] = useState<BuyerMessageThread[]>([]);
  const [priceWatches, setPriceWatches] = useState<PriceWatchItem[]>(INITIAL_PRICE_WATCHES);

  // Central Real-time Marketplace Data Loader (synchronizes all farmer listings with buyers)
  const loadMarketplaceData = useCallback(async (silent = true) => {
    if (!silent) setIsSyncingMarketplace(true);
    try {
      const [listingsRes, farmersRes] = await Promise.all([
        fetchMarketplaceListingsApi(),
        fetchMarketplaceFarmersApi(),
      ]);

      if (listingsRes.success && Array.isArray(listingsRes.products)) {
        setProducts(listingsRes.products);
        setLastMarketplaceSync(new Date());
      }
      if (farmersRes.success && Array.isArray(farmersRes.farmers) && farmersRes.farmers.length > 0) {
        setFeaturedFarmers(farmersRes.farmers);
      }
    } catch (err) {
      console.warn('[Marketplace Sync] Error fetching latest crops:', err);
    } finally {
      if (!silent) setIsSyncingMarketplace(false);
    }
  }, []);

  // Real-time synchronization listeners (polling, window focus, CustomEvents, BroadcastChannel)
  useEffect(() => {
    loadMarketplaceData(false);

    const pollInterval = setInterval(() => {
      loadMarketplaceData(true);
    }, 5000);

    const onFocus = () => loadMarketplaceData(true);
    const onMarketplaceUpdated = () => loadMarketplaceData(false);

    window.addEventListener('focus', onFocus);
    window.addEventListener('kisansetu_marketplace_updated', onMarketplaceUpdated);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('kisansetu_marketplace');
      bc.onmessage = () => {
        loadMarketplaceData(false);
      };
    } catch {}

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('kisansetu_marketplace_updated', onMarketplaceUpdated);
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
    };
  }, [loadMarketplaceData]);

  // Tab switch sync for marketplace tabs
  useEffect(() => {
    if (activeTab === 'home' || activeTab === 'browse' || activeTab === 'smart-buy') {
      loadMarketplaceData(true);
    }
  }, [activeTab, loadMarketplaceData]);

  // Reusable profile and data loader
  const loadBuyerData = async () => {
    setIsLoadingProfile(true);
    setProfileLoadError(null);

    try {
      if (initialBuyerProfileProp) {
        setBuyerProfile(initialBuyerProfileProp);
      }

      const profileRes = await fetchBuyerProfileApi();

      if (profileRes.success && (profileRes.profile || profileRes.user)) {
        const prof = (profileRes.profile || profileRes.user) as BuyerProfile;
        setBuyerProfile(prof);

        // Concurrently fetch orders, requirements, and messages for this authenticated buyer
        const [ordersRes, reqRes, msgRes] = await Promise.all([
          fetchBuyerOrdersApi(),
          fetchBuyerRequirementsApi(),
          fetchBuyerMessagesApi(),
        ]);

        if (ordersRes.success && Array.isArray(ordersRes.orders)) {
          setOrders(ordersRes.orders);
        } else if (ordersRes.success) {
          setOrders([]);
        }

        if (reqRes.success && Array.isArray(reqRes.requirements)) {
          setRequirements(reqRes.requirements);
        } else if (reqRes.success) {
          setRequirements([]);
        }

        if (msgRes.success && Array.isArray(msgRes.threads)) {
          setMessageThreads(msgRes.threads);
        } else if (msgRes.success) {
          setMessageThreads([]);
        }
      } else {
        if (!initialBuyerProfileProp) {
          setProfileLoadError(profileRes.message || 'Authenticated buyer profile could not be loaded.');
        }
      }
    } catch (err: any) {
      if (!initialBuyerProfileProp) {
        setProfileLoadError(err?.message || 'Error communicating with buyer service.');
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadBuyerData();
  }, [initialBuyerProfileProp]);

  // Cart & Favorites — strictly unified in central database per authenticated buyer
  const [cartItems, setCartItems] = useState<BuyerCartItem[]>([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(new Set());
  const [isCartLoaded, setIsCartLoaded] = useState<boolean>(false);
  const [isFavoritesLoaded, setIsFavoritesLoaded] = useState<boolean>(false);

  // Load buyer-specific cart items and favorites directly from centralized database on profile load
  useEffect(() => {
    let isCancelled = false;
    if (buyerProfile?.id) {
      // 1. Initial fast local cache read for immediate offline display
      try {
        const storedCart = localStorage.getItem(`kisansetu_cart_${buyerProfile.id}`);
        if (storedCart) setCartItems(JSON.parse(storedCart));
        const storedFavs = localStorage.getItem(`kisansetu_favs_${buyerProfile.id}`);
        if (storedFavs) setFavoriteProductIds(new Set(JSON.parse(storedFavs)));
      } catch {}

      // 2. Fetch authoritative database state from unified backend
      fetchBuyerCartApi(buyerProfile.id).then((res) => {
        if (!isCancelled && res.success && Array.isArray(res.cart)) {
          setCartItems(res.cart);
          setIsCartLoaded(true);
        }
      });

      fetchBuyerFavoritesApi(buyerProfile.id).then((res) => {
        if (!isCancelled && res.success && Array.isArray(res.favorites)) {
          setFavoriteProductIds(new Set(res.favorites));
          setIsFavoritesLoaded(true);
        }
      });
    } else {
      setCartItems([]);
      setFavoriteProductIds(new Set());
      setIsCartLoaded(false);
      setIsFavoritesLoaded(false);
    }
    return () => {
      isCancelled = true;
    };
  }, [buyerProfile?.id]);

  // Persist buyer-specific cart items to unified backend database whenever cart changes
  useEffect(() => {
    if (buyerProfile?.id && isCartLoaded) {
      saveBuyerCartApi(cartItems, buyerProfile.id).catch(() => {});
      try {
        localStorage.setItem(`kisansetu_cart_${buyerProfile.id}`, JSON.stringify(cartItems));
      } catch {}
    }
  }, [cartItems, buyerProfile?.id, isCartLoaded]);

  // Persist buyer-specific favorites to unified backend database whenever favorites change
  useEffect(() => {
    if (buyerProfile?.id && isFavoritesLoaded) {
      saveBuyerFavoritesApi(Array.from(favoriteProductIds), buyerProfile.id).catch(() => {});
      try {
        localStorage.setItem(
          `kisansetu_favs_${buyerProfile.id}`,
          JSON.stringify(Array.from(favoriteProductIds))
        );
      } catch {}
    }
  }, [favoriteProductIds, buyerProfile?.id, isFavoritesLoaded]);

  // Filter Panel Open State — CLOSED BY DEFAULT on both Desktop & Mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<BuyerFilterState>({
    category: 'all',
    location: '',
    crop: '',
    variety: '',
    minPrice: 0,
    maxPrice: 200,
    grade: '',
    farmer: '',
    verifiedOnly: false,
    minQuantity: 0,
  });
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Modals state
  const [smartBuyModalProduct, setSmartBuyModalProduct] = useState<MarketplaceProduct | null>(null);
  const [isSmartBuyModalOpen, setIsSmartBuyModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedBatchIdForQR, setSelectedBatchIdForQR] = useState<string | null>(null);
  const [activeMessageThreadId, setActiveMessageThreadId] = useState<string | undefined>(undefined);
  const [isSupportAssistantOpen, setIsSupportAssistantOpen] = useState(false);
  const [supportAssistantPrompt, setSupportAssistantPrompt] = useState<string | undefined>(undefined);

  // Browser Routing & History Event Listener
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (state?.tab === 'product-detail' && state.productId) {
        setSelectedProductId(state.productId);
        setActiveTab('product-detail');
      } else if (state?.tab === 'farmer-profile' && state.farmerId) {
        setSelectedFarmerId(state.farmerId);
        setActiveTab('farmer-profile');
      } else if (state?.tab) {
        setActiveTab(state.tab);
        setSelectedProductId(null);
        setSelectedFarmerId(null);
      } else {
        setActiveTab('home');
        setSelectedProductId(null);
        setSelectedFarmerId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAiAssistant = (initialPrompt?: string) => {
    setSupportAssistantPrompt(initialPrompt);
    setIsSupportAssistantOpen(true);
  };

  const handleSupportNavigate = (actionType: string) => {
    if (actionType === 'NAVIGATE_MARKETPLACE') {
      navigateToTab('browse');
    } else if (actionType === 'NAVIGATE_ORDERS') {
      navigateToTab('orders');
    } else if (actionType === 'NAVIGATE_REQUIREMENTS') {
      navigateToTab('procurement');
    } else if (actionType === 'NAVIGATE_PROFILE') {
      navigateToTab('profile');
    } else if (actionType === 'NAVIGATE_ADD_CROP' && onSwitchToFarmerPortal) {
      onSwitchToFarmerPortal();
    }
  };

  // Navigations with history support
  const navigateToTab = (tab: ExtendedBuyerTab) => {
    setSelectedProductId(null);
    setSelectedFarmerId(null);
    setActiveTab(tab);
    window.history.pushState({ tab }, '', tab === 'home' ? '#' : `#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (product: MarketplaceProduct) => {
    setSelectedProductId(product.id);
    setActiveTab('product-detail');
    window.history.pushState({ tab: 'product-detail', productId: product.id }, '', `#product/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToFarmer = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    setActiveTab('farmer-profile');
    window.history.pushState({ tab: 'farmer-profile', farmerId }, '', `#farmer/${farmerId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBack = () => {
    if (window.history.state && window.history.state.tab) {
      window.history.back();
    } else {
      navigateToTab('browse');
    }
  };

  // Dynamic Options derived from Products and Reference Database
  const availableLocations = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.location.split(',')[1]?.trim() || p.location))).filter(Boolean);
  }, [products]);

  const availableCrops: FilterCropOption[] = useMemo(() => {
    return getAvailableFilterCrops(products);
  }, [products]);

  const availableVarieties: FilterVarietyOption[] = useMemo(() => {
    return getVarietiesForCrop(filters.crop, products);
  }, [filters.crop, products]);

  const availableFarmers = useMemo(() => {
    const map = new Map<string, { id: string; name: string; location: string }>();
    products.forEach((p) => {
      if (!map.has(p.farmerId)) {
        map.set(p.farmerId, { id: p.farmerId, name: p.farmerName, location: p.location });
      }
    });
    return Array.from(map.values());
  }, [products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          p.crop.toLowerCase().includes(q) ||
          p.variety.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Category
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'Other') {
          if (p.category === 'Grains' || p.category === 'Fruits' || p.category === 'Vegetables') return false;
        } else if (p.category !== filters.category) {
          return false;
        }
      }

      // 3. Location
      if (filters.location && !p.location.includes(filters.location)) {
        return false;
      }

      // 4. Crop and Variety Matching with strict dependency
      if (!matchesCropAndVariety(p, filters.crop, filters.variety)) {
        return false;
      }

      // 5. Price
      if (filters.minPrice && p.pricePerKg < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && p.pricePerKg > filters.maxPrice) {
        return false;
      }

      // 6. Grade
      if (filters.grade && p.grade !== filters.grade) {
        return false;
      }

      // 7. Farmer
      if (filters.farmer && p.farmerId !== filters.farmer) {
        return false;
      }

      // 8. Verified Only
      if (filters.verifiedOnly && !p.farmerVerified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'lowestPrice') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'largestPrice') return b.pricePerKg - a.pricePerKg;
      if (sortBy === 'nearestFarmer') {
        const distA = a.distanceKm !== undefined ? a.distanceKm : 999999;
        const distB = b.distanceKm !== undefined ? b.distanceKm : 999999;
        return distA - distB;
      }
      if (sortBy === 'recentlyAdded') {
        const timeA = a.createdTimestamp || (a.createdAt ? Date.parse(a.createdAt) : 0);
        const timeB = b.createdTimestamp || (b.createdAt ? Date.parse(b.createdAt) : 0);
        return timeB - timeA;
      }
      // default: recommended by opportunity score
      return (b.purchaseOpportunityScore || 0) - (a.purchaseOpportunityScore || 0);
    });
  }, [products, searchQuery, filters, sortBy]);

  // Cart Operations
  const handleAddToCart = (product: MarketplaceProduct, quantityKg: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantityKg: Math.min(product.availableQuantityKg, item.quantityKg + quantityKg) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          crop: product.crop,
          variety: product.variety,
          grade: product.grade,
          quantityKg,
          pricePerKg: product.pricePerKg,
          farmerId: product.farmerId,
          farmerName: product.farmerName,
          imageUrl: product.imageUrl,
          availableQuantityKg: product.availableQuantityKg,
          batchId: product.batchId,
        },
      ];
    });
  };

  const handleBuyNow = (product: MarketplaceProduct, quantityKg: number) => {
    handleAddToCart(product, quantityKg);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantityKg: newQuantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavoriteProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  // Farmer Messaging
  const handleOpenMessageWithFarmer = (farmerId: string, cropName: string) => {
    const existingThread = messageThreads.find((t) => t.farmerId === farmerId);
    if (existingThread) {
      setActiveMessageThreadId(existingThread.id);
    } else {
      const farmer = featuredFarmers.find((f) => f.farmerId === farmerId);
      const newThread: BuyerMessageThread = {
        id: `THR-${Date.now()}`,
        farmerId,
        farmerName: farmer?.name || 'Farmer',
        farmerLocation: farmer?.location || 'India',
        farmerAvatar: farmer?.avatar,
        cropContext: cropName,
        unread: false,
        lastMessage: `Hello ${farmer?.name || 'Farmer'}, I am interested in procuring ${cropName}.`,
        lastMessageTime: 'Just now',
        messages: [
          {
            id: `M-${Date.now()}`,
            sender: 'buyer',
            text: `Hello ${farmer?.name || 'Farmer'}, I am interested in procuring ${cropName}. Is this lot currently available for dispatch?`,
            timestamp: 'Just now',
          },
        ],
      };
      setMessageThreads((prev) => [newThread, ...prev]);
      setActiveMessageThreadId(newThread.id);
      sendBuyerMessageApi(
        newThread.id,
        newThread.messages[0].text,
        farmerId,
        cropName,
        farmer?.name,
        farmer?.location
      ).catch(() => {});
    }
    navigateToTab('messages');
  };

  const handleSendMessage = async (threadId: string, text: string) => {
    const thread = messageThreads.find((t) => t.id === threadId);
    setMessageThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text,
            lastMessageTimestamp: 'Just now',
            messages: [
              ...t.messages,
              {
                id: `M-${Date.now()}`,
                sender: 'buyer',
                text,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return t;
      })
    );

    try {
      await sendBuyerMessageApi(
        threadId,
        text,
        thread?.farmerId,
        thread?.cropContext,
        thread?.farmerName,
        thread?.farmerLocation
      );
    } catch (e) {
      console.error('Failed to sync buyer message to API:', e);
    }
  };

  const handleUpdateProfile = async (updated: Partial<BuyerProfile>) => {
    try {
      const res = await updateBuyerProfileApi(updated);
      if (res.success && res.profile) {
        setBuyerProfile(res.profile);
      } else {
        setBuyerProfile((prev) => (prev ? { ...prev, ...updated } : null));
      }
    } catch {
      setBuyerProfile((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      location: '',
      crop: '',
      variety: '',
      minPrice: 0,
      maxPrice: 200,
      grade: '',
      farmer: '',
      verifiedOnly: false,
      minQuantity: 0,
    });
    setSearchQuery('');
  };

  const activeFiltersCount = [
    filters.crop ? 1 : 0,
    filters.variety ? 1 : 0,
    filters.location ? 1 : 0,
    filters.grade ? 1 : 0,
    filters.farmer ? 1 : 0,
    filters.verifiedOnly ? 1 : 0,
    filters.category !== 'all' ? 1 : 0,
    filters.minPrice > 0 || filters.maxPrice < 200 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Computed Current Product / Farmer
  const currentProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find((p) => p.id === selectedProductId) || null;
  }, [selectedProductId, products]);

  const selectedFarmerData = useMemo(() => {
    if (!selectedFarmerId) return undefined;
    const found = featuredFarmers.find((f) => f.farmerId === selectedFarmerId);
    if (found) return found;
    const prod = products.find((p) => p.farmerId === selectedFarmerId);
    if (prod) {
      return {
        farmerId: prod.farmerId,
        name: prod.farmerName,
        location: prod.location,
        verified: prod.farmerVerified,
        rating: prod.farmerRating || 4.8,
        completedDeals: 18,
        soilHealthCardCertified: true,
        nearestMandi: prod.location.split(',')[0] || 'Bareilly Mandi',
      };
    }
    return undefined;
  }, [selectedFarmerId, featuredFarmers, products]);

  const selectedFarmerProducts = useMemo(() => {
    if (!selectedFarmerId) return [];
    return products.filter((p) => p.farmerId === selectedFarmerId);
  }, [selectedFarmerId, products]);

  const selectedBatchInfo = useMemo(() => {
    if (!selectedBatchIdForQR) return undefined;
    return traceabilityBatches.find((b) => b.batchId === selectedBatchIdForQR);
  }, [selectedBatchIdForQR, traceabilityBatches]);

  // Loading state: When authenticating/fetching real buyer database records
  if (isLoadingProfile && !buyerProfile) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#245C3A] text-white flex items-center justify-center mb-4 shadow-lg animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-black text-[#26332B] tracking-tight mb-2">
          {isHi ? 'सत्यापित खरीदार प्रोफ़ाइल लोड हो रही है...' : 'Loading Verified Buyer Account...'}
        </h2>
        <p className="text-sm text-[#68736B] max-w-md">
          {isHi
            ? 'कृपया प्रतीक्षा करें, आपके पंजीकृत डेटाबेस रिकॉर्ड से विवरण प्राप्त किया जा रहा है।'
            : 'Connecting to database and verifying buyer session credentials.'}
        </p>
      </div>
    );
  }

  // Error/Empty state: If authenticated buyer record is unavailable
  if ((profileLoadError || !buyerProfile) && !isLoadingProfile) {
    return (
      <div className="min-h-screen bg-[#FBFAF4] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center mb-4 text-amber-700 shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-[#26332B] mb-2">
          {isHi ? 'खरीदार प्रोफ़ाइल लोड नहीं हो सकी' : 'Unable to Load Buyer Profile'}
        </h2>
        <p className="text-xs text-red-600 mb-6 max-w-sm">
          {profileLoadError || (isHi ? 'सत्यापित खरीदार प्रोफ़ाइल उपलब्ध नहीं है। कृपया पुनः साइन इन करें।' : 'Authenticated buyer session is not available. Please sign in again.')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              loadBuyerData();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold hover:bg-[#1B432B] transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isHi ? 'पुनः प्रयास करें' : 'Retry'}</span>
          </button>
          {onOpenLogin && (
            <button
              onClick={() => onOpenLogin('buyer')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D6A63A] text-white text-xs font-bold hover:bg-[#C09228] transition-colors cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isHi ? 'खरीदार लॉगिन' : 'Sign In as Buyer'}</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#D5DDD2] text-[#26332B] text-xs font-bold hover:bg-[#FAF7F0] transition-colors cursor-pointer shadow-xs"
            >
              {isHi ? 'मुख्य पृष्ठ पर लौटें' : 'Back to Home'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#26332B] flex flex-col font-sans selection:bg-[#245C3A] selection:text-white pb-20 lg:pb-0">
      
      {/* 1. Top Notification Bar */}
      {showTopNotification && (
        <BuyerTopNotification
          currentLanguage={currentLanguage}
          onAction={() => navigateToTab('browse')}
          onDismiss={() => setShowTopNotification(false)}
        />
      )}

      {/* 2. Simplified Buyer Navbar: Search, Home, Cart, Language, Menu */}
      <BuyerNavbar
        currentLanguage={currentLanguage}
        onSelectLanguage={onSelectLanguage}
        activeTab={activeTab === 'product-detail' || activeTab === 'farmer-profile' ? 'home' : (activeTab as BuyerTab)}
        onSelectTab={(tab) => navigateToTab(tab)}
        buyerProfile={buyerProfile}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSwitchToFarmerPortal={onSwitchToFarmerPortal}
        onLogout={onLogout}
        onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
        onOpenAiAssistant={handleOpenAiAssistant}
        onOpenPostRequirement={() => navigateToTab('procurement')}
        onOpenSmartBuy={() => {
          setSmartBuyModalProduct(products[0]);
          setIsSmartBuyModalOpen(true);
        }}
      />

      {/* 3. Welcome Bar & Trust Badges */}
      {(activeTab === 'home' || activeTab === 'browse') && (
        <BuyerWelcomeBar
          buyerProfile={buyerProfile}
          currentLanguage={currentLanguage}
          onSelectTab={(tab) => navigateToTab(tab)}
          onOpenPostRequirementModal={() => navigateToTab('procurement')}
          onOpenSmartBuyModal={() => {
            setSmartBuyModalProduct(products[0]);
            setIsSmartBuyModalOpen(true);
          }}
        />
      )}

      {/* 4. Visual Category Navigation Bar (Grains, Fruits, Other Crops - Vegetables hidden from UI) */}
      {(activeTab === 'home' || activeTab === 'browse') && (
        <BuyerCategoryNav
          selectedCategory={filters.category}
          onSelectCategory={(cat) => {
            setFilters((prev) => ({
              ...prev,
              category: cat,
              crop: '',
              variety: '',
            }));
            if (activeTab !== 'browse' && activeTab !== 'home') {
              navigateToTab('browse');
            }
          }}
          currentLanguage={currentLanguage}
        />
      )}

      {/* 5. Main Screen Content Routing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
        
        {/* VIEW: DEDICATED PRODUCT DETAIL PAGE */}
        {activeTab === 'product-detail' && currentProduct && (
          <BuyerProductDetailPage
            product={currentProduct}
            allProducts={products}
            currentLanguage={currentLanguage}
            onBack={navigateBack}
            onAddToCart={handleAddToCart}
            onBuyNow={(prod, qty) => {
              handleAddToCart(prod, qty);
              setIsCartOpen(true);
            }}
            onSelectProduct={navigateToProduct}
            onSelectFarmerProfile={navigateToFarmer}
            onOpenMessageWithFarmer={handleOpenMessageWithFarmer}
            onOpenBatchQR={(bId) => setSelectedBatchIdForQR(bId)}
            onOpenSmartBuyModal={(p) => {
              setSmartBuyModalProduct(p);
              setIsSmartBuyModalOpen(true);
            }}
            isFavorite={favoriteProductIds.has(currentProduct.id)}
            onToggleFavorite={handleToggleFavorite}
            buyerLocation={buyerProfile?.location || 'Bareilly APMC Mandi, Bareilly, Uttar Pradesh'}
            buyerDistrict={buyerProfile?.district || 'Bareilly'}
          />
        )}

        {/* VIEW: DEDICATED FARMER PROFILE PAGE */}
        {activeTab === 'farmer-profile' && selectedFarmerId && (
          <BuyerFarmerProfilePage
            farmerId={selectedFarmerId}
            farmerData={selectedFarmerData}
            farmerProducts={selectedFarmerProducts}
            currentLanguage={currentLanguage}
            onBack={navigateBack}
            onSelectProduct={navigateToProduct}
            onAddToCart={handleAddToCart}
            onMessageFarmer={handleOpenMessageWithFarmer}
            favoriteProductIds={favoriteProductIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* VIEW: HOME & BROWSE PRODUCE */}
        {(activeTab === 'home' || activeTab === 'browse') && (
          <div className="space-y-6">
            
            {/* Clean Category Section Heading */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-black text-[#26332B] tracking-tight">
                  {filters.category === 'Vegetables'
                    ? (isHi ? 'ताज़ी सब्ज़ियाँ' : 'Fresh Vegetables')
                    : filters.category === 'Grains'
                    ? (isHi ? 'अनाज / खाद्यान्न' : 'Grains & Cereals')
                    : filters.category === 'Fruits'
                    ? (isHi ? 'ताज़ा फल' : 'Fresh Fruits')
                    : filters.category === 'Other'
                    ? (isHi ? 'अन्य फसलें' : 'Other Farm Crops')
                    : (isHi ? 'ताज़ा कृषि उत्पाद' : 'Fresh Farm Lots')}
                </h2>
                <span className="text-xs font-semibold text-[#68736B] bg-[#F4EFE6] px-2 py-0.5 rounded-full border border-[#D5DDD2]">
                  {filteredProducts.length} {isHi ? 'लॉट' : 'lots'}
                </span>
              </div>
              {filters.category && filters.category !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                  className="text-xs font-bold text-[#245C3A] hover:text-[#1C4B2E] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{isHi ? 'सभी देखें' : 'View All'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Produce Marketplace Toolbar with Filter Button & Sorting */}
            <div className="bg-white rounded-2xl border border-[#E3DCB] p-3.5 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Collapsible Filter Button */}
                <button
                  id="marketplace-filter-toggle"
                  onClick={() => {
                    // On desktop toggle panel; on mobile open modal
                    if (window.innerWidth >= 1024) {
                      setIsFilterOpen((prev) => !prev);
                    } else {
                      setIsMobileFilterOpen(true);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                    isFilterOpen
                      ? 'bg-[#245C3A] text-white border-[#245C3A] shadow-xs'
                      : 'bg-[#FBFAF4] text-[#245C3A] border-[#D5DDD2] hover:bg-[#EEF3E8] hover:border-[#245C3A]'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{t.filters.title}</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-white text-[#245C3A] text-[10px] font-black">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Active filter summary pill */}
                {filters.crop && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EEF3E8] text-[#245C3A] text-xs font-bold border border-[#245C3A]/20">
                    <span>{filters.crop}</span>
                    {filters.variety && <span className="text-[#5F8F45]">({filters.variety})</span>}
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, crop: '', variety: '' }))}
                      className="hover:text-red-500 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-bold text-[#D6A63A] hover:text-[#9E6D14] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.filters.clearAll}</span>
                  </button>
                )}
              </div>

              {/* Sorting & Results Count & Live Sync */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Live Sync badge */}
                <div 
                  id="marketplace-live-sync-indicator"
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#EBF4E5] text-[#245C3A] text-[11px] font-bold border border-[#CDE1BF]"
                  title={lastMarketplaceSync ? `${isHi ? 'अंतिम अपडेट' : 'Last synced'}: ${lastMarketplaceSync.toLocaleTimeString()}` : 'Live synced'}
                >
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
                  <span className="hidden sm:inline">{isHi ? 'लाइव सिंक' : 'Live Sync'}</span>
                </div>

                {/* Manual refresh button */}
                <button
                  id="marketplace-refresh-btn"
                  type="button"
                  onClick={() => loadMarketplaceData(false)}
                  disabled={isSyncingMarketplace}
                  title={isHi ? 'मंडी के सभी किसान लॉट ताज़ा करें' : 'Refresh real-time farmer listings'}
                  className="px-2.5 py-1.5 rounded-xl border border-[#D5DDD2] bg-[#FBFAF4] hover:bg-[#EEF3E8] hover:border-[#245C3A] text-[#245C3A] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMarketplace ? 'animate-spin text-[#245C3A]' : ''}`} />
                  <span className="hidden md:inline">{isHi ? 'ताज़ा करें' : 'Refresh'}</span>
                </button>

                <span className="text-xs font-semibold text-[#68736B]">
                  {filteredProducts.length} {isHi ? 'लॉट उपलब्ध' : 'lots available'}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#68736B] hidden sm:inline">{t.filters.sortBy}:</span>
                  <select
                    id="marketplace-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl text-xs font-bold text-[#26332B] focus:border-[#245C3A] focus:outline-hidden cursor-pointer"
                  >
                    <option value="recommended">{t.sorting.recommended}</option>
                    <option value="lowestPrice">{t.sorting.lowestPrice}</option>
                    <option value="largestPrice">{t.sorting.largestPrice}</option>
                    <option value="nearestFarmer">{t.sorting.nearestFarmer}</option>
                    <option value="recentlyAdded">{t.sorting.recentlyAdded}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Marketplace Grid with Optional Collapsible Left Filter Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Filter Sidebar (Desktop 3.5 cols - Collapsible, CLOSED by default) */}
              {isFilterOpen && (
                <div className="hidden lg:block lg:col-span-4 xl:col-span-3.5 transition-all">
                  <BuyerFilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearFilters={handleClearFilters}
                    availableLocations={availableLocations}
                    availableCrops={availableCrops}
                    availableVarieties={availableVarieties}
                    availableFarmers={availableFarmers}
                    currentLanguage={currentLanguage}
                    featuredFarmers={featuredFarmers}
                    onSelectFarmerProfile={navigateToFarmer}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    onClose={() => setIsFilterOpen(false)}
                  />
                </div>
              )}

              {/* Right/Full Column: Marketplace Catalog (Expands to 12 cols when filter is closed) */}
              <div className={`${isFilterOpen ? 'lg:col-span-8 xl:col-span-8.5' : 'lg:col-span-12'} space-y-6 transition-all`}>
                
                {/* Save the Harvest Section (Food Waste Mitigation) */}
                <BuyerSaveTheHarvestSection
                  products={products}
                  currentLanguage={currentLanguage}
                  onSelectProduct={navigateToProduct}
                />

                {/* Produce Product Cards Grid */}
                {filteredProducts.length > 0 ? (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${isFilterOpen ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-5`}>
                    {filteredProducts.map((product) => (
                      <BuyerProductCard
                        key={product.id}
                        product={product}
                        currentLanguage={currentLanguage}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onViewDetails={navigateToProduct}
                        onSelectFarmerProfile={navigateToFarmer}
                        isFavorite={favoriteProductIds.has(product.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#E3DCB] p-12 text-center text-[#8D9B91] space-y-3">
                    <span className="text-4xl">🌾</span>
                    <h4 className="text-base font-bold text-[#26332B]">
                      {searchQuery.trim()
                        ? (isHi ? 'कोई समर्थित फसल नहीं मिली (No supported produce found)' : 'No supported produce found')
                        : t.sections.noProductsFound}
                    </h4>
                    <p className="text-xs max-w-sm mx-auto">
                      {searchQuery.trim()
                        ? (isHi
                            ? `"${searchQuery}" के लिए कोई समर्थित फसल नहीं मिली। किसानसेतु पर केवल स्वीकृत 4 फसलें (गेहूं, धान, मक्का, दालें/चना) समर्थित हैं।`
                            : `No supported produce found for "${searchQuery}". KisanSetu currently supports only 4 approved crops: Wheat, Rice / Paddy, Maize, and Pulses / Chana.`)
                        : (isHi 
                            ? 'चयनित फसल या फिल्टर के लिए कोई उत्पाद नहीं मिला। कृपया फिल्टर रीसेट करें।'
                            : 'No farm lots match your active filters. Try adjusting or clearing filters to view all available harvests.')}
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 rounded-xl bg-[#245C3A] text-white text-xs font-bold transition-all hover:bg-[#1C4B2E] cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.filters.clearAll}</span>
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* VIEW: MY PROCUREMENT DESK */}
        {activeTab === 'procurement' && (
          <BuyerProcurementView
            currentLanguage={currentLanguage}
            requirements={requirements}
            onAddRequirement={async (newReq) => {
              const reqObj: BuyerRequirement = {
                ...newReq,
                id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
                createdAt: new Date().toISOString().split('T')[0],
                status: 'Matching',
                matchedFarmersCount: 3,
                matchedQuantityKg: 1500,
                matchScore: 94,
                matchedFarmers: [],
                buyerId: buyerProfile?.id || '',
              };
              try {
                const res = await createBuyerRequirementApi(reqObj);
                if (res.success && res.requirement) {
                  setRequirements((prev) => [res.requirement!, ...prev]);
                } else {
                  setRequirements((prev) => [reqObj, ...prev]);
                }
              } catch {
                setRequirements((prev) => [reqObj, ...prev]);
              }
            }}
            priceLocks={priceLocks}
            onAddPriceLock={(newLock) => {
              const lockObj: PriceLockProposal = {
                ...newLock,
                id: `PL-${Date.now()}`,
                status: 'Proposed by Buyer',
                contractReference: `KS-CONTRACT-${Date.now().toString().slice(-4)}`,
                createdAt: '2026-09-01',
              };
              setPriceLocks((prev) => [lockObj, ...prev]);
            }}
            futureDemands={futureDemands}
            onAddFutureDemand={(newDemand) => {
              const demandObj: FutureDemandPost = {
                ...newDemand,
                id: `FD-${Date.now()}`,
                postedDate: '2026-09-01',
                farmerInterestsCount: 0,
                status: 'Active',
              };
              setFutureDemands((prev) => [demandObj, ...prev]);
            }}
            traceabilityBatches={traceabilityBatches}
            onOpenBatchQR={(bId) => setSelectedBatchIdForQR(bId)}
            onApprovePooledOrder={async (reqId) => {
              try {
                await updateBuyerRequirementStatusApi(reqId, 'Fulfilled');
              } catch (e) {
                console.error(e);
              }
              setRequirements((prev) =>
                prev.map((r) => (r.id === reqId ? { ...r, status: 'Fulfilled' } : r))
              );
            }}
          />
        )}

        {/* VIEW: ORDERS */}
        {activeTab === 'orders' && (
          <BuyerOrdersView
            orders={orders}
            currentLanguage={currentLanguage}
            onBrowseMore={() => navigateToTab('browse')}
          />
        )}

        {/* VIEW: MESSAGES */}
        {activeTab === 'messages' && (
          <BuyerMessagesView
            threads={messageThreads}
            currentLanguage={currentLanguage}
            onSendMessage={handleSendMessage}
            activeThreadId={activeMessageThreadId}
            onSelectThread={(id) => setActiveMessageThreadId(id)}
          />
        )}

        {/* VIEW: PROFILE */}
        {activeTab === 'profile' && (
          <BuyerProfileView
            profile={buyerProfile!}
            onUpdateProfile={handleUpdateProfile}
            currentLanguage={currentLanguage}
          />
        )}

        {/* VIEW: SUPPORT */}
        {activeTab === 'support' && (
          <UserSupportHistoryView
            userId={buyerProfile?.id || 'BUYER'}
            userName={buyerProfile?.businessName || buyerProfile?.name || 'Buyer'}
            userRole="buyer"
            currentLanguage={currentLanguage}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

      </main>

      {/* Floating 🤖 Help button */}
      <FloatingHelpButton
        currentLanguage={currentLanguage}
        onClick={() => handleOpenAiAssistant()}
      />

      {/* Unified AI Support Assistant Modal */}
      <KisanSetuSupportAssistant
        isOpen={isSupportAssistantOpen}
        onClose={() => setIsSupportAssistantOpen(false)}
        currentLanguage={currentLanguage}
        userContext={{
          userId: buyerProfile?.id || 'BUYER',
          userName: buyerProfile?.businessName || buyerProfile?.name || 'Buyer',
          userRole: 'buyer',
          userPhone: buyerProfile?.mobile || '',
          userEmail: buyerProfile?.email || '',
          token: (typeof window !== 'undefined' ? (localStorage.getItem('kisansetu_auth_token') || localStorage.getItem('token')) : undefined) || undefined,
        }}
        initialPrompt={supportAssistantPrompt}
        onNavigateAction={handleSupportNavigate}
      />

      {/* Modals Layer */}
      
      {/* Smart Buy Modal */}
      <BuyerSmartBuyModal
        isOpen={isSmartBuyModalOpen}
        onClose={() => setIsSmartBuyModalOpen(false)}
        product={smartBuyModalProduct || products[0]}
        currentLanguage={currentLanguage}
        priceWatches={priceWatches}
        onAddPriceWatch={(item) => {
          const newWatch: PriceWatchItem = {
            ...item,
            id: `PW-${Date.now()}`,
            createdAt: '2026-09-01',
          };
          setPriceWatches((prev) => [newWatch, ...prev]);
        }}
      />

      {/* Cart & Checkout Drawer */}
      <BuyerCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        buyerProfile={buyerProfile}
        currentLanguage={currentLanguage}
        onPlaceOrder={async (orderData) => {
          const newOrder: BuyerOrder = {
            ...orderData,
            id: `KS-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            createdAt: new Date().toISOString().split('T')[0],
            buyerId: buyerProfile?.id || '',
          };
          try {
            const res = await createBuyerOrderApi(newOrder);
            if (res.success && res.order) {
              setOrders((prev) => [res.order!, ...prev]);
            } else {
              setOrders((prev) => [newOrder, ...prev]);
            }
          } catch {
            setOrders((prev) => [newOrder, ...prev]);
          }

          // Inventory Sync: update locally so product detail and marketplace reflect the purchase immediately
          if (orderData.productId && orderData.quantityKg) {
            setProducts((prevProducts) =>
              prevProducts.map((p) => {
                if (p.id === orderData.productId) {
                  const updatedQty = Math.max(0, p.availableQuantityKg - orderData.quantityKg);
                  return { ...p, availableQuantityKg: updatedQty };
                }
                return p;
              })
            );
          }
        }}
      />

      {/* Mobile Filter Modal */}
      <BuyerMobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        availableLocations={availableLocations}
        availableCrops={availableCrops}
        availableVarieties={availableVarieties}
        currentLanguage={currentLanguage}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Batch QR Modal */}
      <BuyerBatchQRModal
        isOpen={!!selectedBatchIdForQR}
        onClose={() => setSelectedBatchIdForQR(null)}
        batchId={selectedBatchIdForQR}
        batchInfo={selectedBatchInfo}
      />

    </div>
  );
};
