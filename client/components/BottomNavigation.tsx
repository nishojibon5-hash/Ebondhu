import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, Users, User } from "lucide-react";
import { Language } from "../App";

interface BottomNavigationProps {
  language: Language;
}

const translations = {
  en: {
    home: "হোম",
    earnings: "আয়",
    loan: "লোন",
    profile: "প্রোফাইল"
  },
  bn: {
    home: "হোম",
    earnings: "আয়", 
    loan: "লোন",
    profile: "প্রোফাইল"
  }
};

export function BottomNavigation({ language }: BottomNavigationProps) {
  const location = useLocation();
  const t = translations[language];

  const navItems = [
    { path: "/", icon: Home, label: t.home },
    { path: "/earning-dashboard", icon: Briefcase, label: t.earnings },
    { path: "/somiti", icon: Users, label: t.loan },
    { path: "/profile", icon: User, label: t.profile },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto shadow-lg">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-4 py-2 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "text-bkash-500 scale-105"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? "bg-bkash-50" : ""}`}>
                <Icon className={`h-5 w-5 ${isActive ? "text-bkash-500" : ""}`} />
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? "font-bold" : ""}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
