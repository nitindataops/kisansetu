import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredAuthSession } from '../../services/authApiService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Farmer Route
 * Enforces authenticated session with role === 'farmer'.
 * If logged out -> Redirects to /login (with replace: true)
 * If logged in as Buyer -> Blocks access, redirects to /buyer/dashboard (never exposes farmer data)
 */
export const ProtectedFarmerRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { token, role } = getStoredAuthSession();

  if (!token || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== 'farmer') {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    // Authenticated as another role (e.g. Buyer)
    // NEVER show farmer private data, redirect to buyer dashboard
    return <Navigate to="/buyer/dashboard" replace />;
  }

  return <>{children}</>;
};

/**
 * Protected Buyer Route
 * Enforces authenticated session with role === 'buyer'.
 * If logged out -> Redirects to /login (with replace: true)
 * If logged in as Farmer -> Blocks access, redirects to /farmer/dashboard (never exposes buyer data)
 */
export const ProtectedBuyerRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { token, role } = getStoredAuthSession();

  if (!token || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== 'buyer') {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    // Authenticated as another role (e.g. Farmer)
    // NEVER show buyer private data, redirect to farmer dashboard
    return <Navigate to="/farmer/dashboard" replace />;
  }

  return <>{children}</>;
};

/**
 * Protected Admin Route
 * Enforces authenticated session with role === 'admin'.
 * Farmer or Buyer cannot access Admin pages.
 */
export const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { token, role } = getStoredAuthSession();

  if (!token || !role) {
    return <Navigate to="/login?role=admin" state={{ from: location }} replace />;
  }

  if (role === 'farmer') {
    return <Navigate to="/farmer/dashboard" replace />;
  }

  if (role === 'buyer') {
    return <Navigate to="/buyer/dashboard" replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

