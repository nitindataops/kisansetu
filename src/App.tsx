import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import {
  ProtectedFarmerRoute,
  ProtectedBuyerRoute,
  ProtectedAdminRoute,
} from './components/auth/ProtectedRoute';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { translations } from './data/translations';
import { LanguageCode } from './types';
import { FarmerProfile } from './types/farmer';
import { BuyerProfile } from './types/buyer';
import {
  getStoredAuthSession,
  saveAuthSession,
  fetchCurrentUser,
  logoutUserApi,
} from './services/authApiService';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

function AppRoutes() {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('hi');

  // Load language preference from localStorage
  useEffect(() => {
    try {
      const savedLang = (localStorage.getItem('kisansetu_lang') || localStorage.getItem('agrohub_lang')) as LanguageCode;
      if (savedLang && translations[savedLang]) {
        setCurrentLanguage(savedLang);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleLanguageChange = (code: LanguageCode) => {
    setCurrentLanguage(code);
    try {
      localStorage.setItem('kisansetu_lang', code);
    } catch {
      // Ignore
    }
  };

  // Authenticated User State
  const initialSession = getStoredAuthSession();
  const initialRole = initialSession.token && initialSession.role ? (initialSession.role as 'farmer' | 'buyer' | 'admin') : null;
  const initialBuyer = initialRole === 'buyer' ? (initialSession.user as BuyerProfile) : undefined;
  const initialFarmer = initialRole === 'farmer' ? (initialSession.user as FarmerProfile) : undefined;

  const [authenticatedRole, setAuthenticatedRole] = useState<'farmer' | 'buyer' | 'admin' | null>(initialRole);
  const [authenticatedFarmerProfile, setAuthenticatedFarmerProfile] = useState<FarmerProfile | undefined>(initialFarmer);
  const [authenticatedBuyerProfile, setAuthenticatedBuyerProfile] = useState<BuyerProfile | undefined>(initialBuyer);

  // Restore stored session data in memory without changing the current URL route.
  // CRITICAL: We DO NOT redirect here. The URL itself controls whether the user is on
  // "/", "/farmer/dashboard", "/buyer/dashboard", or "/login".
  useEffect(() => {
    const { token, role, user } = getStoredAuthSession();
    if (token && role && user) {
      setAuthenticatedRole(role as 'farmer' | 'buyer' | 'admin');
      if (role === 'farmer') {
        setAuthenticatedFarmerProfile(user);
      } else if (role === 'buyer') {
        setAuthenticatedBuyerProfile(user);
      }
    }

    // Verify session with backend asynchronously
    if (token) {
      fetchCurrentUser().then((res) => {
        if (res.success && res.role) {
          setAuthenticatedRole(res.role as 'farmer' | 'buyer' | 'admin');
          const verifiedUser = res.user || (res as any).profile;
          if (res.role === 'farmer' && verifiedUser) {
            setAuthenticatedFarmerProfile(verifiedUser);
            saveAuthSession(token, 'farmer', verifiedUser);
          } else if (res.role === 'buyer' && verifiedUser) {
            setAuthenticatedBuyerProfile(verifiedUser);
            saveAuthSession(token, 'buyer', verifiedUser);
          }
        } else if (
          res.success === false &&
          (res.message?.includes('expired') ||
            res.message?.includes('Unauthorized') ||
            res.message?.includes('Invalid'))
        ) {
          handleLogout();
        }
      }).catch(() => {
        // Ignore background session verification errors
      });
    }
  }, []);

  const handleLoginSuccess = (role: 'farmer' | 'buyer' | 'admin', userData?: any) => {
    setAuthenticatedRole(role);
    if (role === 'farmer') {
      if (userData) setAuthenticatedFarmerProfile(userData);
      navigate('/farmer/dashboard');
    } else if (role === 'buyer') {
      if (userData) setAuthenticatedBuyerProfile(userData);
      navigate('/buyer/dashboard');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  const handleLogout = async () => {
    await logoutUserApi();
    setAuthenticatedRole(null);
    setAuthenticatedFarmerProfile(undefined);
    setAuthenticatedBuyerProfile(undefined);
    // Replace URL to "/" so protected pages cannot be revisited with browser back
    navigate('/', { replace: true });
  };

  return (
    <>
      <OfflineIndicator currentLanguage={currentLanguage} />
      <Routes>
      {/* 
        1. PUBLIC ROOT ROUTE ("/")
        ALWAYS renders the public KisanSetu Home/Landing Page.
        Will NEVER automatically redirect to any dashboard or private page.
      */}
      <Route
        path="/"
        element={
          <LandingPage
            currentLanguage={currentLanguage}
            onSelectLanguage={handleLanguageChange}
            authenticatedRole={authenticatedRole}
            farmerProfile={authenticatedFarmerProfile}
            buyerProfile={authenticatedBuyerProfile}
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />

      {/* 
        2. CANONICAL AUTHENTICATION ROUTES ("/login" and "/signup")
      */}
      <Route
        path="/login"
        element={
          <LoginPage
            mode="login"
            currentLanguage={currentLanguage}
            onSelectLanguage={handleLanguageChange}
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <LoginPage
            mode="signup"
            currentLanguage={currentLanguage}
            onSelectLanguage={handleLanguageChange}
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />

      {/* Authentication Route Aliases & Redirects */}
      <Route path="/signin" element={<Navigate to="/login" replace />} />
      <Route path="/sign-in" element={<Navigate to="/login" replace />} />
      <Route path="/auth/login" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route path="/auth/signup" element={<Navigate to="/signup" replace />} />

      {/* 
        3. PROTECTED FARMER DASHBOARD & PROFILE
      */}
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedFarmerRoute>
            <div className="min-h-screen bg-[#FBFAF4] text-[#26332B] relative">
              <FarmerDashboard
                onLogout={handleLogout}
                currentLanguage={currentLanguage}
                onSelectLanguage={handleLanguageChange}
                farmerProfile={authenticatedFarmerProfile}
                initialTab="overview"
                onSwitchToBuyer={() => {
                  const session = getStoredAuthSession();
                  if (session.token && session.role === 'buyer') {
                    navigate('/buyer/dashboard');
                  } else {
                    navigate('/login?role=buyer');
                  }
                }}
              />
            </div>
          </ProtectedFarmerRoute>
        }
      />
      <Route
        path="/farmer/profile"
        element={
          <ProtectedFarmerRoute>
            <div className="min-h-screen bg-[#FBFAF4] text-[#26332B] relative">
              <FarmerDashboard
                onLogout={handleLogout}
                currentLanguage={currentLanguage}
                onSelectLanguage={handleLanguageChange}
                farmerProfile={authenticatedFarmerProfile}
                initialTab="profile"
                onSwitchToBuyer={() => {
                  const session = getStoredAuthSession();
                  if (session.token && session.role === 'buyer') {
                    navigate('/buyer/dashboard');
                  } else {
                    navigate('/login?role=buyer');
                  }
                }}
              />
            </div>
          </ProtectedFarmerRoute>
        }
      />
      <Route
        path="/farmer/*"
        element={
          <ProtectedFarmerRoute>
            <Navigate to="/farmer/dashboard" replace />
          </ProtectedFarmerRoute>
        }
      />

      {/* 
        4. PROTECTED BUYER DASHBOARD & PROFILE
      */}
      <Route
        path="/buyer/dashboard"
        element={
          <ProtectedBuyerRoute>
            <div className="min-h-screen bg-[#FAF7F0] text-[#26332B] relative">
              <BuyerDashboard
                currentLanguage={currentLanguage}
                onSelectLanguage={handleLanguageChange}
                buyerProfile={authenticatedBuyerProfile}
                initialTab="home"
                onSwitchToFarmerPortal={() => {
                  const session = getStoredAuthSession();
                  if (session.token && session.role === 'farmer') {
                    navigate('/farmer/dashboard');
                  } else {
                    navigate('/login?role=farmer');
                  }
                }}
                onLogout={handleLogout}
                onOpenLogin={(role) => navigate(`/login?role=${role || 'buyer'}`)}
              />
            </div>
          </ProtectedBuyerRoute>
        }
      />
      <Route
        path="/buyer/profile"
        element={
          <ProtectedBuyerRoute>
            <div className="min-h-screen bg-[#FAF7F0] text-[#26332B] relative">
              <BuyerDashboard
                currentLanguage={currentLanguage}
                onSelectLanguage={handleLanguageChange}
                buyerProfile={authenticatedBuyerProfile}
                initialTab="profile"
                onSwitchToFarmerPortal={() => {
                  const session = getStoredAuthSession();
                  if (session.token && session.role === 'farmer') {
                    navigate('/farmer/dashboard');
                  } else {
                    navigate('/login?role=farmer');
                  }
                }}
                onLogout={handleLogout}
                onOpenLogin={(role) => navigate(`/login?role=${role || 'buyer'}`)}
              />
            </div>
          </ProtectedBuyerRoute>
        }
      />
      <Route
        path="/buyer/*"
        element={
          <ProtectedBuyerRoute>
            <Navigate to="/buyer/dashboard" replace />
          </ProtectedBuyerRoute>
        }
      />

      {/* 
        5. PROTECTED ADMIN PORTAL
      */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard currentLanguage={currentLanguage} onLogout={handleLogout} />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <Navigate to="/admin" replace />
          </ProtectedAdminRoute>
        }
      />

      {/* 
        6. WILDCARD FALLBACK
        Any unknown path redirects strictly to "/" (Public Home Page).
        Never redirects unknown paths to a farmer or buyer dashboard.
      */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
