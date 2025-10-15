import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ChangePassword } from "@/pages/change-password";
import Chart from "@/pages/chart";
import { CreateAccount } from "@/pages/create-account";
import { DeviceInformation } from "@/pages/device-information";
import { HomeLoginPage } from "@/pages/home-login-page";
import { Logout } from "@/pages/logout";
import { NotFound } from "@/pages/not-found";
import { ResetPassword } from "@/pages/reset-password";
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
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/change-password" element={<ChangePassword />} />
                            <Route path="/create-account" element={<CreateAccount />} />
                            {/* <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            /> */}
                            <Route
                                path="/device-information"
                                element={
                                    <ProtectedRoute>
                                        <DeviceInformation />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/chart"
                                element={
                                    <ProtectedRoute>
                                        <Chart />
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
