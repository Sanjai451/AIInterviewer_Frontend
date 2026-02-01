import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InterviewProvider } from "./contexts/InterviewContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Layout
import AppLayout from "./layout/AppLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import HRDashboard from "./pages/HRDashboard";
import MCQInterview from "./pages/MCQInterview";
import InPersonInterview from "./pages/InPersonInterview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <InterviewProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* GLOBAL THEME LAYOUT */}
              <Route element={<AppLayout />}>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User routes */}
                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* HR routes */}
                <Route
                  path="/hr/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['hr']}>
                      <HRDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Interview routes */}
                <Route
                  path="/interview/mcq/:id"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <MCQInterview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interview/in-person/:id"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <InPersonInterview />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </InterviewProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
