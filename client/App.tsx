import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Somiti from "./pages/Somiti";
import Profile from "./pages/Profile";
import TaskEarning from "./pages/TaskEarning";
import LoanApplication from "./pages/LoanApplication";
import SomitiManager from "./pages/SomitiManager";
import NotFound from "./pages/NotFound";
import { BottomNavigation } from "./components/BottomNavigation";
import { useState } from "react";

export type Language = 'en' | 'bn';

function App() {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl">
          <Routes>
            <Route path="/" element={<Dashboard language={language} setLanguage={setLanguage} />} />
            <Route path="/tasks" element={<Tasks language={language} />} />
            <Route path="/somiti" element={<Somiti language={language} />} />
            <Route path="/profile" element={<Profile language={language} />} />
            <Route path="/task-earning" element={<TaskEarning />} />
            <Route path="/loan-application" element={<LoanApplication />} />
            <Route path="/somiti-manager" element={<SomitiManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation language={language} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
