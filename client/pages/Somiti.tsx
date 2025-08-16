import { useState } from "react";
import { 
  PiggyBank, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Clock,
  User,
  Building2,
  Users
} from "lucide-react";
import { Language } from "../App";

interface SomitiProps {
  language: Language;
}

const translations = {
  en: {
    loanManager: "লোন ম্যানেজার",
    myAccount: "আমার অ্যাকাউন্ট",
    loans: "ঋণ",
    installments: "কিস্তি",
    loanDetails: "ঋণের বিবরণ",
    loanProvider: "ঋণদাতা প্রতিষ্ঠান",
    memberId: "সদস্য আইডি",
    joinDate: "যোগদানের তারিখ",
    activeLoan: "সক্রিয় ঋণ",
    loanAmount: "ঋণের পরিমাণ",
    remainingAmount: "বাকি টাকা",
    monthlyInstallment: "মাসিক কিস্তি",
    nextPayment: "পরবর্তী পেমেন্ট",
    payInstallment: "কিস্তি পরিশোধ",
    loanHistory: "ঋণের ইতিহাস",
    recentPayments: "সাম্প্রতিক পেমেন্ট",
    installmentPayment: "কিস্তির টাকা",
    payNow: "এখনই পরিশোধ করুন",
    applyNewLoan: "নতুন ঋণের আবেদন",
    interestRate: "সুদের হার"
  },
  bn: {
    loanManager: "লোন ম্যানেজার",
    myAccount: "আমার অ্যাকাউন্ট", 
    loans: "ঋণ",
    installments: "কিস্তি",
    loanDetails: "ঋণের বিবরণ",
    loanProvider: "ঋণদাতা প্রতিষ্ঠান",
    memberId: "সদস্য আইডি",
    joinDate: "যোগদানের তারিখ",
    activeLoan: "সক্রিয় ঋণ",
    loanAmount: "ঋণের পরিমাণ", 
    remainingAmount: "বাকি টাকা",
    monthlyInstallment: "মাসিক কিস্তি",
    nextPayment: "পরবর্তী পেমেন্ট",
    payInstallment: "কিস্তি পরিশোধ",
    loanHistory: "ঋণের ইতিহাস",
    recentPayments: "সাম্প্রতিক পেমেন্ট",
    installmentPayment: "কিস্তির টাকা",
    payNow: "এখনই পরিশোধ করুন",
    applyNewLoan: "নতুন ঋণের আবেদন",
    interestRate: "সুদের হার"
  }
};

export default function Somiti({ language }: SomitiProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'installments'>('overview');
  const t = translations[language];

  const memberInfo = {
    providerName: "ঢাকা কমিউনিটি লোন সার্ভিস",
    memberId: "DLS-2024-001",
    joinDate: "১৫ জানুয়ারি, ২০২৪",
    activeLoanAmount: 50000,
    remainingAmount: 35000,
    monthlyInstallment: 5500,
    nextPaymentDate: "১০ ডিসেম্বর, ২০২৪",
    interestRate: "১২% বার্ষিক"
  };

  const loanTransactions = [
    {
      id: 1,
      type: "payment",
      amount: 5500,
      date: "১ ডিসেম্বর, ২০২৪",
      description: "মাসিক কিস্তি",
      status: "paid"
    },
    {
      id: 2,
      type: "payment",
      amount: 5500,
      date: "১০ ডিসেম্বর, ২০২৪",
      description: "মাসিক কিস্তি",
      status: "due"
    },
    {
      id: 3,
      type: "payment",
      amount: 5500,
      date: "১ নভেম্বর, ২০২৪",
      description: "মাসিক কিস্তি",
      status: "paid"
    }
  ];

  const loanHistory = [
    {
      id: 1,
      amount: 30000,
      purpose: "ব্যবসার জন্য",
      startDate: "জানুয়ারি ২০২৩",
      endDate: "ডিসেম্বর ২০২৩",
      status: "completed"
    },
    {
      id: 2,
      amount: 50000,
      purpose: "বাড়ি সংস্কার",
      startDate: "জানুয়ারি ২০২৪",
      endDate: "ডিসেম্বর ২০২৫",
      status: "active"
    }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">{t.loanManager}</h1>
        </div>
        
        {/* Member Info Card */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold">{memberInfo.providerName}</h2>
              <p className="text-sm text-pink-100">আইডি: {memberInfo.memberId}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-pink-200">{t.joinDate}</p>
              <p className="font-medium">{memberInfo.joinDate}</p>
            </div>
            <div>
              <p className="text-pink-200">স্ট্যাটাস</p>
              <p className="font-medium text-green-300">সক্রিয় সদস্য</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.myAccount}
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'loans'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.loans}
          </button>
          <button
            onClick={() => setActiveTab('installments')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'installments'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.installments}
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Active Loan Overview */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{t.activeLoan}</h3>
                  <p className="text-sm text-gray-600">{t.loanAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">৳{memberInfo.activeLoanAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600">{t.remainingAmount}</p>
                  <p className="font-bold text-red-600">৳{memberInfo.remainingAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600">{t.interestRate}</p>
                  <p className="font-bold text-gray-900">{memberInfo.interestRate}</p>
                </div>
              </div>

              <button className="w-full bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors">
                {t.applyNewLoan}
              </button>
            </div>

            {/* Next Payment */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{t.nextPayment}</h3>
                  <p className="text-sm text-gray-600">{memberInfo.nextPaymentDate} এর মধ্যে</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600">৳{memberInfo.monthlyInstallment}</p>
                </div>
              </div>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors">
                {t.payNow}
              </button>
            </div>
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === 'loans' && (
          <div className="space-y-4">
            {/* Current Loan Details */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white">
              <h3 className="font-bold mb-2">{t.activeLoan}</h3>
              <p className="text-3xl font-bold mb-1">৳{memberInfo.activeLoanAmount.toLocaleString()}</p>
              <p className="text-red-100 text-sm">বাকি: ৳{memberInfo.remainingAmount.toLocaleString()}</p>
            </div>

            {/* Loan History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">{t.loanHistory}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {loanHistory.map((loan) => (
                  <div key={loan.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">৳{loan.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{loan.purpose}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          loan.status === 'active' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {loan.status === 'active' ? 'চলমান' : 'সম্পন্ন'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{loan.startDate} - {loan.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Installments Tab */}
        {activeTab === 'installments' && (
          <div className="space-y-4">
            {/* Monthly Installment Info */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
              <h3 className="font-bold mb-2">{t.monthlyInstallment}</h3>
              <p className="text-3xl font-bold mb-1">৳{memberInfo.monthlyInstallment}</p>
              <p className="text-blue-100 text-sm">পরবর্তী: {memberInfo.nextPaymentDate}</p>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">{t.recentPayments}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {loanTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {transaction.status === 'paid' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">৳{transaction.amount}</p>
                      <p className={`text-xs ${
                        transaction.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {transaction.status === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
