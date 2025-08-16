import { useState } from "react";
import { 
  ArrowLeft, 
  Users, 
  PlusCircle, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  FileText,
  Calculator
} from "lucide-react";
import { Link } from "react-router-dom";

interface Member {
  id: number;
  name: string;
  phone: string;
  joinDate: string;
  monthlyContribution: number;
  totalSavings: number;
  loanTaken: number;
  status: 'active' | 'inactive';
}

interface LoanRecord {
  id: number;
  memberName: string;
  amount: number;
  interestRate: number;
  installmentAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'active' | 'paid' | 'overdue';
}

export default function SomitiManager() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'loans' | 'collections'>('overview');
  const [showAddMember, setShowAddMember] = useState(false);

  const somitiInfo = {
    name: "আশা সমিতি",
    established: "জানুয়ারি ২০২৩",
    totalMembers: 25,
    totalFund: 125000,
    activeLoans: 8,
    monthlyCollection: 15000
  };

  const members: Member[] = [
    {
      id: 1,
      name: "ফাতেমা খাতুন",
      phone: "01711111111",
      joinDate: "জানুয়ারি ২০২৩",
      monthlyContribution: 1000,
      totalSavings: 12000,
      loanTaken: 15000,
      status: 'active'
    },
    {
      id: 2,
      name: "রহিমা বেগম",
      phone: "01722222222",
      joinDate: "ফেব্রুয়ারি ২০২৩",
      monthlyContribution: 1000,
      totalSavings: 11000,
      loanTaken: 0,
      status: 'active'
    },
    {
      id: 3,
      name: "সালমা আক্তার",
      phone: "01733333333",
      joinDate: "মার্চ ২০২৩",
      monthlyContribution: 1000,
      totalSavings: 10000,
      loanTaken: 8000,
      status: 'active'
    }
  ];

  const loanRecords: LoanRecord[] = [
    {
      id: 1,
      memberName: "ফাতেমা খাতুন",
      amount: 15000,
      interestRate: 12,
      installmentAmount: 1500,
      remainingAmount: 12000,
      dueDate: "১৫ ডিসেম্বর",
      status: 'active'
    },
    {
      id: 2,
      memberName: "সালমা আক্তার",
      amount: 8000,
      interestRate: 12,
      installmentAmount: 900,
      remainingAmount: 5000,
      dueDate: "২০ ডিসেম্বর",
      status: 'overdue'
    }
  ];

  const recentCollections = [
    { date: "১ ডিসেম্বর", member: "ফাতেমা খাতুন", amount: 1000, type: "সঞ্চয়" },
    { date: "১ ডিসেম্বর", member: "রহিমা বেগম", amount: 1000, type: "সঞ্চয়" },
    { date: "৫ ডিসেম্বর", member: "ফাতেমা খাতুন", amount: 1500, type: "ঋণ কিস্তি" },
    { date: "৮ ডিসেম্বর", member: "সালমা আক্তার", amount: 900, type: "ঋণ কিস্তি" }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link to="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">সমিতি ম্যানেজার</h1>
          </div>
          <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Somiti Info Card */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold">{somitiInfo.name}</h2>
              <p className="text-sm text-pink-100">প্রতিষ্ঠিত: {somitiInfo.established}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-pink-200">মোট সদস্য</p>
              <p className="font-bold text-lg">{somitiInfo.totalMembers}জন</p>
            </div>
            <div>
              <p className="text-pink-200">মোট তহবিল</p>
              <p className="font-bold text-lg">৳{somitiInfo.totalFund.toLocaleString()}</p>
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
            ওভারভিউ
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'members'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            সদস্যগণ
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'loans'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ঋণ
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'collections'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            আদায়
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">মাসিক সংগ্রহ</span>
                </div>
                <p className="text-2xl font-bold">৳{somitiInfo.monthlyCollection.toLocaleString()}</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm">সক্রিয় ঋণ</span>
                </div>
                <p className="text-2xl font-bold">{somitiInfo.activeLoans}টি</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">দ্রুত কার্যক্রম</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <PlusCircle className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-blue-900">নতুন সদস্য</span>
                </button>
                
                <button className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-green-900">ঋণ অনুমোদন</span>
                </button>
                
                <button className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <Calculator className="h-6 w-6 text-purple-600" />
                  <span className="font-medium text-purple-900">আয়-ব্যয় হিসাব</span>
                </button>
                
                <button className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                  <FileText className="h-6 w-6 text-orange-600" />
                  <span className="font-medium text-orange-900">রিপোর্ট তৈরি</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">সাম্প্রতিক কার্যক্রম</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentCollections.slice(0, 5).map((collection, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{collection.member}</p>
                      <p className="text-sm text-gray-500">{collection.date} • {collection.type}</p>
                    </div>
                    <p className="font-bold text-green-600">৳{collection.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">সদস্য তালিকা</h3>
              <button
                onClick={() => setShowAddMember(true)}
                className="bg-bkash-500 hover:bg-bkash-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>নতুন সদস্য</span>
              </button>
            </div>

            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-bkash-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-bkash-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.phone}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">মাসিক জমা</p>
                    <p className="font-bold text-gray-900">৳{member.monthlyContribution}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">মোট সঞ্চয়</p>
                    <p className="font-bold text-green-600">৳{member.totalSavings}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">ঋণ</p>
                    <p className="font-bold text-red-600">৳{member.loanTaken}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === 'loans' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">ঋণের তালিকা</h3>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                নতুন ঋণ অনুমোদন
              </button>
            </div>

            {loanRecords.map((loan) => (
              <div key={loan.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{loan.memberName}</h4>
                    <p className="text-sm text-gray-500">ঋণের পরিমাণ: ৳{loan.amount.toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    loan.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    loan.status === 'paid' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {loan.status === 'active' ? 'চলমান' : 
                     loan.status === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">মাসিক কিস্তি</p>
                    <p className="font-bold text-gray-900">৳{loan.installmentAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">বকেয়া</p>
                    <p className="font-bold text-red-600">৳{loan.remainingAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">সুদের হার</p>
                    <p className="font-bold text-gray-900">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">পরবর্তী কিস্তি</p>
                    <p className="font-bold text-orange-600">{loan.dueDate}</p>
                  </div>
                </div>
                
                {loan.status === 'overdue' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="text-red-800 text-sm font-medium">কিস্তি বকেয়া! যোগাযোগ করুন</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
              <h3 className="font-bold mb-2">এই মাসের স��গ্রহ</h3>
              <p className="text-3xl font-bold">৳{somitiInfo.monthlyCollection.toLocaleString()}</p>
              <p className="text-blue-100 text-sm">লক্ষ্য: ৳২৫,০০০</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">সাম্প্রতিক সংগ্রহ</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentCollections.map((collection, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        collection.type === 'সঞ্চয়' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {collection.type === 'সঞ্চয়' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{collection.member}</p>
                        <p className="text-sm text-gray-500">{collection.date} • {collection.type}</p>
                      </div>
                    </div>
                    <p className="font-bold text-green-600">৳{collection.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md">
            <h3 className="font-bold text-gray-900 mb-4">নতুন সদস্য যোগ করুন</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="সদস্যের নাম"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="মোবাইল নম্বর"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="মাসিক চাঁদার পরিমাণ"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddMember(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={() => setShowAddMember(false)}
                className="flex-1 bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                যোগ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
