import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  PlusCircle,
  Search,
  TrendingUp,
  PackageCheck,
  MessageSquareText,
  Warehouse,
  Bell,
  UserCheck,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { FarmerDashboardTab, FarmerProfile } from '../../types/farmer';

interface FarmerSidebarProps {
  currentTab: FarmerDashboardTab;
  onSelectTab: (tab: FarmerDashboardTab) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  unreadNotifsCount: number;
  unresolvedEnquiriesCount: number;
  farmerProfile?: FarmerProfile;
}

export const FarmerSidebar: React.FC<FarmerSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  unreadNotifsCount,
  unresolvedEnquiriesCount,
  farmerProfile,
}) => {
  const navItems: {
    id: FarmerDashboardTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'my-crops',
      label: 'My Crops',
      icon: <Sprout className="w-5 h-5" />,
      badge: '4 Active',
      badgeColor: 'bg-[#5F8F45]/15 text-[#245C3A]',
    },
    {
      id: 'add-crop',
      label: 'Add Crop / Sell',
      icon: <PlusCircle className="w-5 h-5 text-[#D6A63A]" />,
      badge: 'Quick',
      badgeColor: 'bg-[#D6A63A]/20 text-[#8C6212]',
    },
    {
      id: 'search-buyers',
      label: 'Search Buyers',
      icon: <Search className="w-5 h-5" />,
      badge: '5 Verified',
      badgeColor: 'bg-[#5F8F45]/15 text-[#245C3A]',
    },
    {
      id: 'market-prices',
      label: 'Market Prices',
      icon: <TrendingUp className="w-5 h-5" />,
      badge: 'Live APMC',
      badgeColor: 'bg-[#D6A63A]/20 text-[#8C6212]',
    },
    {
      id: 'orders',
      label: 'Orders & Deals',
      icon: <PackageCheck className="w-5 h-5" />,
      badge: '2 Active',
      badgeColor: 'bg-[#245C3A] text-white',
    },
    {
      id: 'enquiries',
      label: 'Buyer Enquiries',
      icon: <MessageSquareText className="w-5 h-5" />,
      badge: unresolvedEnquiriesCount > 0 ? unresolvedEnquiriesCount : undefined,
      badgeColor: 'bg-[#B86F4B] text-white',
    },
    {
      id: 'storage-processing',
      label: 'Storage & Processing',
      icon: <Warehouse className="w-5 h-5" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
      badgeColor: 'bg-[#B86F4B] text-white',
    },
    {
      id: 'profile',
      label: 'Farmer Profile',
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      id: 'support',
      label: 'Support & Help',
      icon: <span className="text-lg">🤖</span>,
      badge: 'Real AI',
      badgeColor: 'bg-[#245C3A] text-white',
    },
  ];

  const handleNavClick = (tab: FarmerDashboardTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#FFFFFF] border-r border-[#EEF3E8] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg lg:shadow-none`}
      >
        {/* Top Brand Logo Section */}
        <div>
          <div className="p-5 border-b border-[#EEF3E8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#245C3A] to-[#183B27] flex items-center justify-center text-white text-xl shadow-xs">
                🌾
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-black text-xl tracking-tight text-[#245C3A]">
                    AGRO<span className="text-[#5F8F45]">HUB</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#D6A63A]/20 text-[#8C6212] border border-[#D6A63A]/40">
                    Farmer
                  </span>
                </div>
                <p className="text-xs text-[#68736B]">Kisan Direct Marketplace</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-lg text-[#68736B] hover:bg-[#EEF3E8] lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Farmer Quick Verification Status Mini Bar */}
          <div className="mx-4 my-3 px-3 py-2 rounded-xl bg-[#EEF3E8] border border-[#5F8F45]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#245C3A]" />
              <span className="text-xs font-semibold text-[#245C3A]">Farmer ID Verified</span>
            </div>
            <span className="text-[11px] font-bold text-[#5F8F45] bg-white px-2 py-0.5 rounded-md shadow-2xs">
              ✓ UIDAI
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] scrollbar-thin">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#245C3A] text-white shadow-sm font-semibold'
                      : 'text-[#26332B] hover:bg-[#EEF3E8] hover:text-[#245C3A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#D6A63A]' : 'text-[#5F8F45]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Logout Box */}
        <div className="p-4 border-t border-[#EEF3E8] bg-[#FBFAF4]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#5F8F45]/20 border-2 border-[#5F8F45] flex items-center justify-center text-[#245C3A] font-bold text-sm">
              {farmerProfile?.name
                ? farmerProfile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'KS'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#26332B] truncate">
                {farmerProfile?.name || 'Verified Farmer'}
              </h4>
              <p className="text-xs text-[#68736B] truncate">
                {farmerProfile?.village || 'Village'}, {farmerProfile?.district || 'UP'}
              </p>
            </div>
          </div>

          <button
            id="farmer-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#B86F4B]/30 text-[#B86F4B] hover:bg-[#B86F4B] hover:text-white transition-colors duration-200 text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out / Return to Home</span>
          </button>
        </div>
      </aside>
    </>
  );
};
