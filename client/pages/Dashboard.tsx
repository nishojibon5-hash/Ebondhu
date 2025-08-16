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
  Globe
} from "lucide-react";
import { Language } from "../App";

interface DashboardProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const translations = {
  en: {
    goodMorning: "Good Morning",
    userName: "John Doe",
    yourBalance: "Your Balance",
    sendMoney: "Send Money",
    cashIn: "Cash In",
    cashOut: "Cash Out",
    recharge: "Recharge",
    billPay: "Bill Pay",
    qrPay: "QR Pay",
    recentTransactions: "Recent Transactions",
    viewAll: "View All",
    sent: "Sent",
    received: "Received",
    recharged: "Mobile Recharge",
    today: "Today",
    yesterday: "Yesterday"
  },
  bn: {
    goodMorning: "সুপ্রভাত",
    userName: "জন ��ো",
    yourBalance: "আপনার ব্যালেন্স",
    sendMoney: "টাকা পাঠান",
    cashIn: "ক্যাশ ইন",
    cashOut: "ক্যাশ আউট",
    recharge: "রিচার্জ",
    billPay: "বিল পে",
    qrPay: "কিউআর পে",
    recentTransactions: "সাম্প্রতিক লেনদেন",
    viewAll: "সব দেখুন",
    sent: "পাঠানো",
    received: "গ্রহণ করা",
    recharged: "মোবাইল রিচার্জ",
    today: "আজ",
    yesterday: "গতকাল"
  }
};

export default function Dashboard({ language, setLanguage }: DashboardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const t = translations[language];

  const quickActions = [
    { icon: Send, label: t.sendMoney, color: "bg-blue-500" },
    { icon: Download, label: t.cashIn, color: "bg-green-500" },
    { icon: Upload, label: t.cashOut, color: "bg-red-500" },
    { icon: Smartphone, label: t.recharge, color: "bg-purple-500" },
    { icon: Receipt, label: t.billPay, color: "bg-orange-500" },
    { icon: QrCode, label: t.qrPay, color: "bg-indigo-500" },
  ];

  const transactions = [
    {
      id: 1,
      type: "sent",
      amount: -1500,
      description: "To 01711XXXXXX",
      time: "10:30 AM",
      date: t.today
    },
    {
      id: 2,
      type: "received",
      amount: 2500,
      description: "From Employer",
      time: "2:15 PM",
      date: t.yesterday
    },
    {
      id: 3,
      type: "recharge",
      amount: -100,
      description: "Mobile Recharge",
      time: "6:45 PM",
      date: t.yesterday
    }
  ];

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold">{t.goodMorning}</h1>
            <p className="text-blue-100">{t.userName}</p>
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

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">{t.yourBalance}</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  {balanceVisible ? "৳ 12,450.50" : "৳ ••••••"}
                </span>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  {balanceVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white rounded-lg p-3">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className={`${action.color} p-3 rounded-full mb-2`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">{t.recentTransactions}</h2>
            <button className="text-blue-600 text-sm font-medium">{t.viewAll}</button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'sent' ? 'bg-red-100 dark:bg-red-900/20' :
                    transaction.type === 'received' ? 'bg-green-100 dark:bg-green-900/20' :
                    'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    {transaction.type === 'sent' ? (
                      <Send className={`h-4 w-4 ${
                        transaction.type === 'sent' ? 'text-red-600 dark:text-red-400' : ''
                      }`} />
                    ) : transaction.type === 'received' ? (
                      <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.date} • {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.amount > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}৳ {Math.abs(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
