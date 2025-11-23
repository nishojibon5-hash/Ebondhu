import { useState } from "react";
import {
  Send,
  Download,
  Upload,
  Smartphone,
  Receipt,
  QrCode,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Globe,
  Home,
  Banknote,
  Search,
  Menu,
  Clock,
  Lightbulb,
  Gift,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Language } from "../App";
import { DrawerMenu, DrawerMenuButton } from "../components/DrawerMenu";
import { BannerCarousel } from "../components/BannerCarousel";

interface DashboardProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const translations = {
  en: {
    goodMorning: "Good Morning",
    userName: "মোঃ রহিম",
    appName: "amarcash",
    yourBalance: "আপনার ব্যালেন্স",
    sendMoney: "Send Money",
    cashIn: "Cash In",
    cashOut: "Cash Out",
    recharge: "Mobile Recharge",
    payBill: "Pay Bill",
    addMoney: "Add Money",
    recentTransactions: "সাম্প্রতিক লেনদে���",
    viewAll: "সব দেখুন",
    sent: "পাঠানো",
    received: "পেয়েছেন",
    recharged: "রিচার্জ",
    today: "আজ",
    yesterday: "গতকাল",
    tapToSeeBalance: "ব্যালেন্স দেখতে ট্যাপ করুন",
    taskEarning: "টাস্�� আর্নিং",
    loanService: "লোন সার্ভিস",
    somitiManager: "সমিতি ম্যানেজার",
  },
  bn: {
    goodMorning: "শুভ সকাল",
    userName: "মোঃ ��হিম",
    appName: "amarcash",
    yourBalance: "আপনার ব্যালেন্স",
    sendMoney: "টাকা পাঠান",
    cashIn: "ক্যাশ ইন",
    cashOut: "ক্যাশ আউট",
    recharge: "মোবাইল রিচার্জ",
    payBill: "বিল পেমেন্ট",
    addMoney: "টাকা যোগ করুন",
    recentTransactions: "সাম্প্রতিক লেনদেন",
    viewAll: "সব দেখুন",
    sent: "পাঠানো",
    received: "পেয়েছেন",
    recharged: "রিচার্জ",
    today: "আজ",
    yesterday: "গতকাল",
    tapToSeeBalance: "ব্যালেন্স দেখতে ট্যাপ করুন",
    taskEarning: "টাস্ক আর্নিং",
    loanService: "লোন সার্ভিস",
    somitiManager: "সমিতি ম্যানেজার",
  },
};

export default function Dashboard({ language, setLanguage }: DashboardProps) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const t = translations[language];

  const flags = (() => {
    try {
      return JSON.parse(localStorage.getItem("featureFlags") || "{}");
    } catch {
      return {} as any;
    }
  })();

  const quickActions = [
    flags.sendMoney !== false && {
      icon: Send,
      label: t.sendMoney,
      color: "bg-white shadow-md",
      textColor: "text-gray-700",
      iconColor: "text-bkash-500",
      link: "/send-money",
    },
    flags.cashIn !== false && {
      icon: Download,
      label: t.cashIn,
      color: "bg-white shadow-md",
      textColor: "text-gray-700",
      iconColor: "text-green-500",
      link: "/add-money",
    },
    flags.cashOut !== false && {
      icon: Upload,
      label: t.cashOut,
      color: "bg-white shadow-md",
      textColor: "text-gray-700",
      iconColor: "text-red-500",
      link: "/cash-out",
    },
    flags.recharge !== false && {
      icon: Smartphone,
      label: t.recharge,
      color: "bg-white shadow-md",
      textColor: "text-gray-700",
      iconColor: "text-blue-500",
      link: "/mobile-recharge",
    },
    flags.payBill !== false && {
      icon: Receipt,
      label: t.payBill,
      color: "bg-white shadow-md",
      textColor: "text-gray-700",
      iconColor: "text-orange-500",
      link: "#",
    },
    flags.addMoney !== false && {
      icon: Banknote,
      label: t.addMoney,
      color: "bg-white shadow-md",
      textColor: "text-gray-700",
      iconColor: "text-purple-500",
      link: "/add-money",
    },
  ].filter(Boolean) as any[];

  const isSomitiManager = localStorage.getItem("isSomitiManager") === "true";

  const transactions = [
    {
      id: 1,
      type: "sent",
      amount: -1500,
      description: "টাকা পাঠানো - ০১৭১১××××××",
      time: "১০:৩০ AM",
      date: t.today,
    },
    {
      id: 2,
      type: "received",
      amount: 2500,
      description: "টাকা পেয়েছেন - চাকরিদাতা থেকে",
      time: "২:১৫ PM",
      date: t.yesterday,
    },
    {
      id: 3,
      type: "recharge",
      amount: -100,
      description: "মোবাইল রিচার্জ - ০১৭১১××××××",
      time: "৬:৪৫ PM",
      date: t.yesterday,
    },
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header - Deep Yellow Style */}
      <div className="bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 p-4 text-white relative overflow-hidden">
        {/* Wavy Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 1200 120" className="w-full h-full" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="0.1" d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z"></path>
            <path fill="currentColor" fillOpacity="0.15" d="M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

        <div className="relative z-10">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-6">
            {/* Profile Section */}
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-2 border-white/30">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">
                  {localStorage.getItem("userName") || t.userName}
                </h2>
                <p className="text-yellow-100 text-xs">{t.goodMorning}</p>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button onClick={() => setIsDrawerOpen(true)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-full px-4 py-2 flex items-center space-x-2 shadow-md mb-6">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="সার্চ করুন"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Decorative Landscape Pattern */}
      <div className="h-24 bg-gradient-to-b from-yellow-500 to-white relative overflow-hidden">
        <svg viewBox="0 0 1200 120" className="absolute bottom-0 w-full h-32 text-yellow-400">
          <path fill="currentColor" opacity="0.3" d="M0,50 Q100,30 200,50 T400,50 L400,120 L0,120 Z"></path>
          <path fill="currentColor" opacity="0.5" d="M200,70 Q300,40 400,70 T600,70 L600,120 L200,120 Z"></path>
          <path fill="currentColor" opacity="0.3" d="M600,60 Q700,80 800,60 T1000,60 L1000,120 L600,120 Z"></path>
          <path fill="currentColor" opacity="0.4" d="M900,75 Q1000,50 1100,75 L1200,75 L1200,120 L900,120 Z"></path>
        </svg>
      </div>

      {/* Quick Actions - 4x2 Grid */}
      <div className="p-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="flex flex-col items-center space-y-3 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Icon className={`h-7 w-7 ${action.iconColor}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Banners */}
        <BannerCarousel />

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <h2 className="font-bold text-gray-800">{t.recentTransactions}</h2>
            <button className="text-bkash-500 text-sm font-medium">
              {t.viewAll}
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "sent"
                          ? "bg-red-100"
                          : transaction.type === "received"
                            ? "bg-green-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {transaction.type === "sent" ? (
                        <Send className="h-4 w-4 text-red-600" />
                      ) : transaction.type === "received" ? (
                        <Download className="h-4 w-4 text-green-600" />
                      ) : (
                        <Smartphone className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}৳{" "}
                      {Math.abs(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer Menu */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
