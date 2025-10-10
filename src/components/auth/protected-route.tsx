import React from "react";
import { Navigate, useLocation } from "react-router";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { useSupabase } from "@/providers/supabase-provider";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useSupabase();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingIndicator />
            </div>
        );
    }

    if (!user) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
