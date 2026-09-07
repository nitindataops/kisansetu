import {
  users,
  activeSessions,
  buyerOrders,
  buyerRequirements,
  buyerMessages,
  farmerCrops,
  adminAuditLogs,
  saveStoreToDisk,
  getAllMarketplaceListings,
  isUserFacingApprovedCrop,
  resolveCanonicalFarmerId,
  resolveCanonicalBuyerId,
  findFarmerUser,
  findBuyerUser,
  CONFIG_ADMIN_EMAIL,
  AdminAuditLog,
  UserRecord,
} from './authService';
import type { CropListing } from '../types/farmer';
import type { BuyerOrder } from '../types/buyer';

/**
 * Validates whether an active session belongs to the Admin.
 */
export function verifyAdminSession(token?: string | null): boolean {
  if (!token) return false;
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
  const session = activeSessions.get(cleanToken);
  if (!session) return false;
  if (session.role !== 'admin') return false;
  if (session.expiresAt < Date.now()) {
    activeSessions.delete(cleanToken);
    return false;
  }
  return true;
}

/**
 * Returns platform overview KPI statistics across Farmer and Buyer portals.
 */
export function getAdminOverviewStats() {
  const farmers = Array.from(users.values()).filter((u) => u.role === 'farmer');
  const buyers = Array.from(users.values()).filter((u) => u.role === 'buyer');
  const listings = getAllMarketplaceListings();
  const activeListings = listings.filter((l: any) => (l.status || '').toLowerCase().includes('available'));
  const soldListings = listings.filter((l: any) => (l.status || '').toLowerCase().includes('sold'));

  // Enquiries count
  const allThreads: any[] = [];
  for (const threads of buyerMessages.values()) {
    allThreads.push(...threads);
  }
  const pendingEnquiries = allThreads.filter(
    (t) => (t as any).status !== 'CLOSED' && (t as any).status !== 'RESOLVED'
  ).length;

  // Orders count
  const allOrdersList: BuyerOrder[] = [];
  for (const orders of buyerOrders.values()) {
    allOrdersList.push(...orders);
  }
  const activeOrders = allOrdersList.filter(
    (o) => {
      const s = (o.status || '').toLowerCase();
      return s === 'pending' || s === 'confirmed' || s === 'processing';
    }
  ).length;
  const completedOrders = allOrdersList.filter(
    (o) => {
      const s = (o.status || '').toLowerCase();
      return s === 'completed' || s === 'delivered';
    }
  ).length;

  // Pending Verifications
  const pendingVerifications = farmers.filter((f) => {
    const p = f.farmerProfile;
    if (!p) return false;
    const vStatus = (p.farmerRegistryVerificationStatus as string) || '';
    return (
      (p as any).eKycStatus !== 'VERIFIED ✓' ||
      vStatus === 'POSSIBLE_MISMATCH' ||
      vStatus === 'SUSPICIOUS_REVIEW' ||
      vStatus === 'pending'
    );
  }).length;

  // Crop-wise stats for canonical crops: Wheat, Rice, Maize, Pulses
  const canonicalCrops = ['Wheat', 'Rice / Paddy', 'Maize', 'Pulses / Chana'];
  const cropStats = canonicalCrops.map((cropName) => {
    const matchingListings = listings.filter((l: any) => {
      const c = (l.name || l.crop || l.category || '').toLowerCase();
      if (cropName === 'Wheat') return c.includes('wheat') || c.includes('gehu');
      if (cropName === 'Rice / Paddy')
        return c.includes('rice') || c.includes('paddy') || c.includes('dhan') || c.includes('basmati');
      if (cropName === 'Maize') return c.includes('maize') || c.includes('corn') || c.includes('makka');
      if (cropName === 'Pulses / Chana')
        return (
          c.includes('pulse') ||
          c.includes('chana') ||
          c.includes('moong') ||
          c.includes('dal') ||
          c.includes('urad')
        );
      return false;
    });
    const totalQtyKg = matchingListings.reduce(
      (sum: number, l: any) => sum + (Number(l.quantityKg ?? l.availableQuantityKg) || 0),
      0
    );
    const matchingOrders = allOrdersList.filter((o: any) => {
      const c = (o.cropName || o.crop || '').toLowerCase();
      if (cropName === 'Wheat') return c.includes('wheat') || c.includes('gehu');
      if (cropName === 'Rice / Paddy')
        return c.includes('rice') || c.includes('paddy') || c.includes('dhan') || c.includes('basmati');
      if (cropName === 'Maize') return c.includes('maize') || c.includes('corn') || c.includes('makka');
      if (cropName === 'Pulses / Chana')
        return (
          c.includes('pulse') ||
          c.includes('chana') ||
          c.includes('moong') ||
          c.includes('dal') ||
          c.includes('urad')
        );
      return false;
    });

    return {
      crop: cropName,
      listingsCount: matchingListings.length,
      availableQuantityKg: totalQtyKg,
      ordersCount: matchingOrders.length,
    };
  });

  return {
    totalFarmers: farmers.length,
    totalBuyers: buyers.length,
    activeListingsCount: activeListings.length,
    soldListingsCount: soldListings.length,
    pendingEnquiriesCount: pendingEnquiries,
    activeOrdersCount: activeOrders,
    completedOrdersCount: completedOrders,
    pendingVerificationsCount: pendingVerifications,
    cropStats,
  };
}

