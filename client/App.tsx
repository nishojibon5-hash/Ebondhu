import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Somiti from "./pages/Somiti";
import Profile from "./pages/Profile";
import TaskEarning from "./pages/TaskEarning";
import TaskCreate from "./pages/TaskCreate";
import SendMoney from "./pages/SendMoney";
import MobileRecharge from "./pages/MobileRecharge";
import AddMoney from "./pages/AddMoney";
import LoanApplication from "./pages/LoanApplication";
import SomitiManager from "./pages/SomitiManager";
import SomitiSetup from "./pages/SomitiSetup";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPin from "./pages/ForgotPin";
import NotFound from "./pages/NotFound";
import { BottomNavigation } from "./components/BottomNavigation";
import { useState, useEffect } from "react";

export type Language = 'en' | 'bn';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

// Public Route Component (redirect to dashboard if logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return !isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  const [language, setLanguage] = useState<Language>('bn'); // Default to Bengali
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/forgot-pin" element={
              <PublicRoute>
                <ForgotPin />
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard language={language} setLanguage={setLanguage} />
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Tasks language={language} />
              </ProtectedRoute>
            } />
            <Route path="/somiti" element={
              <ProtectedRoute>
                <Somiti language={language} />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile language={language} />
              </ProtectedRoute>
            } />
            <Route path="/task-earning" element={
              <ProtectedRoute>
                <TaskEarning />
              </ProtectedRoute>
            } />
            <Route path="/task-earning/create" element={
              <ProtectedRoute>
                <TaskCreate />
              </ProtectedRoute>
            } />
            <Route path="/send-money" element={
              <ProtectedRoute>
                <SendMoney />
              </ProtectedRoute>
            } />
            <Route path="/mobile-recharge" element={
              <ProtectedRoute>
                <MobileRecharge />
              </ProtectedRoute>
            } />
            <Route path="/add-money" element={
              <ProtectedRoute>
                <AddMoney />
              </ProtectedRoute>
            } />
            <Route path="/loan-application" element={
              <ProtectedRoute>
                <LoanApplication />
              </ProtectedRoute>
            } />
            <Route path="/somiti-manager" element={
              <ProtectedRoute>
                <SomitiManager />
              </ProtectedRoute>
            } />
            <Route path="/somiti-setup" element={
              <ProtectedRoute>
                <SomitiSetup />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Show bottom navigation only for logged in users */}
          {isLoggedIn && <BottomNavigation language={language} />}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
