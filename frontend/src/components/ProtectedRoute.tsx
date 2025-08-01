import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '@/types';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
    readonly children: React.ReactNode;
    readonly requiredRole?: UserRole;
    readonly redirectTo?: string;
}

export function ProtectedRoute({
    children,
    requiredRole,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const location = useLocation();

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to={redirectTo}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // Check role-based access if requiredRole is specified
    if (requiredRole && user.role !== requiredRole) {
        return (
            <Navigate
                to="/unauthorized"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // Render protected content
    return <>{children}</>;
} 