/**
 * Returns all farmers with verification status, land info, and active listing count.
 */
export function getAdminFarmers() {
  const farmers = Array.from(users.values()).filter((u) => u.role === 'farmer');
  return farmers.map((u) => {
    const p = u.farmerProfile;
    const fId = p?.farmerId || resolveCanonicalFarmerId(u.id);
    const crops = farmerCrops.get(fId) || [];
    const activeCropsCount = crops.filter(
      (c) => (c.status as string) !== 'Inactive' && (c as any).available !== false
    ).length;

    let coords: { latitude: number; longitude: number } | null = null;
    for (const c of crops) {
      if (c.coordinates?.latitude && c.coordinates?.longitude) {
        coords = { latitude: c.coordinates.latitude, longitude: c.coordinates.longitude };
        break;
      }
    }

    let verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED' = 'VERIFIED';
    if ((p as any)?.eKycStatus !== 'VERIFIED ✓') {
      verificationStatus = 'PENDING_REVIEW';
    }
    const vStatus = (p?.farmerRegistryVerificationStatus as string) || '';
    if (vStatus === 'UNREADABLE') {
      verificationStatus = 'REJECTED';
    } else if (
      vStatus === 'POSSIBLE_MISMATCH' ||
      vStatus === 'SUSPICIOUS_REVIEW' ||
      vStatus === 'pending'
    ) {
      verificationStatus = 'PENDING_REVIEW';
    }

    return {
      id: u.id,
      farmerId: fId,
      name: p?.name || 'Farmer',
      mobile: p?.mobile || u.mobileNumber,
      email: p?.email || u.email || 'N/A',
      district: p?.district || 'Aligarh',
      village: p?.village || 'Baroli',
      state: 'Uttar Pradesh',
      landAreaAcres: p?.landAreaAcres || p?.totalLandAcres || 0,
      primaryCrops: p?.primaryCrops || ['Wheat', 'Rice / Paddy'],
      verificationStatus,
      rejectionReason: (p as any)?.rejectionReason,
      aadhaarMasked: p?.aadhaarMasked || 'XXXX-XXXX-8492',
      farmerRegistryNumber: p?.farmerRegistryNumber || `REG-UP-2026-${u.id.slice(-4)}`,
      farmerRegistryDocumentUrl: p?.farmerRegistryDocumentUrl,
      activeListingsCount: activeCropsCount,
      registrationDate: u.createdAt,
      status: u.status || 'active',
      coordinates: coords,
    };
  });
}

/**
 * Returns detailed farmer record including crops, orders, and enquiries.
 */
