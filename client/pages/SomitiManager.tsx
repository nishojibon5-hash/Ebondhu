import { useState, useEffect } from "react";
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
  Calculator,
  Search,
  Edit,
  Save,
  X,
  Filter,
  ChevronDown,
  UserPlus,
  Briefcase,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";

interface Worker {
  id: number;
  name: string;
  phone: string;
  area: string;
  joinDate: string;
  totalMembers: number;
  todayCollection: number;
}

interface Member {
  id: number;
  code: string;
  name: string;
  nid: string;
  phone: string;
  workerId: number;
  workerName: string;
  savingsAmount: number;
  loanAmount: number;
  totalSavings: number;
  totalInstallments: number;
  remainingLoan: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface Collection {
  id: number;
  date: string;
  memberId: number;
  memberName: string;
  workerId: number;
  workerName: string;
  savingsAmount: number;
  installmentAmount: number;
  type: 'savings' | 'installment' | 'both';
}

export default function SomitiManager() {
  const [activeTab, setActiveTab] = useState<'overview' | 'workers' | 'members' | 'collection' | 'reports'>('overview');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);

  // Sample data
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: 1,
      name: "আব্দুল করিম",
      phone: "01711111111",
      area: "মিরপুর এলাকা",
      joinDate: "জানুয়ারি ২০২৩",
      totalMembers: 15,
      todayCollection: 8500
    },
    {
      id: 2,
      name: "রহিমা খাতুন",
      phone: "01722222222", 
      area: "ধানমন্ডি এলাকা",
      joinDate: "ফেব্রুয়ারি ২০২৩",
      totalMembers: 12,
      todayCollection: 6500
    }
  ]);

  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      code: "M001",
      name: "ফাতেমা খাতুন",
      nid: "1234567890123",
      phone: "01811111111",
      workerId: 1,
      workerName: "আব্দুল করিম",
      savingsAmount: 1000,
      loanAmount: 15000,
      totalSavings: 12000,
      totalInstallments: 3000,
      remainingLoan: 12000,
      joinDate: "জানুয়ারি ২০২৩",
      status: 'active'
    },
    {
      id: 2,
      code: "M002", 
      name: "রহিমা বেগম",
      nid: "9876543210987",
      phone: "01822222222",
      workerId: 1,
      workerName: "আব্দুল করিম",
      savingsAmount: 1000,
      loanAmount: 0,
      totalSavings: 11000,
      totalInstallments: 0,
      remainingLoan: 0,
      joinDate: "ফেব্রুয়ারি ২০২৩",
      status: 'active'
    }
  ]);

  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 1,
      date: "২০২৪-১২-০১",
      memberId: 1,
      memberName: "ফাতেমা খাতুন",
      workerId: 1,
      workerName: "আব্দুল করিম",
      savingsAmount: 1000,
      installmentAmount: 1500,
      type: 'both'
    },
    {
      id: 2,
      date: "২০২৪-১২-০১",
      memberId: 2,
      memberName: "রহিমা বেগম",
      workerId: 1,
      workerName: "আব্দুল করিম",
      savingsAmount: 1000,
      installmentAmount: 0,
      type: 'savings'
    }
  ]);

  const [newWorker, setNewWorker] = useState({ name: '', phone: '', area: '' });
  const [newMember, setNewMember] = useState({
    code: '',
    name: '',
    nid: '',
    phone: '',
    workerId: '',
    savingsAmount: '',
    loanAmount: ''
  });
  const [newCollection, setNewCollection] = useState({
    workerId: '',
    memberId: '',
    savingsAmount: '',
    installmentAmount: ''
  });

  const somitiInfo = {
    name: "আশা সমিতি",
    established: "জানুয়ারি ২০২৩",
    totalMembers: members.length,
    totalWorkers: workers.length,
    totalFund: members.reduce((sum, m) => sum + m.totalSavings, 0),
    activeLoans: members.filter(m => m.remainingLoan > 0).length,
    monthlyCollection: 25000,
    todayCollection: collections
      .filter(c => c.date === new Date().toISOString().split('T')[0])
      .reduce((sum, c) => sum + c.savingsAmount + c.installmentAmount, 0)
  };

  const filteredMembers = members.filter(member => {
    if (selectedWorker && member.workerId !== selectedWorker) return false;
    if (searchTerm) {
      return member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             member.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
             member.workerName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const filteredCollections = collections.filter(collection => {
    let matchesSearch = true;
    let matchesDate = true;

    if (searchTerm) {
      matchesSearch = collection.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     collection.workerName.toLowerCase().includes(searchTerm.toLowerCase());
    }

    if (dateFilter.from && dateFilter.to) {
      const collectionDate = new Date(collection.date);
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      matchesDate = collectionDate >= fromDate && collectionDate <= toDate;
    }

    return matchesSearch && matchesDate;
  });

  const handleAddWorker = () => {
    if (newWorker.name && newWorker.phone && newWorker.area) {
      const worker: Worker = {
        id: workers.length + 1,
        ...newWorker,
        joinDate: new Date().toLocaleDateString('bn-BD'),
        totalMembers: 0,
        todayCollection: 0
      };
      setWorkers([...workers, worker]);
      setNewWorker({ name: '', phone: '', area: '' });
      setShowModal(null);
    }
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.nid && newMember.workerId) {
      const worker = workers.find(w => w.id === Number(newMember.workerId));
      const member: Member = {
        id: members.length + 1,
        code: newMember.code || `M${String(members.length + 1).padStart(3, '0')}`,
        name: newMember.name,
        nid: newMember.nid,
        phone: newMember.phone,
        workerId: Number(newMember.workerId),
        workerName: worker?.name || '',
        savingsAmount: Number(newMember.savingsAmount) || 0,
        loanAmount: Number(newMember.loanAmount) || 0,
        totalSavings: Number(newMember.savingsAmount) || 0,
        totalInstallments: 0,
        remainingLoan: Number(newMember.loanAmount) || 0,
        joinDate: new Date().toLocaleDateString('bn-BD'),
        status: 'active'
      };
      setMembers([...members, member]);
      setNewMember({
        code: '',
        name: '',
        nid: '',
        phone: '',
        workerId: '',
        savingsAmount: '',
        loanAmount: ''
      });
      setShowModal(null);
    }
  };

  const handleAddCollection = () => {
    if (newCollection.workerId && newCollection.memberId) {
      const member = members.find(m => m.id === Number(newCollection.memberId));
      const worker = workers.find(w => w.id === Number(newCollection.workerId));
      
      const collection: Collection = {
        id: collections.length + 1,
        date: new Date().toISOString().split('T')[0],
        memberId: Number(newCollection.memberId),
        memberName: member?.name || '',
        workerId: Number(newCollection.workerId),
        workerName: worker?.name || '',
        savingsAmount: Number(newCollection.savingsAmount) || 0,
        installmentAmount: Number(newCollection.installmentAmount) || 0,
        type: newCollection.savingsAmount && newCollection.installmentAmount ? 'both' :
              newCollection.savingsAmount ? 'savings' : 'installment'
      };
      
      setCollections([...collections, collection]);
      setNewCollection({
        workerId: '',
        memberId: '',
        savingsAmount: '',
        installmentAmount: ''
      });
      setShowModal(null);
    }
  };

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
              <Home className="h-6 w-6" />
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
            <div>
              <p className="text-pink-200">কর্মী</p>
              <p className="font-bold text-lg">{somitiInfo.totalWorkers}জন</p>
            </div>
            <div>
              <p className="text-pink-200">আজকের সংগ্রহ</p>
              <p className="font-bold text-lg">৳{somitiInfo.todayCollection.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {[
            { key: 'overview', label: 'ওভারভিউ' },
            { key: 'workers', label: 'কর্মী' },
            { key: 'members', label: 'সদস্য' },
            { key: 'collection', label: 'সংগ্রহ' },
            { key: 'reports', label: 'রিপোর্ট' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-bkash-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">দ্রুত কার্যক্রম</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowModal('addWorker')}
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-blue-900">কর্মী যোগ করুন</span>
                </button>
                
                <button
                  onClick={() => setShowModal('addMember')}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <UserPlus className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-green-900">সদস্য যোগ করুন</span>
                </button>
                
                <button
                  onClick={() => setShowModal('dailyCollection')}
                  className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  <Calculator className="h-6 w-6 text-purple-600" />
                  <span className="font-medium text-purple-900">দৈনিক সংগ্রহ</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('reports')}
                  className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <FileText className="h-6 w-6 text-orange-600" />
                  <span className="font-medium text-orange-900">সংগ্রহ তালিকা</span>
                </button>
              </div>
            </div>

            {/* Statistics */}
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
          </div>
        )}

        {/* Workers Tab */}
        {activeTab === 'workers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">কর্মী তালিকা</h3>
              <button
                onClick={() => setShowModal('addWorker')}
                className="bg-bkash-500 hover:bg-bkash-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>নতুন কর্মী</span>
              </button>
            </div>

            {workers.map((worker) => (
              <div key={worker.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{worker.name}</h4>
                      <p className="text-sm text-gray-500">{worker.phone}</p>
                      <p className="text-xs text-gray-400">{worker.area}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">মোট সদস্য</p>
                    <p className="font-bold text-gray-900">{worker.totalMembers}জন</p>
                  </div>
                  <div>
                    <p className="text-gray-500">আজকের সংগ্রহ</p>
                    <p className="font-bold text-green-600">৳{worker.todayCollection}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">যোগদানের তারিখ</p>
                    <p className="font-bold text-gray-900">{worker.joinDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">সদস্য তালিকা</h3>
              <button
                onClick={() => setShowModal('addMember')}
                className="bg-bkash-500 hover:bg-bkash-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>নতুন সদস্য</span>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="সদস্য/কর্মির নাম বা কোড দিয়ে সার্চ করুন"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedWorker || ''}
                  onChange={(e) => setSelectedWorker(e.target.value ? Number(e.target.value) : null)}
                  className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                >
                  <option value="">সব কর্মী</option>
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>{worker.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-500">কোড: {member.code}</p>
                      <p className="text-xs text-gray-400">কর্মী: {member.workerName}</p>
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
                    <p className="text-gray-500">মোট সঞ্চয়</p>
                    <p className="font-bold text-green-600">৳{member.totalSavings}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">বকেয়া ঋণ</p>
                    <p className="font-bold text-red-600">৳{member.remainingLoan}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">মাসিক সঞ্চয়</p>
                    <p className="font-bold text-blue-600">৳{member.savingsAmount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collection Tab */}
        {activeTab === 'collection' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">দৈনিক সংগ্রহ</h3>
              <button
                onClick={() => setShowModal('dailyCollection')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                নতুন সংগ্রহ
              </button>
            </div>

            {/* Collection Summary */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
              <h3 className="font-bold mb-2">আজকের সংগ্রহ</h3>
              <p className="text-3xl font-bold">৳{somitiInfo.todayCollection.toLocaleString()}</p>
              <p className="text-green-100 text-sm">মোট {collections.filter(c => c.date === new Date().toISOString().split('T')[0]).length}টি এন্ট্রি</p>
            </div>

            {/* Recent Collections */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">সাম্প্র��িক সংগ্রহ</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {collections.slice(0, 10).map((collection) => (
                  <div key={collection.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{collection.memberName}</p>
                        <p className="text-sm text-gray-500">কর্মী: {collection.workerName}</p>
                        <p className="text-xs text-gray-400">{collection.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {collection.savingsAmount > 0 && (
                        <p className="text-sm text-green-600">সঞ্চয়: ৳{collection.savingsAmount}</p>
                      )}
                      {collection.installmentAmount > 0 && (
                        <p className="text-sm text-blue-600">কিস্তি: ৳{collection.installmentAmount}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">সংগ্রহ তালিকা ও রিপোর্ট</h3>

            {/* Search and Date Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="সদস্য বা কর্মির নাম দিয়ে সার্চ করুন"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    placeholder="শুরুর তারিখ"
                    value={dateFilter.from}
                    onChange={(e) => setDateFilter({...dateFilter, from: e.target.value})}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    placeholder="শেষ তারিখ"
                    value={dateFilter.to}
                    onChange={(e) => setDateFilter({...dateFilter, to: e.target.value})}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Filtered Collections */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">ফিল্টার করা সংগ্রহ ({filteredCollections.length})</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredCollections.map((collection) => (
                  <div key={collection.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{collection.memberName}</p>
                        <p className="text-sm text-gray-500">কর্মী: {collection.workerName}</p>
                        <p className="text-xs text-gray-400">{collection.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ৳{(collection.savingsAmount + collection.installmentAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {collection.type === 'both' ? 'সঞ্চয় + কিস্তি' :
                         collection.type === 'savings' ? 'সঞ্চয়' : 'কিস্তি'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
            
            {/* Add Worker Modal */}
            {showModal === 'addWorker' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">নতুন কর্মী যোগ করুন</h3>
                  <button onClick={() => setShowModal(null)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="কর্মীর নাম"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="মোবাইল নম্বর"
                    value={newWorker.phone}
                    onChange={(e) => setNewWorker({...newWorker, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="এলাকা"
                    value={newWorker.area}
                    onChange={(e) => setNewWorker({...newWorker, area: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowModal(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={handleAddWorker}
                    className="flex-1 bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    যোগ করুন
                  </button>
                </div>
              </>
            )}

            {/* Add Member Modal */}
            {showModal === 'addMember' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">নতুন সদস্য যোগ করুন</h3>
                  <button onClick={() => setShowModal(null)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="সদস্যের কোড (ঐচ্ছিক)"
                    value={newMember.code}
                    onChange={(e) => setNewMember({...newMember, code: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="সদস্যের নাম *"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="জাতীয় পরিচয়পত্র *"
                    value={newMember.nid}
                    onChange={(e) => setNewMember({...newMember, nid: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="মোবাইল নম্বর"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                  <select
                    value={newMember.workerId}
                    onChange={(e) => setNewMember({...newMember, workerId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  >
                    <option value="">কর্মী নির্বাচন করুন *</option>
                    {workers.map((worker) => (
                      <option key={worker.id} value={worker.id}>{worker.name} - {worker.area}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="সঞ্চয়ের পরিমাণ (ঐচ্ছিক)"
                    value={newMember.savingsAmount}
                    onChange={(e) => setNewMember({...newMember, savingsAmount: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="ঋণের পরিমাণ (ঐচ্ছিক)"
                    value={newMember.loanAmount}
                    onChange={(e) => setNewMember({...newMember, loanAmount: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowModal(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={handleAddMember}
                    className="flex-1 bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    যোগ করুন
                  </button>
                </div>
              </>
            )}

            {/* Daily Collection Modal */}
            {showModal === 'dailyCollection' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">দৈনিক সংগ্রহ</h3>
                  <button onClick={() => setShowModal(null)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <select
                    value={newCollection.workerId}
                    onChange={(e) => {
                      setNewCollection({...newCollection, workerId: e.target.value, memberId: ''});
                    }}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  >
                    <option value="">কর্মী নির্বাচন করুন *</option>
                    {workers.map((worker) => (
                      <option key={worker.id} value={worker.id}>{worker.name}</option>
                    ))}
                  </select>
                  
                  {newCollection.workerId && (
                    <select
                      value={newCollection.memberId}
                      onChange={(e) => setNewCollection({...newCollection, memberId: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                    >
                      <option value="">সদস্য নির্বাচন করুন *</option>
                      {members
                        .filter(member => member.workerId === Number(newCollection.workerId))
                        .map((member) => (
                          <option key={member.id} value={member.id}>{member.name} ({member.code})</option>
                        ))}
                    </select>
                  )}
                  
                  <input
                    type="number"
                    placeholder="সঞ্চয়ের পরিমাণ"
                    value={newCollection.savingsAmount}
                    onChange={(e) => setNewCollection({...newCollection, savingsAmount: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="কিস্তির পরিমাণ"
                    value={newCollection.installmentAmount}
                    onChange={(e) => setNewCollection({...newCollection, installmentAmount: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowModal(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={handleAddCollection}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    সংগ্রহ করুন
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Member Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">সদস্য প্রোফাইল</h3>
              <button onClick={() => setSelectedMember(null)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Member Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-2">{selectedMember.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">কোড</p>
                    <p className="font-medium">{selectedMember.code}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">মোবাইল</p>
                    <p className="font-medium">{selectedMember.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">এনআইডি</p>
                    <p className="font-medium">{selectedMember.nid}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">কর্মী</p>
                    <p className="font-medium">{selectedMember.workerName}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-green-600 text-sm font-medium">মোট সঞ্চয়</p>
                  <p className="text-green-900 font-bold text-lg">৳{selectedMember.totalSavings}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-red-600 text-sm font-medium">বকেয়া ঋণ</p>
                  <p className="text-red-900 font-bold text-lg">৳{selectedMember.remainingLoan}</p>
                </div>
              </div>

              {/* Recent Collections for this member */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">সাম্প্রতিক সংগ্রহ</h4>
                <div className="space-y-2">
                  {collections
                    .filter(c => c.memberId === selectedMember.id)
                    .slice(0, 5)
                    .map((collection) => (
                      <div key={collection.id} className="bg-gray-50 rounded-lg p-3 flex justify-between">
                        <div>
                          <p className="font-medium text-sm">{collection.date}</p>
                          <p className="text-xs text-gray-500">
                            {collection.type === 'both' ? 'সঞ্চয় + কিস্তি' :
                             collection.type === 'savings' ? 'সঞ্চয়' : 'কিস্তি'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            ৳{(collection.savingsAmount + collection.installmentAmount)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMember(null)}
              className="w-full mt-6 bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
