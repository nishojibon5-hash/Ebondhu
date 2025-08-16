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
  Building
} from "lucide-react";
import { Language } from "../App";

interface SomitiProps {
  language: Language;
}

const translations = {
  en: {
    somitiManager: "Somiti Manager",
    mySomiti: "My Somiti",
    savings: "Savings",
    loans: "Loans",
    installments: "Installments",
    memberDetails: "Member Details",
    somitiName: "Somiti Name",
    membershipId: "Membership ID",
    joinDate: "Join Date",
    savingsAccount: "Savings Account",
    currentBalance: "Current Balance",
    monthlyTarget: "Monthly Target",
    nextInstallment: "Next Installment",
    loanAccount: "Loan Account",
    loanBalance: "Loan Balance",
    monthlyEmi: "Monthly EMI",
    dueDate: "Due Date",
    payInstallment: "Pay Installment",
    viewPassbook: "View Passbook",
    loanHistory: "Loan History",
    recentTransactions: "Recent Transactions",
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    loanPayment: "Loan Payment",
    interestEarned: "Interest Earned",
    payNow: "Pay Now",
    makeDeposit: "Make Deposit"
  },
  bn: {
    somitiManager: "সমিতি ম্যানেজার",
    mySomiti: "আমার সমিতি",
    savings: "সঞ্চয়",
    loans: "ঋণ",
    installments: "কিস্তি",
    memberDetails: "সদস্যের বিবরণ",
    somitiName: "সমিতির নাম",
    membershipId: "সদস্যপদ আইডি",
    joinDate: "যোগদানের তারিখ",
    savingsAccount: "সঞ্চয় অ্যাকাউন্ট",
    currentBalance: "বর্তমান ব্যালেন্স",
    monthlyTarget: "মাসিক লক্ষ্য",
    nextInstallment: "পরবর্তী কিস্তি",
    loanAccount: "ঋণ অ্যাকাউন্ট",
    loanBalance: "ঋণের ব্যালেন্স",
    monthlyEmi: "মাসিক কিস্তি",
    dueDate: "শেষ তারিখ",
    payInstallment: "কিস্তি প্রদান",
    viewPassbook: "পাসবুক দেখুন",
    loanHistory: "ঋণের ইতিহাস",
    recentTransactions: "সাম্প্রতিক লেনদেন",
    deposit: "জমা",
    withdrawal: "উত্তোলন",
    loanPayment: "ঋণ প্রদান",
    interestEarned: "অর্জিত সুদ",
    payNow: "এখনই পরিশোধ করুন",
    makeDeposit: "জমা করুন"
  }
};

export default function Somiti({ language }: SomitiProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'savings' | 'loans'>('overview');
  const t = translations[language];

  const memberInfo = {
    somitiName: "Dhaka Community Somiti",
    membershipId: "DC-2024-001",
    joinDate: "Jan 15, 2024",
    savingsBalance: 15000,
    monthlyTarget: 2000,
    nextSavingsDate: "Dec 15, 2024",
    loanBalance: 45000,
    monthlyEmi: 5000,
    nextEmiDate: "Dec 10, 2024"
  };

  const savingsTransactions = [
    {
      id: 1,
      type: "deposit",
      amount: 2000,
      date: "Dec 1, 2024",
      description: "Monthly Savings"
    },
    {
      id: 2,
      type: "interest",
      amount: 150,
      date: "Nov 30, 2024",
      description: "Monthly Interest"
    },
    {
      id: 3,
      type: "deposit",
      amount: 2000,
      date: "Nov 1, 2024",
      description: "Monthly Savings"
    }
  ];

  const loanTransactions = [
    {
      id: 1,
      type: "payment",
      amount: 5000,
      date: "Dec 1, 2024",
      description: "EMI Payment",
      status: "paid"
    },
    {
      id: 2,
      type: "payment",
      amount: 5000,
      date: "Dec 10, 2024",
      description: "EMI Payment",
      status: "due"
    }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
        <h1 className="text-xl font-bold mb-4">{t.somitiManager}</h1>
        
        {/* Member Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold">{memberInfo.somitiName}</h2>
              <p className="text-sm text-purple-100">ID: {memberInfo.membershipId}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-purple-200">{t.joinDate}</p>
              <p className="font-medium">{memberInfo.joinDate}</p>
            </div>
            <div>
              <p className="text-purple-200">Status</p>
              <p className="font-medium text-green-300">Active Member</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {t.mySomiti}
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'savings'
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {t.savings}
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'loans'
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {t.loans}
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Savings Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <PiggyBank className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.savingsAccount}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.currentBalance}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">৳{memberInfo.savingsBalance.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t.monthlyTarget}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">৳{memberInfo.monthlyTarget}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t.nextInstallment}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{memberInfo.nextSavingsDate}</p>
                </div>
              </div>
              <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
                {t.makeDeposit}
              </button>
            </div>

            {/* Loan Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <CreditCard className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.loanAccount}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.loanBalance}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">৳{memberInfo.loanBalance.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t.monthlyEmi}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">৳{memberInfo.monthlyEmi}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t.dueDate}</p>
                  <p className="font-semibold text-red-600 dark:text-red-400">{memberInfo.nextEmiDate}</p>
                </div>
              </div>
              <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors">
                {t.payInstallment}
              </button>
            </div>
          </div>
        )}

        {/* Savings Tab */}
        {activeTab === 'savings' && (
          <div className="space-y-4">
            {/* Savings Summary */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-2">{t.savingsAccount}</h3>
              <p className="text-3xl font-bold mb-1">৳{memberInfo.savingsBalance.toLocaleString()}</p>
              <p className="text-green-100 text-sm">{t.currentBalance}</p>
            </div>

            {/* Savings Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t.recentTransactions}</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {savingsTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        +৳{transaction.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === 'loans' && (
          <div className="space-y-4">
            {/* Loan Summary */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-2">{t.loanAccount}</h3>
              <p className="text-3xl font-bold mb-1">৳{memberInfo.loanBalance.toLocaleString()}</p>
              <p className="text-red-100 text-sm">{t.loanBalance}</p>
            </div>

            {/* Upcoming Payment */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Payment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due on {memberInfo.nextEmiDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">৳{memberInfo.monthlyEmi}</p>
                </div>
              </div>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors">
                {t.payNow}
              </button>
            </div>

            {/* Loan Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t.loanHistory}</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {loanTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.status === 'paid' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'
                      }`}>
                        {transaction.status === 'paid' ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">৳{transaction.amount}</p>
                      <p className={`text-xs ${
                        transaction.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {transaction.status === 'paid' ? 'Paid' : 'Due'}
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