export function getAdminFarmerDetails(farmerId: string) {
  const canonicalId = resolveCanonicalFarmerId(farmerId);
  let user = findFarmerUser(farmerId);
  if (!user) user = findFarmerUser(canonicalId);
  if (!user) return null;

  const p = user.farmerProfile;
  const crops = farmerCrops.get(canonicalId) || [];

  const farmerOrders: BuyerOrder[] = [];
  for (const orders of buyerOrders.values()) {
    for (const o of orders) {
      if (
        o.farmerId === canonicalId ||
        o.farmerId === farmerId ||
        (p?.name && (o as any).farmerName?.toLowerCase() === p.name.toLowerCase())
      ) {
        farmerOrders.push(o);
      }
    }
  }

  const farmerThreads: any[] = [];
  for (const threads of buyerMessages.values()) {
    for (const t of threads) {
      if (t.farmerId === canonicalId || t.farmerId === farmerId) {
        farmerThreads.push(t);
      }
    }
  }

  let coords: { latitude: number; longitude: number } | null = null;
  for (const c of crops) {
    if (c.coordinates?.latitude && c.coordinates?.longitude) {
      coords = { latitude: c.coordinates.latitude, longitude: c.coordinates.longitude };
      break;
    }
  }

  return {
    user: {
      id: user.id,
      farmerId: p?.farmerId || canonicalId,
      name: p?.name || 'Farmer',
      mobile: p?.mobile || user.mobileNumber,
      email: p?.email || user.email || 'N/A',
      address: p?.address || `${p?.village || ''}, ${p?.tehsil || ''}, ${p?.district || ''}, Uttar Pradesh`,
      district: p?.district || 'Aligarh',
      tehsil: p?.tehsil || 'Koil',
      village: p?.village || 'Baroli',
      pincode: p?.pincode || '202001',
      landAreaAcres: p?.landAreaAcres || p?.totalLandAcres || 0,
      totalLandAcres: p?.totalLandAcres || p?.landAreaAcres || 0,
      soilType: p?.soilType || 'Alluvial Loam',
      irrigationSource: p?.irrigationSource || 'Tube well / Canal',
      landType: p?.landType || 'Irrigated Agricultural',
      primaryCrops: p?.primaryCrops || ['Wheat', 'Rice / Paddy'],
      eKycStatus: (p as any)?.eKycStatus || 'VERIFIED ✓',
      kccStatus: p?.kccStatus || 'Active',
      soilHealthStatus: p?.soilHealthStatus || 'Optimal N-P-K',
      memberSince: p?.memberSince || 'January 2025',
      aadhaarMasked: p?.aadhaarMasked || 'XXXX-XXXX-8492',
      farmerRegistryNumber: p?.farmerRegistryNumber,
      farmerRegistryDocumentUrl: p?.farmerRegistryDocumentUrl,
      farmerRegistryFileName: p?.farmerRegistryFileName,
      farmerRegistryVerificationStatus: p?.farmerRegistryVerificationStatus,
      rejectionReason: (p as any)?.rejectionReason,
      status: user.status || 'active',
      registrationDate: user.createdAt,
      coordinates: coords,
      properties: p?.properties || [],
      bankDetails: p?.bankDetails,
    },
    crops,
    orders: farmerOrders,
    enquiries: farmerThreads,
  };
}

/**
 * Updates a farmer's verification status (Approve / Reject / Pending).
 */
export function updateFarmerVerification(
  farmerId: string,
  status: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED',
  reason?: string,
  adminEmail: string = CONFIG_ADMIN_EMAIL
) {
  const canonicalId = resolveCanonicalFarmerId(farmerId);
  let user = findFarmerUser(farmerId);
  if (!user) user = findFarmerUser(canonicalId);
  if (!user || !user.farmerProfile) {
    return { success: false, message: 'Farmer record not found.' };
  }

  if (status === 'VERIFIED') {
    (user.farmerProfile as any).eKycStatus = 'VERIFIED ✓';
    user.farmerProfile.farmerRegistryVerificationStatus = 'MATCHED';
    delete (user.farmerProfile as any).rejectionReason;
  } else if (status === 'REJECTED') {
    (user.farmerProfile as any).eKycStatus = 'REJECTED ✗';
    user.farmerProfile.farmerRegistryVerificationStatus = 'UNREADABLE';
    (user.farmerProfile as any).rejectionReason = reason || 'Documentation discrepancy or unreadable registry file';
  } else {
    (user.farmerProfile as any).eKycStatus = 'PENDING ⏳';
    user.farmerProfile.farmerRegistryVerificationStatus = 'SUSPICIOUS_REVIEW';
  }

  adminAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    action: `FARMER_${status}`,
    adminEmail,
    targetType: 'farmer',
    targetId: canonicalId,
    targetName: user.farmerProfile.name,
    details: `Farmer verification status set to ${status}${reason ? `. Reason: ${reason}` : ''}`,
    timestamp: new Date().toISOString(),
  });

  saveStoreToDisk();
  return { success: true, message: `Farmer status successfully set to ${status}.` };
}

