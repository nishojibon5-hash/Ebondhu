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
    recentTransactions: "সাম্প্রতিক লেনদেন",
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
    payBill: "বিল ���েমেন্ট",
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
      iconColor: "text-pink-500",
      link: "/send-money",
    },
    flags.cashIn !== false && {
      icon: Smartphone,
      label: t.cashIn,
      iconColor: "text-green-500",
      link: "/add-money",
    },
    flags.cashOut !== false && {
      icon: Upload,
      label: t.cashOut,
      iconColor: "text-teal-500",
      link: "/cash-out",
    },
    flags.recharge !== false && {
      icon: Smartphone,
      label: t.recharge,
      iconColor: "text-orange-500",
      link: "/mobile-recharge",
    },
    flags.addMoney !== false && {
      icon: Wallet,
      label: t.addMoney,
      iconColor: "text-purple-500",
      link: "/add-money",
    },
    flags.payBill !== false && {
      icon: Lightbulb,
      label: t.payBill,
      iconColor: "text-yellow-600",
      link: "#",
    },
    {
      icon: Gift,
      label: "সেবিংস",
      iconColor: "text-pink-500",
      link: "#",
    },
    {
      icon: Banknote,
      label: "লোন",
      iconColor: "text-yellow-700",
      link: "/loan-application",
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
      {/* Header - Pink with Beautiful Background */}
      <div className="bg-gradient-to-b from-pink-400 via-pink-500 to-pink-600 p-4 text-white relative overflow-hidden min-h-48">
        {/* Background Image with Landscape and Birds */}
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* Distant mountains/landscape */}
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#be185d', stopOpacity: 0.5 }} />
              </linearGradient>
            </defs>

            {/* Back mountains */}
            <path fill="#be185d" opacity="0.2" d="M0,150 Q150,100 300,150 T600,150 T900,150 T1200,150 L1200,300 L0,300 Z"></path>

            {/* Middle mountains */}
            <path fill="#be185d" opacity="0.35" d="M0,180 Q200,120 400,180 T800,180 T1200,180 L1200,300 L0,300 Z"></path>

            {/* Front landscape */}
            <path fill="#9d174d" opacity="0.4" d="M0,220 Q250,160 500,220 T1000,220 T1200,220 L1200,300 L0,300 Z"></path>

            {/* Small landscape details */}
            <circle cx="150" cy="240" r="20" fill="#9d174d" opacity="0.3"></circle>
            <circle cx="950" cy="250" r="15" fill="#9d174d" opacity="0.25"></circle>
            <path d="M200,240 Q210,220 220,240" stroke="#9d174d" strokeWidth="3" fill="none" opacity="0.2"></path>

            {/* Flying birds */}
            <g opacity="0.4">
              {/* Bird 1 */}
              <path d="M100,80 L110,90 M100,80 L90,90" stroke="white" strokeWidth="2" fill="none"></path>
              {/* Bird 2 */}
              <path d="M300,120 L312,132 M300,120 L288,132" stroke="white" strokeWidth="2" fill="none"></path>
              {/* Bird 3 */}
              <path d="M800,110 L815,125 M800,110 L785,125" stroke="white" strokeWidth="2" fill="none"></path>
              {/* Bird 4 */}
              <path d="M1000,95 L1012,108 M1000,95 L988,108" stroke="white" strokeWidth="2" fill="none"></path>
            </g>
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
            <div className="flex items-center space-x-1">
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <Link to="/notifications" className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Bell className="h-5 w-5" />
              </Link>
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

        {/* See More Dropdown */}
        <div className="mb-6 flex justify-center">
          <button className="bg-white/80 text-yellow-600 px-6 py-2 rounded-full text-sm font-medium shadow-md border border-yellow-200">
            আমরা দেখুন ▼
          </button>
        </div>

        {/* Banners */}
        <BannerCarousel />

        {/* Quick Features Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">কুইক ফিচারসমূহ</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center space-y-2 p-3 bg-orange-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Gift className="h-6 w-6 text-orange-500" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">অফার</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-blue-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">ছাড়</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-yellow-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">পুরস্কার</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <h2 className="font-bold text-gray-800">{t.recentTransactions}</h2>
            <button className="text-yellow-600 text-sm font-medium">
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
