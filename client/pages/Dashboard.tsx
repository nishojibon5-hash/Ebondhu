import { useState, useEffect, useRef } from "react";
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
    yourBalance: "আ���নার ব্যালেন্স",
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.35;
    }
  }, []);

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
      {/* Header - Pink with Animated Background Video */}
      <div className="bg-gradient-to-b from-pink-400 via-pink-500 to-pink-600 p-4 text-white relative overflow-hidden min-h-48">
        {/* Animated Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.4 }}
          >
            <source
              src="https://videos.pexels.com/video-files/5847285/5847285-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Overlay gradient for blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-400/40 via-pink-500/50 to-pink-600/60"></div>

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
      <div className="h-32 bg-gradient-to-b from-pink-500 to-white relative overflow-hidden">
        <svg viewBox="0 0 1200 150" className="absolute bottom-0 w-full h-40 text-pink-400">
          {/* Landscape layers */}
          <path fill="#be185d" opacity="0.25" d="M0,50 Q100,30 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50 L1200,150 L0,150 Z"></path>
          <path fill="#9d174d" opacity="0.35" d="M0,70 Q150,40 300,70 T600,70 T900,70 T1200,70 L1200,150 L0,150 Z"></path>
          <path fill="#831843" opacity="0.45" d="M0,100 Q200,60 400,100 T800,100 T1200,100 L1200,150 L0,150 Z"></path>

          {/* Small landscape elements */}
          <rect x="150" y="105" width="8" height="25" fill="#6b1d36" opacity="0.3"></rect>
          <polygon points="200,110 210,95 220,110" fill="#6b1d36" opacity="0.25"></polygon>
          <rect x="950" y="110" width="6" height="20" fill="#6b1d36" opacity="0.25"></rect>
        </svg>
      </div>

      {/* Quick Actions - 4x2 Grid */}
      <div className="p-4 relative z-10 -mt-8">
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
          <button className="bg-white/80 text-pink-600 px-6 py-2 rounded-full text-sm font-medium shadow-md border border-pink-200">
            আমরা দেখুন ▼
          </button>
        </div>

        {/* Banners */}
        <BannerCarousel />

        {/* Quick Features Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">কুই�� ফিচারসমূহ</h3>
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
            <button className="text-pink-600 text-sm font-medium">
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