/**
 * Returns all buyer profiles with order count and verification details.
 */
export function getAdminBuyers() {
  const buyers = Array.from(users.values()).filter((u) => u.role === 'buyer');
  return buyers.map((u) => {
    const p = u.buyerProfile;
    const bId = p?.id || resolveCanonicalBuyerId(u.id);
    const orders = buyerOrders.get(bId) || [];
    const threads = buyerMessages.get(bId) || [];
    const activeOrders = orders.filter((o) => {
      const s = (o.status || '').toLowerCase();
      return s === 'pending' || s === 'confirmed' || s === 'processing';
    }).length;

    return {
      id: u.id,
      buyerId: bId,
      name: p?.name || 'Buyer',
      businessName: p?.businessName || 'Procurement House',
      businessType: p?.businessType || 'Wholesaler / Trader',
      mobile: p?.mobile || u.mobileNumber,
      email: p?.email || u.email || 'N/A',
      location: p?.location || `${p?.district || ''}, ${p?.state || 'Uttar Pradesh'}`,
      district: p?.district || 'Bareilly',
      state: p?.state || 'Uttar Pradesh',
      pincode: p?.pincode || '243001',
      deliveryAddress: p?.deliveryAddress || p?.location || 'Bareilly, Uttar Pradesh',
      gstinMasked: p?.gstinMasked || '09AABCK1234F1Z5',
      panMasked: p?.panMasked || 'AABCK1234F',
      verified: p?.verified !== false,
      memberSince: p?.memberSince || 'January 2025',
      preferredCrops: p?.preferredCrops || ['Wheat', 'Rice / Paddy', 'Maize', 'Pulses / Chana'],
      activeOrdersCount: activeOrders,
      totalOrdersCount: orders.length,
      enquiriesCount: threads.length,
      status: u.status || 'active',
      registrationDate: u.createdAt,
    };
  });
}

/**
 * Returns buyer details with complete order history and communications.
 */
export function getAdminBuyerDetails(buyerId: string) {
  const canonicalId = resolveCanonicalBuyerId(buyerId);
  let user = findBuyerUser(buyerId);
  if (!user) user = findBuyerUser(canonicalId);
  if (!user) return null;

  const p = user.buyerProfile;
  const orders = buyerOrders.get(canonicalId) || [];
  const threads = buyerMessages.get(canonicalId) || [];

  return {
    user: {
      id: user.id,
      buyerId: p?.id || canonicalId,
      name: p?.name || 'Buyer',
      businessName: p?.businessName || 'Procurement House',
      businessType: p?.businessType || 'Wholesaler / Trader',
      mobile: p?.mobile || user.mobileNumber,
      email: p?.email || user.email || 'N/A',
      location: p?.location || `${p?.district || ''}, ${p?.state || 'Uttar Pradesh'}`,
      district: p?.district || 'Bareilly',
      state: p?.state || 'Uttar Pradesh',
      pincode: p?.pincode || '243001',
      deliveryAddress: p?.deliveryAddress || 'Commercial Yard, Bareilly, UP',
      gstinMasked: p?.gstinMasked || '09AABCK1234F1Z5',
      panMasked: p?.panMasked || 'AABCK1234F',
      verified: p?.verified !== false,
      memberSince: p?.memberSince || 'January 2025',
      preferredCrops: p?.preferredCrops || ['Wheat', 'Rice / Paddy', 'Maize', 'Pulses / Chana'],
      status: user.status || 'active',
      registrationDate: user.createdAt,
    },
    orders,
    enquiries: threads,
  };
}

/**
 * Toggles a user's suspension status (active vs suspended).
 */
