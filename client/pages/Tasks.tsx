import { useState } from "react";
import { 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Upload,
  Filter
} from "lucide-react";
import { Language } from "../App";

interface TasksProps {
  language: Language;
}

const translations = {
  en: {
    taskBoard: "Task Board",
    availableTasks: "Available Tasks",
    mySubmissions: "My Submissions",
    earnings: "Earnings",
    totalEarned: "Total Earned",
    pendingPayment: "Pending Payment",
    completedTasks: "Completed Tasks",
    difficulty: "Difficulty",
    reward: "Reward",
    deadline: "Deadline",
    startTask: "Start Task",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    submitProof: "Submit Proof",
    viewDetails: "View Details"
  },
  bn: {
    taskBoard: "টাস্ক বোর্ড",
    availableTasks: "উপলব্ধ টাস্ক",
    mySubmissions: "আমার জমা",
    earnings: "আয়",
    totalEarned: "মোট আয়",
    pendingPayment: "অপেক্ষমাণ পেমেন্ট",
    completedTasks: "সম্পন্ন টাস্ক",
    difficulty: "কঠিনতা",
    reward: "পুরস্কার",
    deadline: "শেষ তারিখ",
    startTask: "টাস্ক শুরু করুন",
    easy: "সহজ",
    medium: "মাঝারি",
    hard: "কঠিন",
    pending: "অপেক্ষমাণ",
    approved: "অনুমোদিত",
    rejected: "প্রত্যাখ্যাত",
    submitProof: "প্রমাণ জমা দিন",
    viewDetails: "বিস্তারিত দেখুন"
  }
};

export default function Tasks({ language }: TasksProps) {
  const [activeTab, setActiveTab] = useState<'available' | 'submissions' | 'earnings'>('available');
  const t = translations[language];

  const availableTasks = [
    {
      id: 1,
      title: "Share app on Facebook",
      description: "Share WalletX Pro app on your Facebook profile and get 3 friends to install",
      reward: 50,
      difficulty: "easy" as const,
      deadline: "2 days left",
      category: "Social Media"
    },
    {
      id: 2,
      title: "Write Google Play Review",
      description: "Write a detailed 5-star review on Google Play Store",
      reward: 25,
      difficulty: "easy" as const,
      deadline: "5 days left",
      category: "Review"
    },
    {
      id: 3,
      title: "Create promotional video",
      description: "Create a 30-second video promoting WalletX Pro features",
      reward: 200,
      difficulty: "hard" as const,
      deadline: "1 week left",
      category: "Content Creation"
    }
  ];

  const submissions = [
    {
      id: 1,
      title: "Share app on Facebook",
      reward: 50,
      status: "pending" as const,
      submittedAt: "2 hours ago"
    },
    {
      id: 2,
      title: "Write app review",
      reward: 25,
      status: "approved" as const,
      submittedAt: "1 day ago"
    },
    {
      id: 3,
      title: "Instagram story post",
      reward: 30,
      status: "rejected" as const,
      submittedAt: "3 days ago",
      feedback: "Image quality is too low"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
    <div className="pb-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.taskBoard}</h1>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mt-4 space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'available'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {t.availableTasks}
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'submissions'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {t.mySubmissions}
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'earnings'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
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
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(task.difficulty)}`}>
                        {t[task.difficulty as keyof typeof t]}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{task.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>৳{task.reward}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{task.deadline}</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    {t.startTask}
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
              <div key={submission.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{submission.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(submission.status)}
                      <span className={`text-sm capitalize ${
                        submission.status === 'pending' ? 'text-yellow-600' :
                        submission.status === 'approved' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {t[submission.status as keyof typeof t]}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">• {submission.submittedAt}</span>
                    </div>
                    {submission.status === 'rejected' && submission.feedback && (
                      <p className="text-sm text-red-600 mt-1">Feedback: {submission.feedback}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">৳{submission.reward}</p>
                  </div>
                </div>
                
                {submission.status === 'pending' && (
                  <div className="flex space-x-2 mt-3">
                    <button className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{t.submitProof}</span>
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium">
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
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm opacity-90">{t.totalEarned}</span>
                </div>
                <p className="text-2xl font-bold">৳1,250</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm opacity-90">{t.pendingPayment}</span>
                </div>
                <p className="text-2xl font-bold">৳325</p>
              </div>
            </div>

            {/* Earnings History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Recent Earnings</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { task: "Facebook Share", amount: 50, date: "Today", status: "paid" },
                  { task: "App Review", amount: 25, date: "Yesterday", status: "paid" },
                  { task: "Instagram Post", amount: 75, date: "2 days ago", status: "pending" }
                ].map((earning, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{earning.task}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{earning.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">৳{earning.amount}</p>
                      <p className={`text-xs ${
                        earning.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {earning.status === 'paid' ? 'Paid' : 'Pending'}
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
