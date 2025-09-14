import { useState } from "react";
import { 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Upload,
  Filter,
  Briefcase
} from "lucide-react";
import { Language } from "../App";

interface TasksProps {
  language: Language;
}

const translations = {
  en: {
    earningsCenter: "আয়ের কেন্দ্র",
    availableWorks: "উপলব্ধ কাজ",
    mySubmissions: "আমার জমা",
    earnings: "আয়",
    totalEarned: "মোট আয়",
    pendingPayment: "অপেক্ষমাণ পেমেন্ট",
    completedTasks: "সম্পন্ন কাজ",
    difficulty: "কঠিনতা",
    reward: "পুরস্কার",
    deadline: "শেষ তারিখ",
    startWork: "কাজ শুরু করুন",
    easy: "সহজ",
    medium: "মাঝার���", 
    hard: "কঠিন",
    pending: "অপেক্ষমাণ",
    approved: "অনুমোদি��",
    rejected: "প্রত্যাখ্যাত",
    submitProof: "প্রমাণ জমা দিন",
    viewDetails: "বিস্তারিত দেখুন",
    withdrawToWallet: "ওয়ালেটে তুলুন"
  },
  bn: {
    earningsCenter: "আয়ের কেন্দ্র",
    availableWorks: "উপলব্ধ কাজ", 
    mySubmissions: "আমার জমা",
    earnings: "আয়",
    totalEarned: "মোট আয়",
    pendingPayment: "অপেক্ষমাণ পেমেন্ট",
    completedTasks: "সম্পন্ন কাজ",
    difficulty: "কঠিনতা",
    reward: "পুরস্কার", 
    deadline: "শেষ তারিখ",
    startWork: "কাজ শুরু করুন",
    easy: "সহজ",
    medium: "মাঝারি",
    hard: "কঠিন",
    pending: "অপেক্ষমাণ",
    approved: "অনুমোদিত", 
    rejected: "প্রত্যাখ্যাত",
    submitProof: "প্রমাণ জমা দিন",
    viewDetails: "বিস্তারিত দেখুন",
    withdrawToWallet: "ওয়ালেটে তুলুন"
  }
};

export default function Tasks({ language }: TasksProps) {
  const [activeTab, setActiveTab] = useState<'available' | 'submissions' | 'earnings'>('available');
  const t = translations[language];

  const availableTasks = [
    {
      id: 1,
      title: "ফেসবুকে অ্যাপ শেয়ার করুন",
      description: "amarcash অ্যাপ আপনার ফেসবুক প্রোফাইলে শেয়ার করুন এবং ৩ জন বন্ধুকে ইনস্টল করতে বলুন",
      reward: 50,
      difficulty: "easy" as const,
      deadline: "২ দিন বাকি",
      category: "সোশ্যাল মিডিয়া"
    },
    {
      id: 2,
      title: "গুগল প্লে রিভিউ লিখুন",
      description: "গুগল প্লে স্টোরে বিস্তারিত ৫ তারকা রিভিউ লিখুন",
      reward: 25,
      difficulty: "easy" as const,
      deadline: "৫ দিন বাকি", 
      category: "রিভিউ"
    },
    {
      id: 3,
      title: "প্রমোশনাল ভিডিও তৈরি করুন",
      description: "amarcash বৈশিষ্ট্য প্রচারের জন্য ৩০ সেকেন্ডের ভিডি��� তৈরি করুন",
      reward: 200,
      difficulty: "hard" as const,
      deadline: "১ সপ্তাহ বাকি",
      category: "কনটেন্ট তৈরি"
    }
  ];

  const submissions = [
    {
      id: 1,
      title: "ফেসবুকে অ্যাপ শেয়ার",
      reward: 50,
      status: "pending" as const,
      submittedAt: "২ ঘন্টা আগে"
    },
    {
      id: 2,
      title: "অ্যাপ রিভিউ লেখা",
      reward: 25,
      status: "approved" as const,
      submittedAt: "১ দিন আগে"
    },
    {
      id: 3,
      title: "ইনস্টাগ্রাম স্টোরি পোস্ট",
      reward: 30,
      status: "rejected" as const,
      submittedAt: "৩ দিন আগে",
      feedback: "ছবির মান খুবই কম"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Briefcase className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">{t.earningsCenter}</h1>
          </div>
          <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/20 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'available'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {t.availableWorks}
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'submissions'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {t.mySubmissions}
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'earnings'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {t.earnings}
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Available Tasks Tab */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            {availableTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(task.difficulty)}`}>
                        {t[task.difficulty as keyof typeof t]}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{task.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-bkash-500" />
                      <span className="font-bold text-bkash-500">৳{task.reward}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{task.deadline}</span>
                    </div>
                  </div>
                  <button className="bg-bkash-500 hover:bg-bkash-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    {t.startWork}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{submission.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(submission.status)}
                      <span className={`text-sm font-medium capitalize ${
                        submission.status === 'pending' ? 'text-yellow-600' :
                        submission.status === 'approved' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {t[submission.status as keyof typeof t]}
                      </span>
                      <span className="text-xs text-gray-500">• {submission.submittedAt}</span>
                    </div>
                    {submission.status === 'rejected' && submission.feedback && (
                      <p className="text-sm text-red-600 mt-1 bg-red-50 p-2 rounded-lg">প্রতিক্রিয়া: {submission.feedback}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-bkash-500">৳{submission.reward}</p>
                  </div>
                </div>
                
                {submission.status === 'pending' && (
                  <div className="flex space-x-2 mt-3">
                    <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{t.submitProof}</span>
                    </button>
                    <button className="text-bkash-500 hover:text-bkash-600 px-3 py-2 text-sm font-medium">
                      {t.viewDetails}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-4">
            {/* Earnings Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm opacity-90">{t.totalEarned}</span>
                </div>
                <p className="text-2xl font-bold">৳১,২৫০</p>
                <button className="mt-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  {t.withdrawToWallet}
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm opacity-90">{t.pendingPayment}</span>
                </div>
                <p className="text-2xl font-bold">৳৩২৫</p>
                <p className="text-xs opacity-75 mt-1">৩টি কাজ অপেক্ষমাণ</p>
              </div>
            </div>

            {/* Earnings History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">সাম্প্রতিক আয়</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { task: "ফেসবুক শেয়ার", amount: 50, date: "আজ", status: "paid" },
                  { task: "অ্যাপ রিভিউ", amount: 25, date: "গতকাল", status: "paid" },
                  { task: "ইনস্টাগ্রাম পোস্ট", amount: 75, date: "২ দিন আগে", status: "pending" }
                ].map((earning, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{earning.task}</p>
                      <p className="text-sm text-gray-500">{earning.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-bkash-500">৳{earning.amount}</p>
                      <p className={`text-xs ${
                        earning.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {earning.status === 'paid' ? 'পরিশোধিত' : 'অপেক্ষমাণ'}
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