export function toggleUserSuspension(userId: string, suspended: boolean, adminEmail: string = CONFIG_ADMIN_EMAIL) {
  let targetUser: UserRecord | undefined = users.get(userId);
  if (!targetUser) {
    targetUser = findFarmerUser(userId) || findBuyerUser(userId);
  }
  if (!targetUser) {
    return { success: false, message: 'User account not found.' };
  }

  targetUser.status = suspended ? 'suspended' : 'active';

  // Invalidate any active session if suspending
  if (suspended) {
    for (const [token, session] of activeSessions.entries()) {
      if (session.userId === targetUser.id) {
        activeSessions.delete(token);
      }
    }
  }

  adminAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    action: suspended ? 'USER_SUSPENDED' : 'USER_ACTIVATED',
    adminEmail,
    targetType: targetUser.role === 'farmer' ? 'farmer' : 'buyer',
    targetId: targetUser.id,
    targetName: targetUser.farmerProfile?.name || targetUser.buyerProfile?.name || targetUser.identifier,
    details: `User account was ${suspended ? 'suspended' : 're-activated'}.`,
    timestamp: new Date().toISOString(),
  });

  saveStoreToDisk();
  return {
    success: true,
    message: `User account is now ${suspended ? 'suspended' : 'active'}.`,
    status: targetUser.status,
  };
}

/**
 * Returns canonical crop listings with search, crop, quality, and status filters.
 */
export function getAdminCropListings(options?: {
  crop?: string;
  quality?: string;
  status?: string;
  search?: string;
}) {
  const allListings = getAllMarketplaceListings();

  // Strictly filter to the 4 approved crops
  let filtered = allListings.filter((l: any) => isUserFacingApprovedCrop(l.name || l.crop || l.category));

  if (options?.crop && options.crop !== 'all') {
    const c = options.crop.toLowerCase();
    filtered = filtered.filter((l: any) => {
      const name = (l.name || l.crop || l.category || '').toLowerCase();
      if (c.includes('wheat')) return name.includes('wheat') || name.includes('gehu');
      if (c.includes('rice') || c.includes('paddy'))
        return name.includes('rice') || name.includes('paddy') || name.includes('dhan') || name.includes('basmati');
      if (c.includes('maize')) return name.includes('maize') || name.includes('corn') || name.includes('makka');
      if (c.includes('pulse') || c.includes('chana'))
        return (
          name.includes('pulse') ||
          name.includes('chana') ||
          name.includes('moong') ||
          name.includes('dal') ||
          name.includes('urad')
        );
      return false;
    });
  }

  if (options?.quality && options.quality !== 'all') {
    const q = options.quality.toUpperCase();
    filtered = filtered.filter((l: any) => {
      const tier = ((l as any).qualityClassification || l.grade || '').toUpperCase();
      return tier.includes(q);
    });
  }

  if (options?.status && options.status !== 'all') {
    filtered = filtered.filter((l: any) => (l.status || '').toLowerCase() === options.status?.toLowerCase());
  }

  if (options?.search) {
    const s = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (l: any) =>
        (l.name || l.crop || '').toLowerCase().includes(s) ||
        (l.variety || '').toLowerCase().includes(s) ||
        (l.farmerName || '').toLowerCase().includes(s) ||
        (l.location || '').toLowerCase().includes(s) ||
        (l.id || '').toLowerCase().includes(s)
    );
  }

  return filtered.map((l: any) => {
    const rawGrade = ((l as any).qualityClassification || l.grade || '').toUpperCase();
    const qualityGrade: 'PREMIUM' | 'STANDARD' =
      rawGrade.includes('PREM') || rawGrade.includes('A+') || rawGrade.includes('A') ? 'PREMIUM' : 'STANDARD';

    const aiAnalysisStatus =
      (l as any).aiQualityAnalyzed !== false ? 'Analyzed via KisanVision AI' : 'Quality analysis unavailable';

    return {
      id: l.id,
      name: l.name || l.crop || 'Produce',
      variety: l.variety || 'Standard Grade',
      category: l.category,
      cropGroup: (l as any).cropGroup || 'Cereals',
      quantityKg: l.quantityKg ?? l.availableQuantityKg ?? 0,
      pricePerKg: l.pricePerKg,
      grade: qualityGrade,
      qualityClassification: qualityGrade,
      aiAnalysisStatus,
      aiAnalysisAvailable: (l as any).aiQualityAnalyzed !== false,
      mandiReferenceRate: (l as any).mandiBenchmarkRate || Math.round(l.pricePerKg * 0.95),
      farmerId: l.farmerId,
      farmerName: l.farmerName || 'Verified Kisan',
      farmerMobile: (l as any).farmerMobile || l.farmerPhone || 'N/A',
      location: l.location || 'Uttar Pradesh',
      district: l.district || 'Aligarh',
      state: 'Uttar Pradesh',
      harvestDate: l.harvestDate || '2026-03-01',
      listingDate: (l as any).listingDate || l.createdAt || '2026-03-02',
      status: l.status || 'Available',
      imageUrl: l.imageUrl,
      coordinates: (l as any).coordinates || null,
      available: (l as any).available !== false,
    };
  });
}

