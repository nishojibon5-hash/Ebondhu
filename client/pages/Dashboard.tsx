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
  CreditCard,
  Home,
  Banknote,
  PiggyBank,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { Language } from "../App";
import { DrawerMenu, DrawerMenuButton } from "../components/DrawerMenu";

interface DashboardProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const translations = {
  en: {
    goodMorning: "Good Morning",
    userName: "মোঃ রহিম",
    appName: "লোন বন্ধু",
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
    taskEarning: "টাস্ক আর্নিং",
    loanService: "লোন সার্ভিস",
    somitiManager: "সমিতি ম্যানেজার"
  },
  bn: {
    goodMorning: "শুভ ���কাল",
    userName: "মোঃ রহিম",
    appName: "লোন বন্ধু",
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
    somitiManager: "সমিতি ম্যানেজার"
  }
};

export default function Dashboard({ language, setLanguage }: DashboardProps) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const t = translations[language];

  const quickActions = [
    { icon: Send, label: t.sendMoney, color: "bg-white shadow-md", textColor: "text-gray-700", iconColor: "text-bkash-500", link: "/send-money" },
    { icon: Download, label: t.cashIn, color: "bg-white shadow-md", textColor: "text-gray-700", iconColor: "text-green-500", link: "/add-money" },
    { icon: Upload, label: t.cashOut, color: "bg-white shadow-md", textColor: "text-gray-700", iconColor: "text-red-500", link: "#" },
    { icon: Smartphone, label: t.recharge, color: "bg-white shadow-md", textColor: "text-gray-700", iconColor: "text-blue-500", link: "/mobile-recharge" },
    { icon: Receipt, label: t.payBill, color: "bg-white shadow-md", textColor: "text-gray-700", iconColor: "text-orange-500", link: "#" },
    { icon: Banknote, label: t.addMoney, color: "bg-white shadow-md", textColor: "text-gray-700", iconColor: "text-purple-500", link: "/add-money" },
  ];

  const isSomitiManager = localStorage.getItem('isSomitiManager') === 'true';

  const specialFeatures = [
    { icon: CreditCard, label: t.taskEarning, color: "bg-gradient-to-r from-blue-500 to-blue-600", link: "/task-earning" },
    { icon: PiggyBank, label: t.loanService, color: "bg-gradient-to-r from-green-500 to-green-600", link: "/loan-application" },
    {
      icon: Users,
      label: t.somitiManager,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      link: isSomitiManager ? "/somiti-manager" : "/somiti-setup"
    },
  ];

  const transactions = [
    {
      id: 1,
      type: "sent",
      amount: -1500,
      description: "টাকা পাঠানো - ০১৭১১××××××",
      time: "১০:৩০ AM",
      date: t.today
    },
    {
      id: 2,
      type: "received", 
      amount: 2500,
      description: "টাকা পেয়েছেন - চাকরিদাতা থেকে",
      time: "২:১৫ PM",
      date: t.yesterday
    },
    {
      id: 3,
      type: "recharge",
      amount: -100,
      description: "মোবাইল রিচার্জ - ০১৭১১××××××",
      time: "৬:৪৫ PM", 
      date: t.yesterday
    }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header - bKash Style */}
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold">{t.appName}</h1>
              <p className="text-pink-100 text-sm">{t.goodMorning}, {t.userName}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <Globe className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Balance Card - bKash Style */}
          <div 
            className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 cursor-pointer hover:bg-white/20 transition-all"
            onClick={() => setBalanceVisible(!balanceVisible)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-pink-100 text-sm mb-1">{t.yourBalance}</p>
                <div className="flex items-center space-x-3">
                  {balanceVisible ? (
                    <span className="text-3xl font-bold">
                      ৳ {parseFloat(localStorage.getItem('userBalance') || '5000').toLocaleString()}
                    </span>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">{t.tapToSeeBalance}</span>
                      <div className="flex space-x-1 mt-1">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-white/50 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBalanceVisible(!balanceVisible);
                    }}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    {balanceVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <QrCode className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - bKash Grid Style */}
      <div className="p-4 -mt-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className={`${action.color} p-4 rounded-xl hover:scale-105 transition-all duration-200 border border-gray-100 block`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-2 rounded-full bg-gray-50">
                      <Icon className={`h-6 w-6 ${action.iconColor}`} />
                    </div>
                    <span className={`text-xs font-medium ${action.textColor} text-center leading-tight`}>
                      {action.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Special Features */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 text-center">বিশেষ সেবাসমূহ</h3>
          <div className="grid grid-cols-1 gap-3">
            {specialFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className={`${feature.color} p-4 rounded-xl hover:scale-105 transition-all duration-200 text-white`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-lg">{feature.label}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <h2 className="font-bold text-gray-800">{t.recentTransactions}</h2>
            <button className="text-bkash-500 text-sm font-medium">{t.viewAll}</button>
          </div>
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'sent' ? 'bg-red-100' :
                      transaction.type === 'received' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      {transaction.type === 'sent' ? (
                        <Send className="h-4 w-4 text-red-600" />
                      ) : transaction.type === 'received' ? (
                        <Download className="h-4 w-4 text-green-600" />
                      ) : (
                        <Smartphone className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${
                      transaction.amount > 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}৳ {Math.abs(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
