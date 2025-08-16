import { Link, useLocation } from "react-router-dom";
import { Wallet, CheckSquare, Users, User } from "lucide-react";
import { Language } from "../App";

interface BottomNavigationProps {
  language: Language;
}

const translations = {
  en: {
    wallet: "Wallet",
    tasks: "Tasks",
    somiti: "Somiti",
    profile: "Profile"
  },
  bn: {
    wallet: "ওয়ালেট",
    tasks: "টাস্ক",
    somiti: "সমিতি",
    profile: "প্রোফাইল"
  }
};

export function BottomNavigation({ language }: BottomNavigationProps) {
  const location = useLocation();
  const t = translations[language];

  const navItems = [
    { path: "/", icon: Wallet, label: t.wallet },
    { path: "/tasks", icon: CheckSquare, label: t.tasks },
    { path: "/somiti", icon: Users, label: t.somiti },
    { path: "/profile", icon: User, label: t.profile },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 max-w-md mx-auto">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