/**
 * Toggles crop listing status (Available, Sold, Disabled).
 */
export function toggleListingStatus(
  listingId: string,
  status: 'Available' | 'Sold' | 'Disabled',
  adminEmail: string = CONFIG_ADMIN_EMAIL
) {
  let found = false;
  let updatedCropName = '';

  for (const [farmerId, crops] of farmerCrops.entries()) {
    const index = crops.findIndex((c) => c.id === listingId);
    if (index !== -1) {
      crops[index].status = status === 'Available' ? 'Available for Sale' : status === 'Sold' ? 'Sold' : 'Available for Sale';
      (crops[index] as any).available = status === 'Available';
      updatedCropName = crops[index].name;
      found = true;
      break;
    }
  }

  if (!found) {
    return { success: false, message: 'Listing not found in marketplace.' };
  }

  adminAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    action: `LISTING_STATUS_${status.toUpperCase()}`,
    adminEmail,
    targetType: 'listing',
    targetId: listingId,
    targetName: updatedCropName,
    details: `Listing status updated to ${status}.`,
    timestamp: new Date().toISOString(),
  });

  saveStoreToDisk();
  return { success: true, message: `Listing is now marked as ${status}.` };
}

/**
 * Permanently removes a crop listing across both Farmer and Buyer portals.
 */
export function deleteListingPermanently(listingId: string, adminEmail: string = CONFIG_ADMIN_EMAIL) {
  let deletedCrop: CropListing | null = null;
  let deleteCount = 0;

  for (const [farmerId, crops] of farmerCrops.entries()) {
    const matchingIndices: number[] = [];
    crops.forEach((c, idx) => {
      if (c.id === listingId || (c as any).listingId === listingId || (c as any).batchId === listingId) {
        matchingIndices.push(idx);
      }
    });

    for (let i = matchingIndices.length - 1; i >= 0; i--) {
      const idx = matchingIndices[i];
      if (!deletedCrop) deletedCrop = crops[idx];
      crops.splice(idx, 1);
      deleteCount++;
    }
  }

  if (!deletedCrop && deleteCount === 0) {
    return { success: false, message: 'Listing not found.' };
  }

  adminAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    action: 'LISTING_DELETED',
    adminEmail,
    targetType: 'listing',
    targetId: listingId,
    targetName: deletedCrop?.name || listingId,
    details: `Crop listing #${listingId} permanently removed by Admin.`,
    timestamp: new Date().toISOString(),
  });

  saveStoreToDisk();
  return { success: true, message: 'Crop listing permanently deleted.' };
}

/**
 * Returns all platform orders with buyer and farmer details.
 */
export function getAdminOrders() {
  const allOrders: any[] = [];
  for (const [buyerId, orders] of buyerOrders.entries()) {
    const buyer = findBuyerUser(buyerId);
    const buyerName = buyer?.buyerProfile?.name || buyer?.buyerProfile?.businessName || 'Buyer Enterprise';

    for (const o of orders) {
      const anyO = o as any;
      allOrders.push({
        id: o.id,
        orderNumber: anyO.orderNumber || o.id,
        buyerId: o.buyerId || buyerId,
        buyerName: buyerName,
        buyerMobile: buyer?.buyerProfile?.mobile || buyer?.mobileNumber || 'N/A',
        farmerId: o.farmerId,
        farmerName: anyO.farmerName || 'Kisan Producer',
        farmerMobile: anyO.farmerContactPhone || anyO.farmerPhone || 'N/A',
        cropName: anyO.cropName || anyO.crop || 'Farm Produce',
        variety: o.variety || 'Standard',
        quantityKg: Number(o.quantityKg) || 0,
        unitPrice: Number(o.pricePerKg) || 0,
        totalAmount: Number(o.totalAmount) || Number(o.quantityKg) * Number(o.pricePerKg),
        orderDate: anyO.orderDate || anyO.createdAt || new Date().toISOString().split('T')[0],
        status: o.status || 'confirmed',
        deliveryAddress: o.deliveryAddress || 'Commercial Yard, UP',
        deliveryOption: anyO.deliveryOption || 'Ex-Farm',
        paymentStatus: anyO.paymentStatus || 'Payment on Delivery',
        listingId: anyO.productId || anyO.cropId,
      });
    }
  }

  return allOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
}

