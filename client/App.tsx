import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FacebookHome from "./pages/FacebookHome";
import Tasks from "./pages/Tasks";
import Events from "./pages/Events";
import Marketplace from "./pages/Marketplace";
import Somiti from "./pages/Somiti";
import Profile from "./pages/Profile";
import TaskEarning from "./pages/TaskEarning";
import TaskCreate from "./pages/TaskCreate";
import SendMoney from "./pages/SendMoney";
import MobileRecharge from "./pages/MobileRecharge";
import AddMoney from "./pages/AddMoney";
import CashOut from "./pages/CashOut";
import Notifications from "./pages/Notifications";
import Refer from "./pages/Refer";
import LoanApplication from "./pages/LoanApplication";
import SomitiManager from "./pages/SomitiManager";
import SomitiSetup from "./pages/SomitiSetup";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPin from "./pages/ForgotPin";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SocialFeed from "./pages/SocialFeed";
import Friends from "./pages/Friends";
import UserProfile from "./pages/UserProfile";
import { BottomNavigation } from "./components/BottomNavigation";
import { useState, useEffect } from "react";

export type Language = "en" | "bn";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

// Public Route Component (redirect to dashboard if logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return !isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}

// Admin Route Guard (client-side flag only)
function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? <>{children}</> : <Navigate to="/admin-login" replace />;
}

function App() {
  const [language, setLanguage] = useState<Language>("bn");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-pin"
              element={
                <PublicRoute>
                  <ForgotPin />
                </PublicRoute>
              }
            />

            {/* Admin Public Route */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Admin Protected */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Protected User Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <FacebookHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/earning-dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard language={language} setLanguage={setLanguage} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks language={language} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/somiti"
              element={
                <ProtectedRoute>
                  <Somiti language={language} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile language={language} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/task-earning"
              element={
                <ProtectedRoute>
                  <TaskEarning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/task-earning/create"
              element={
                <ProtectedRoute>
                  <TaskCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/send-money"
              element={
                <ProtectedRoute>
                  <SendMoney />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mobile-recharge"
              element={
                <ProtectedRoute>
                  <MobileRecharge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cash-out"
              element={
                <ProtectedRoute>
                  <CashOut />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-money"
              element={
                <ProtectedRoute>
                  <AddMoney />
                </ProtectedRoute>
              }
            />
            <Route
              path="/refer"
              element={
                <ProtectedRoute>
                  <Refer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loan-application"
              element={
                <ProtectedRoute>
                  <LoanApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/somiti-manager"
              element={
                <ProtectedRoute>
                  <SomitiManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/somiti-setup"
              element={
                <ProtectedRoute>
                  <SomitiSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/social-feed"
              element={
                <ProtectedRoute>
                  <SocialFeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userPhone"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>

          {isLoggedIn && <BottomNavigation language={language} />}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
