import { useState, useEffect } from "react";
import {
  Plus,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Eye,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Edit,
  Pause,
  Play,
  Trash2,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'whatsapp' | 'website' | 'other';
  taskType: string;
  reward: number;
  targetUrl: string;
  createdBy: string;
  timeLimit: string;
  completed: number;
  maxCompletions: number;
  status: 'active' | 'paused' | 'completed';
  createdAt?: string;
  requirements?: Array<{id: number; description: string; isRequired: boolean}>;
  verificationMethod?: string;
  budget?: number;
  totalCost?: number;
}

export default function TaskEarning() {
  const [activeTab, setActiveTab] = useState<'browse' | 'myTasks'>('browse');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    loadTasks();
    loadCompletedTasks();
  }, []);

  const loadTasks = () => {
    // Load user's created tasks
    const userTasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
    setMyTasks(userTasks);

    // Load available tasks (demo tasks + other users' tasks)
    const demoTasks: Task[] = [
      {
        id: 1001,
        title: "আমার ফেসবুক পেজ ফলো করুন",
        description: "ব্যবসায়িক পেজে ফলো দিন এবং ৫০ টাকা আয় করুন",
        category: 'social-media',
        platform: 'facebook',
        taskType: 'follow',
        reward: 50,
        targetUrl: "https://facebook.com/example-page",
        createdBy: "রহিম উদ্দিন",
        timeLimit: "২৪ ঘন্টা",
        completed: 15,
        maxCompletions: 100,
        status: 'active'
      },
      {
        id: 1002,
        title: "ইনস্টাগ্রাম পোস্টে লাইক দিন",
        description: "নতুন পণ্যের পোস্টে লাইক দিয়ে ৩০ টাকা পান",
        category: 'social-media',
        platform: 'instagram',
        taskType: 'like',
        reward: 30,
        targetUrl: "https://instagram.com/p/example",
        createdBy: "ফাতেমা খাতুন",
        timeLimit: "১২ ঘন্টা",
        completed: 8,
        maxCompletions: 50,
        status: 'active'
      },
      {
        id: 1003,
        title: "ইউটিউব চ্যানেল সাবস্ক্রাইব",
        description: "শিক্ষামূলক চ্যানেল সাবস্ক্রাইব করে ১০০ টাকা আয় করুন",
        category: 'social-media',
        platform: 'youtube',
        taskType: 'subscribe',
        reward: 100,
        targetUrl: "https://youtube.com/c/example",
        createdBy: "করিম আহমেদ",
        timeLimit: "৪৮ ঘন্টা",
        completed: 25,
        maxCompletions: 200,
        status: 'active'
      }
    ];

    // Combine demo tasks with other users' tasks (excluding current user's tasks)
    setAvailableTasks(demoTasks);
  };

  const loadCompletedTasks = () => {
    const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    setCompletedTasks(completed);
  };


  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'instagram': return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'youtube': return <Youtube className="h-5 w-5 text-red-600" />;
      case 'whatsapp': return <MessageCircle className="h-5 w-5 text-green-600" />;
      case 'website': return <Eye className="h-5 w-5 text-gray-600" />;
      case 'other': return <DollarSign className="h-5 w-5 text-purple-600" />;
      default: return <Eye className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTaskTypeText = (taskType: string) => {
    switch (taskType) {
      case 'follow': return 'ফলো করুন';
      case 'like': return 'লাইক দিন';
      case 'share': return 'শেয়ার করুন';
      case 'comment': return 'কমেন্ট করুন';
      case 'subscribe': return 'সাবস্ক্রাইব করুন';
      default: return 'দেখুন';
    }
  };

  const handleStartTask = (task: Task) => {
    setSelectedTask(task);
    setIsWorking(true);
    setTrackingStatus('idle');
  };

  const handleTaskComplete = () => {
    if (!selectedTask) return;

    setTrackingStatus('checking');

    // Enhanced fraud detection simulation
    setTimeout(() => {
      // Multiple verification checks
      const verificationChecks = {
        urlVisited: Math.random() > 0.2, // 80% pass rate
        timeSpent: Math.random() > 0.3, // 70% pass rate (minimum time check)
        genuineAction: Math.random() > 0.25, // 75% pass rate (action verification)
        userHistory: Math.random() > 0.1 // 90% pass rate (user behavior check)
      };

      const passedChecks = Object.values(verificationChecks).filter(Boolean).length;
      const success = passedChecks >= 3; // At least 3 out of 4 checks must pass

      setTrackingStatus(success ? 'success' : 'failed');

      if (success && selectedTask) {
        // Add money to user balance
        const currentBalance = parseFloat(localStorage.getItem('userBalance') || '5000');
        const newBalance = currentBalance + selectedTask.reward;
        localStorage.setItem('userBalance', newBalance.toString());

        // Save completed task record
        const completedTask = {
          id: Date.now(),
          taskId: selectedTask.id,
          title: selectedTask.title,
          reward: selectedTask.reward,
          completedAt: new Date().toISOString(),
          verificationMethod: selectedTask.verificationMethod || 'screenshot'
        };

        const existingCompleted = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        existingCompleted.push(completedTask);
        localStorage.setItem('completedTasks', JSON.stringify(existingCompleted));

        // Update task completion count if it's a demo task
        if (selectedTask.id >= 1001) {
          setAvailableTasks(prev => prev.map(task =>
            task.id === selectedTask.id
              ? { ...task, completed: task.completed + 1 }
              : task
          ));
        }

        setTimeout(() => {
          setIsWorking(false);
          setSelectedTask(null);
          setTrackingStatus('idle');
          loadCompletedTasks();
        }, 2000);
      }
    }, 3000);
  };

  const pauseTask = (taskId: number) => {
    const updatedTasks = myTasks.map(task =>
      task.id === taskId ? { ...task, status: 'paused' as const } : task
    );
    setMyTasks(updatedTasks);
    localStorage.setItem('userTasks', JSON.stringify(updatedTasks));
  };

  const resumeTask = (taskId: number) => {
    const updatedTasks = myTasks.map(task =>
      task.id === taskId ? { ...task, status: 'active' as const } : task
    );
    setMyTasks(updatedTasks);
    localStorage.setItem('userTasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId: number) => {
    if (confirm('আপনি কি এই টাস্ক মুছে ফেলতে চান?')) {
      const task = myTasks.find(t => t.id === taskId);
      if (task) {
        // Refund remaining budget
        const remainingAmount = (task.maxCompletions - task.completed) * task.reward;
        const currentBalance = parseFloat(localStorage.getItem('userBalance') || '5000');
        const newBalance = currentBalance + remainingAmount;
        localStorage.setItem('userBalance', newBalance.toString());
      }

      const updatedTasks = myTasks.filter(task => task.id !== taskId);
      setMyTasks(updatedTasks);
      localStorage.setItem('userTasks', JSON.stringify(updatedTasks));
    }
  };

  if (isWorking && selectedTask) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                setIsWorking(false);
                setSelectedTask(null);
                setTrackingStatus('idle');
              }}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">টাস্ক সম্পন্ন করুন</h1>
          </div>
        </div>

        <div className="p-4">
          {/* Task Details */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              {getPlatformIcon(selectedTask.platform)}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{selectedTask.title}</h3>
                <p className="text-sm text-gray-600">{selectedTask.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-bkash-500">৳{selectedTask.reward}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-bold text-blue-900 mb-2">নির্দেশনা:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>১. নিচের লিংকে ক্লিক করুন</li>
                  <li>২. পেজটি {getTaskTypeText(selectedTask.taskType)}</li>
                  <li>৩. ব্যাক এসে "সম্পন্ন" বাটনে ক্লিক করুন</li>
                  <li>৪. আমরা যাচাই করে টাকা দিয়ে দেব</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <a
              href={selectedTask.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              <span>লিংকে যান</span>
            </a>

            {trackingStatus === 'idle' && (
              <button
                onClick={handleTaskComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-colors"
              >
                কাজ সম্পন্ন হয���েছে
              </button>
            )}

            {trackingStatus === 'checking' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                  <p className="text-yellow-800 font-medium">যাচাই করা হচ্ছে...</p>
                </div>
              </div>
            )}

            {trackingStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-bold">সফল! ৳{selectedTask.reward} আপনার অ্যাকাউন্টে যোগ হয়েছে</p>
                    <p className="text-green-600 text-sm">ধন্যবাদ!</p>
                  </div>
                </div>
              </div>
            )}

            {trackingStatus === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-red-800 font-bold">ক��জটি যাচাই করা যায়নি</p>
                    <p className="text-red-600 text-sm">সম্ভাব্য কারণ: অপর্যাপ্ত সময়, ভুল URL, বা প্রতারণামূলক কার্যকলাপ</p>
                    <p className="text-red-600 text-xs mt-1">আমাদের স্বয়ংক্রিয় সিস্টেম প্রতারণা প্রতিরোধে কাজ করে</p>
                  </div>
                </div>
                <button
                  onClick={() => setTrackingStatus('idle')}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  আবার চেষ্টা করুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link to="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">টাস্ক আর্নিং</h1>
          </div>
          <Link 
            to="/task-earning/create"
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/20 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'browse'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            কাজ খুঁজুন ({availableTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('myTasks')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'myTasks'
                ? 'bg-white text-bkash-500 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            আমার টাস্ক ({myTasks.length})
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Browse Tasks */}
        {activeTab === 'browse' && (
          <div className="space-y-4">
            {availableTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  {getPlatformIcon(task.platform)}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{task.description}</p>
                    <p className="text-xs text-gray-500">প্রকাশক: {task.createdBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-bkash-500">৳{task.reward}</p>
                    <p className="text-xs text-gray-500">{task.timeLimit}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>{task.completed}/{task.maxCompletions}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{task.timeLimit}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartTask(task)}
                    className="bg-bkash-500 hover:bg-bkash-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    শুরু করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Tasks */}
        {activeTab === 'myTasks' && (
          <div className="space-y-4">
            {myTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  {getPlatformIcon(task.platform)}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{task.description}</p>
                    <p className="text-xs text-gray-500">আপনার টাস্ক</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">৳{task.reward}</p>
                    <p className="text-xs text-gray-500">প্রতি কাজে</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>সম্পন্ন: {task.completed}/{task.maxCompletions}</p>
                    <p>মোট খরচ: ৳{task.completed * task.reward}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors">
                      সম্পাদনা
                    </button>
                    <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm transition-colors">
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {myTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">আপনার কোনো টাস্ক নেই</p>
                <Link 
                  to="/task-earning/create"
                  className="bg-bkash-500 hover:bg-bkash-600 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>নতুন টাস্ক তৈরি করুন</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