/**
 * Updates an order status (confirmed, processing, delivered, cancelled).
 */
export function updateOrderStatus(orderId: string, status: string, adminEmail: string = CONFIG_ADMIN_EMAIL) {
  let found = false;
  let orderItem: any = null;

  for (const orders of buyerOrders.values()) {
    const target = orders.find((o: any) => o.id === orderId || o.orderNumber === orderId);
    if (target) {
      target.status = status as any;
      orderItem = target;
      found = true;
      break;
    }
  }

  if (!found) {
    return { success: false, message: 'Order not found.' };
  }

  adminAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    action: `ORDER_STATUS_${status.toUpperCase()}`,
    adminEmail,
    targetType: 'order',
    targetId: orderId,
    targetName: orderItem?.cropName || orderItem?.crop || orderId,
    details: `Order #${orderId} status set to ${status}.`,
    timestamp: new Date().toISOString(),
  });

  saveStoreToDisk();
  return { success: true, message: `Order #${orderId} marked as ${status}.` };
}

/**
 * Returns all active buyer-farmer communications.
 */
export function getAdminEnquiries() {
  const allEnquiries: any[] = [];
  for (const [buyerId, threads] of buyerMessages.entries()) {
    const buyer = findBuyerUser(buyerId);
    const buyerName = buyer?.buyerProfile?.name || buyer?.buyerProfile?.businessName || 'Procurement Buyer';

    for (const t of threads) {
      const msgs = t.messages || [];
      const lastMsg = msgs[msgs.length - 1];
      allEnquiries.push({
        id: t.id,
        buyerId: buyerId,
        buyerName: buyerName,
        buyerMobile: buyer?.buyerProfile?.mobile || buyer?.mobileNumber,
        farmerId: t.farmerId || 'KISAN-FARMER',
        farmerName: t.farmerName || 'Kisan Producer',
        farmerLocation: t.farmerLocation || 'Uttar Pradesh',
        cropContext: t.cropContext || 'Produce Requirement',
        status: (t as any).status || 'OPEN',
        unread: t.unread || false,
        messageCount: msgs.length,
        lastMessage: lastMsg?.text || t.lastMessage || 'Initial enquiry',
        lastMessageTime: lastMsg?.timestamp || t.lastMessageTime || 'Recently',
        createdAt: (t as any).createdAt || '2026-03-01',
        messages: msgs,
      });
    }
  }

  return allEnquiries.sort((a, b) => (b.status === 'NEW' || b.status === 'OPEN' ? 1 : -1));
}

/**
 * Returns all farmers with pending or review verification states.
 */
export function getAdminPendingVerifications() {
  const farmers = Array.from(users.values()).filter((u) => u.role === 'farmer');
  const result: any[] = [];

  for (const u of farmers) {
    const p = u.farmerProfile;
    if (!p) continue;

    const vStatus = (p.farmerRegistryVerificationStatus as string) || '';
    const verificationStatus =
      (p as any).eKycStatus === 'VERIFIED ✓'
        ? 'VERIFIED'
        : vStatus === 'UNREADABLE'
        ? 'REJECTED'
        : 'PENDING_REVIEW';

    result.push({
      id: u.id,
      farmerId: p.farmerId || u.id,
      farmerName: p.name || 'Farmer',
      mobile: p.mobile || u.mobileNumber,
      district: p.district || 'Aligarh',
      village: p.village || 'Baroli',
      aadhaarMasked: p.aadhaarMasked || 'XXXX-XXXX-8492',
      farmerRegistryNumber: p.farmerRegistryNumber || `REG-UP-2026-${u.id.slice(-4)}`,
      farmerRegistryDocumentUrl: p.farmerRegistryDocumentUrl,
      farmerRegistryFileName: p.farmerRegistryFileName || 'Farmer_Registry_Doc.pdf',
      verificationStatus,
      ocrStatus: p.farmerRegistryOcrStatus || 'success',
      ocrConfidence: 94,
      rejectionReason: (p as any).rejectionReason,
      submittedAt: p.farmerRegistrySubmittedAt || u.createdAt,
      registeredDate: u.createdAt,
      landAreaAcres: p.landAreaAcres || p.totalLandAcres || 0,
    });
  }

  return result;
}

