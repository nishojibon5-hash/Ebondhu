import { useState } from "react";
import { 
  ArrowLeft,
  DollarSign,
  Clock,
  Users,
  Info,
  Upload,
  Eye,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Globe,
  Heart,
  Share,
  MessageSquare,
  UserPlus,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface TaskRequirement {
  id: number;
  description: string;
  isRequired: boolean;
}

interface TaskForm {
  title: string;
  description: string;
  category: string;
  platform: string;
  taskType: string;
  targetUrl: string;
  reward: number;
  maxCompletions: number;
  timeLimit: string;
  requirements: TaskRequirement[];
  verificationMethod: string;
  budget: number;
  isActive: boolean;
  tags: string[];
}

const categories = [
  { id: 'social-media', name: 'সোশ্যাল মিডিয়া', icon: MessageCircle },
  { id: 'content-creation', name: 'কনটেন্ট তৈরি', icon: Upload },
  { id: 'review-rating', name: 'রিভিউ ও রেটিং', icon: Star },
  { id: 'promotion', name: 'প্রমোশন', icon: Share },
  { id: 'data-entry', name: 'ডেটা এন্ট্রি', icon: Globe },
  { id: 'survey', name: 'সার্ভে ও গবেষণা', icon: Info },
  { id: 'design', name: 'ডিজাইন ও গ্রাফিক্স', icon: Eye },
  { id: 'writing', name: 'লেখালেখি', icon: MessageSquare }
];

const platforms = [
  { id: 'facebook', name: 'ফেসবুক', icon: Facebook, color: 'text-blue-600' },
  { id: 'instagram', name: 'ইনস্টাগ্রাম', icon: Instagram, color: 'text-pink-600' },
  { id: 'youtube', name: 'ইউটিউব', icon: Youtube, color: 'text-red-600' },
  { id: 'whatsapp', name: 'হোয়াটসঅ্যাপ', icon: MessageCircle, color: 'text-green-600' },
  { id: 'website', name: 'ওয়েবসাইট', icon: Globe, color: 'text-gray-600' },
  { id: 'other', name: 'অন্যান্য', icon: Info, color: 'text-purple-600' }
];

const taskTypes = {
  'social-media': [
    { id: 'follow', name: 'ফলো/লাইক করুন', icon: UserPlus },
    { id: 'like', name: 'লাইক দিন', icon: Heart },
    { id: 'share', name: 'শেয়ার করুন', icon: Share },
    { id: 'comment', name: 'কমেন্ট করুন', icon: MessageSquare },
    { id: 'subscribe', name: 'সাবস্ক্রাইব করুন', icon: UserPlus }
  ],
  'content-creation': [
    { id: 'video', name: 'ভিডিও তৈরি', icon: Upload },
    { id: 'photo', name: 'ছবি তৈরি', icon: Upload },
    { id: 'story', name: 'স্টোরি পোস্ট', icon: Upload },
    { id: 'article', name: 'আর্টিকেল লেখা', icon: MessageSquare }
  ],
  'review-rating': [
    { id: 'review', name: 'রিভিউ লিখুন', icon: Star },
    { id: 'rating', name: 'রেটিং দিন', icon: Star },
    { id: 'testimonial', name: 'প্রশংসাপত্র', icon: MessageSquare }
  ],
  'data-entry': [
    { id: 'form-fill', name: 'ফর��ম পূরণ', icon: Info },
    { id: 'data-collect', name: 'তথ্য সংগ্রহ', icon: Info },
    { id: 'typing', name: 'টাইপিং কাজ', icon: MessageSquare }
  ]
};

const verificationMethods = [
  { id: 'screenshot', name: 'স্ক্রিনশট', description: 'কাজের স্ক্রিনশট জমা দিতে হবে' },
  { id: 'link', name: 'লিংক শেয়ার', description: 'কাজের লিংক প্রমাণ হিসেবে দিতে হবে' },
  { id: 'username', name: 'ইউজারনেম দিন', description: 'প্রোফাইল ইউজারনেম দিতে হবে' },
  { id: 'manual', name: 'ম্যানুয়াল চেক', description: 'আমরা ম্যানুয়ালি যাচাই করব' }
];

export default function TaskCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TaskForm>({
    title: '',
    description: '',
    category: '',
    platform: '',
    taskType: '',
    targetUrl: '',
    reward: 50,
    maxCompletions: 100,
    timeLimit: '24',
    requirements: [
      { id: 1, description: 'প্রোফাইল সম্পূর্ণ করা থাকতে হবে', isRequired: true }
    ],
    verificationMethod: 'screenshot',
    budget: 5000,
    isActive: true,
    tags: []
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.title.trim()) newErrors.title = 'টাস্কের শিরোনাম আবশ্যক';
    if (!formData.description.trim()) newErrors.description = 'বিস্তারিত বর্ণনা আবশ্যক';
    if (!formData.category) newErrors.category = 'ক্যাটেগরি নির্বাচন করুন';
    if (!formData.platform) newErrors.platform = 'প্ল্যাটফর্ম নির্বাচন করুন';
    if (!formData.taskType) newErrors.taskType = 'কাজের ধরন নির্বাচন করুন';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.targetUrl.trim()) newErrors.targetUrl = 'টার্গেট URL আবশ্যক';
    if (formData.reward < 5) newErrors.reward = 'ন্যূনতম পুরস্কার ৫ টাকা';
    if (formData.maxCompletions < 1) newErrors.maxCompletions = 'কমপক্ষে ১টি কাজ থাকতে হবে';
    if (!formData.timeLimit) newErrors.timeLimit = 'সময়সীমা নির্বাচন করুন';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: {[key: string]: string} = {};
    if (formData.requirements.length === 0) newErrors.requirements = 'কমপক্ষে একটি শর্ত থাকতে হবে';
    if (!formData.verificationMethod) newErrors.verificationMethod = 'যাচাইকরণ পদ্ধতি নির্বাচন করুন';
    if (formData.budget < formData.reward * formData.maxCompletions) {
      newErrors.budget = 'বাজেট মোট খরচের চেয়ে কম হতে পারে না';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep3()) {
      // Calculate total cost
      const totalCost = formData.reward * formData.maxCompletions;
      
      // Save task to localStorage
      const existingTasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
      const newTask = {
        ...formData,
        id: Date.now(),
        createdBy: 'আপনি',
        createdAt: new Date().toISOString(),
        completed: 0,
        status: 'active',
        totalCost
      };
      
      existingTasks.push(newTask);
      localStorage.setItem('userTasks', JSON.stringify(existingTasks));
      
      // Update user balance (deduct task cost)
      const currentBalance = parseFloat(localStorage.getItem('userBalance') || '5000');
      const newBalance = currentBalance - totalCost;
      localStorage.setItem('userBalance', newBalance.toString());
      
      navigate('/task-earning');
    }
  };

  const addRequirement = () => {
    const newRequirement: TaskRequirement = {
      id: Date.now(),
      description: '',
      isRequired: true
    };
    setFormData({
      ...formData,
      requirements: [...formData.requirements, newRequirement]
    });
  };

  const removeRequirement = (id: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter(req => req.id !== id)
    });
  };

  const updateRequirement = (id: number, description: string) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.map(req => 
        req.id === id ? { ...req, description } : req
      )
    });
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const getCurrentTaskTypes = () => {
    return taskTypes[formData.category as keyof typeof taskTypes] || [];
  };

  const totalCost = formData.reward * formData.maxCompletions;
  const currentBalance = parseFloat(localStorage.getItem('userBalance') || '5000');

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/task-earning" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">নতুন টাস্ক তৈরি করুন</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step <= currentStep 
                  ? 'bg-white text-bkash-500' 
                  : 'bg-white/20 text-white/60'
              }`}>
                {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 4 && <div className={`w-8 h-1 ${step < currentStep ? 'bg-white' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">মৌলিক তথ্য</h2>
              
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  টাস্কের শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="যেমন: আমার ফেসবুক পেজ ফলো করুন"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  বিস্তারিত বর্ণনা <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="কী কাজ করতে হবে তার বিস্তারিত লিখুন..."
                  rows={4}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ক্যাটেগরি <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setFormData({...formData, category: category.id, taskType: ''})}
                        className={`p-3 border rounded-xl text-left transition-colors ${
                          formData.category === category.id
                            ? 'border-bkash-500 bg-bkash-50 text-bkash-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Platform */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  প্ল্যাটফর্ম <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => setFormData({...formData, platform: platform.id})}
                        className={`p-3 border rounded-xl text-center transition-colors ${
                          formData.platform === platform.id
                            ? 'border-bkash-500 bg-bkash-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mx-auto mb-1 ${platform.color}`} />
                        <span className="text-xs font-medium">{platform.name}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.platform && <p className="text-red-500 text-sm mt-1">{errors.platform}</p>}
              </div>

              {/* Task Type */}
              {formData.category && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    কাজের ধরন <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {getCurrentTaskTypes().map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setFormData({...formData, taskType: type.id})}
                          className={`p-3 border rounded-xl text-left transition-colors ${
                            formData.taskType === type.id
                              ? 'border-bkash-500 bg-bkash-50 text-bkash-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{type.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.taskType && <p className="text-red-500 text-sm mt-1">{errors.taskType}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Task Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">টাস্কের বিবরণ</h2>
              
              {/* Target URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  টার্গেট URL/লিংক <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({...formData, targetUrl: e.target.value})}
                  placeholder="https://facebook.com/your-page"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                    errors.targetUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.targetUrl && <p className="text-red-500 text-sm mt-1">{errors.targetUrl}</p>}
              </div>

              {/* Reward */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  প্রতিটি কাজের জন্য পুরস্কার (টাকা) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.reward}
                    onChange={(e) => setFormData({...formData, reward: parseInt(e.target.value) || 0})}
                    min="10"
                    step="5"
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                      errors.reward ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.reward && <p className="text-red-500 text-sm mt-1">{errors.reward}</p>}
                <p className="text-xs text-gray-500 mt-1">ন্যূনতম ১০ টাকা</p>
              </div>

              {/* Max Completions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  সর্বোচ্চ কতজন কাজ করতে পারবে <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.maxCompletions}
                    onChange={(e) => setFormData({...formData, maxCompletions: parseInt(e.target.value) || 0})}
                    min="1"
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                      errors.maxCompletions ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.maxCompletions && <p className="text-red-500 text-sm mt-1">{errors.maxCompletions}</p>}
              </div>

              {/* Time Limit */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  সময়সীমা <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({...formData, timeLimit: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                    errors.timeLimit ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">সময়সীমা নির���বাচন করুন</option>
                  <option value="12">১২ ঘন্টা</option>
                  <option value="24">২৪ ঘন্টা</option>
                  <option value="48">৪৮ ঘন্টা</option>
                  <option value="72">৭২ ঘ���্টা</option>
                  <option value="168">১ সপ্তাহ</option>
                  <option value="336">২ সপ্তাহ</option>
                  <option value="720">১ মাস</option>
                </select>
                {errors.timeLimit && <p className="text-red-500 text-sm mt-1">{errors.timeLimit}</p>}
              </div>

              {/* Total Cost Preview */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Info className="h-5 w-5" />
                  <span className="font-medium">মোট খরচের হিসাব</span>
                </div>
                <div className="mt-2 space-y-1 text-sm text-blue-700">
                  <p>প্রতি কাজে: ৳{formData.reward}</p>
                  <p>সর্বোচ্চ কাজ: {formData.maxCompletions}টি</p>
                  <p className="font-bold text-lg">মোট খরচ: ৳{totalCost}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Requirements & Verification */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">শর্ত ও যাচাইকরণ</h2>
              
              {/* Requirements */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    কাজের শর্তাবলী <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={addRequirement}
                    className="text-bkash-500 hover:text-bkash-600 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>নতুন শর্ত</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.requirements.map((requirement) => (
                    <div key={requirement.id} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={requirement.description}
                        onChange={(e) => updateRequirement(requirement.id, e.target.value)}
                        placeholder="শর্ত লিখুন..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          onClick={() => removeRequirement(requirement.id)}
                          className="p-2 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
              </div>

              {/* Verification Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  যাচাইকরণ পদ্ধতি <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {verificationMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-3 border rounded-xl cursor-pointer transition-colors ${
                        formData.verificationMethod === method.id
                          ? 'border-bkash-500 bg-bkash-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setFormData({...formData, verificationMethod: method.id})}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.verificationMethod === method.id
                            ? 'border-bkash-500 bg-bkash-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.verificationMethod === method.id && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.verificationMethod && <p className="text-red-500 text-sm mt-1">{errors.verificationMethod}</p>}
              </div>

              {/* Budget */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  মোট বাজেট <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value) || 0})}
                    min={totalCost}
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                      errors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                <p className="text-xs text-gray-500 mt-1">ন্যূনতম ৳{totalCost} (মোট কাজ��র খরচ)</p>
              </div>

              {/* Budget Warning */}
              {formData.budget > currentBalance && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">অপর্যাপ্ত ব্যালেন্স</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    আপনার বর্তমান ব্যালেন্স ৳{currentBalance}। এই টাস্ক তৈরি করতে ৳{formData.budget} প্রয়োজন।
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">চূড়ান্ত পর্যালোচনা</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{formData.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{formData.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ক্যাটেগরি:</span>
                      <p className="text-gray-600">
                        {categories.find(c => c.id === formData.category)?.name}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">প্ল্যাটফর্ম:</span>
                      <p className="text-gray-600">
                        {platforms.find(p => p.id === formData.platform)?.name}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">পুরস্কার:</span>
                      <p className="text-bkash-500 font-bold">৳{formData.reward}</p>
                    </div>
                    <div>
                      <span className="font-medium">সর্বোচ্চ কাজ:</span>
                      <p className="text-gray-600">{formData.maxCompletions}���ি</p>
                    </div>
                    <div>
                      <span className="font-medium">সময়সীমা:</span>
                      <p className="text-gray-600">
                        {formData.timeLimit === '12' ? '১২ ঘন্টা' : 
                         formData.timeLimit === '24' ? '২৪ ঘন্টা' :
                         formData.timeLimit === '48' ? '৪৮ ঘন্টা' :
                         formData.timeLimit === '72' ? '৭২ ঘন্টা' :
                         formData.timeLimit === '168' ? '১ সপ্তাহ' :
                         formData.timeLimit === '336' ? '২ সপ্তাহ' :
                         formData.timeLimit === '720' ? '১ মাস' : formData.timeLimit + ' ঘন্টা'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">মোট খরচ:</span>
                      <p className="text-bkash-500 font-bold">৳{totalCost}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">শর্তাবলী:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {formData.requirements.map((req) => (
                      <li key={req.id}>{req.description}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">যাচাইকরণ:</h4>
                  <p className="text-sm text-gray-600">
                    {verificationMethods.find(m => m.id === formData.verificationMethod)?.name}
                  </p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 mt-4">
                <h4 className="font-medium text-green-800 mb-2">খরচের বিবরণ</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div className="flex justify-between">
                    <span>প্রতি কাজে পুরস্কার:</span>
                    <span>৳{formData.reward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>সর্বোচ্চ কাজ:</span>
                    <span>{formData.maxCompletions}টি</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-green-300 pt-1">
                    <span>মোট খরচ:</span>
                    <span>৳{totalCost}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>���র্তমান ব্যালেন্স:</span>
                    <span>৳{currentBalance}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span>অবশিষ্ট ব্যালেন্স:</span>
                    <span className={currentBalance - totalCost >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ৳{currentBalance - totalCost}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex space-x-4 mt-6">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors"
            >
              পূর্ববর্তী
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              পরবর্তী
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={currentBalance < totalCost}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                currentBalance >= totalCost
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              টাস্ক প্রকাশ করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
