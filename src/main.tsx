import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CreateAccount } from "@/pages/create-account";
import { Dashboard } from "@/pages/dashboard";
//import { HomeScreen } from "@/pages/home-screen-OLD";
import { HomeLoginPage } from "@/pages/home-login-page";
import { NotFound } from "@/pages/not-found";
import { RouteProvider } from "@/providers/router-provider";
import { SupabaseProvider } from "@/providers/supabase-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SupabaseProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <RouteProvider>
                        <Routes>
                            <Route path="/" element={<HomeLoginPage />} />
                            <Route path="/login" element={<HomeLoginPage />} />
                            <Route path="/create-account" element={<CreateAccount />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </RouteProvider>
                </BrowserRouter>
            </ThemeProvider>
        </SupabaseProvider>
    </StrictMode>,
);