/**
 * Returns live market activity feed.
 */
export function getAdminMarketActivity() {
  const activityList: any[] = [];

  const orders = getAdminOrders();
  for (const o of orders.slice(0, 8)) {
    activityList.push({
      id: `act-ord-${o.id}`,
      type: 'order',
      title: `Order #${o.id} - ${o.cropName}`,
      description: `${o.buyerName} placed an order for ${o.quantityKg} kg with ${o.farmerName}.`,
      amount: o.totalAmount,
      timestamp: o.orderDate,
      status: o.status,
    });
  }

  const listings = getAllMarketplaceListings();
  for (const l of listings.slice(0, 8)) {
    const anyL = l as any;
    activityList.push({
      id: `act-lst-${l.id}`,
      type: 'listing',
      title: `Listing: ${anyL.name || anyL.crop} (${l.variety || 'Standard'})`,
      description: `${l.farmerName || 'Farmer'} posted ${anyL.quantityKg ?? anyL.availableQuantityKg} kg at ₹${l.pricePerKg}/kg.`,
      timestamp: anyL.listingDate || l.createdAt || new Date().toISOString(),
      status: anyL.status,
    });
  }

  for (const log of adminAuditLogs.slice(-8)) {
    activityList.push({
      id: `act-log-${log.id}`,
      type: 'admin',
      title: `Admin Action: ${log.action}`,
      description: log.details,
      timestamp: log.timestamp,
      status: 'completed',
    });
  }

  return activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Returns comprehensive reporting data for the Reports section.
 */
export function getAdminReportsData() {
  const overview = getAdminOverviewStats();
  const listings = getAllMarketplaceListings();
  const orders = getAdminOrders();
  const farmers = getAdminFarmers();
  const buyers = getAdminBuyers();

  const totalListingKg = listings.reduce((sum, l: any) => sum + (Number(l.quantityKg ?? l.availableQuantityKg) || 0), 0);
  const totalOrderAmount = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalOrderedKg = orders.reduce((sum, o) => sum + (Number(o.quantityKg) || 0), 0);

  const ordersByStatus = [
    { status: 'Confirmed', count: orders.filter((o) => (o.status || '').toLowerCase() === 'confirmed').length },
    { status: 'Processing', count: orders.filter((o) => (o.status || '').toLowerCase() === 'processing').length },
    {
      status: 'Completed',
      count: orders.filter((o) => (o.status || '').toLowerCase() === 'completed' || (o.status || '').toLowerCase() === 'delivered').length,
    },
    { status: 'Pending', count: orders.filter((o) => (o.status || '').toLowerCase() === 'pending').length },
    { status: 'Cancelled', count: orders.filter((o) => (o.status || '').toLowerCase() === 'cancelled').length },
  ];

  const farmerVerificationBreakdown = [
    { label: 'Verified', count: farmers.filter((f) => f.verificationStatus === 'VERIFIED').length, color: '#16a34a' },
    {
      label: 'Pending Review',
      count: farmers.filter((f) => f.verificationStatus === 'PENDING_REVIEW').length,
      color: '#eab308',
    },
    { label: 'Rejected', count: farmers.filter((f) => f.verificationStatus === 'REJECTED').length, color: '#dc2626' },
  ];

  return {
    overview,
    totalListingKg,
    totalOrderAmount,
    totalOrderedKg,
    ordersByStatus,
    farmerVerificationBreakdown,
    cropStats: overview.cropStats,
    activeFarmersCount: farmers.filter((f) => f.status === 'active').length,
    activeBuyersCount: buyers.filter((b) => b.status === 'active').length,
  };
}

/**
 * Returns system audit logs.
 */
export function getAdminAuditLogs() {
  return adminAuditLogs;
}
