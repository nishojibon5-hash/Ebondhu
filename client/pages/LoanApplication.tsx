import { useState } from "react";
import { 
  ArrowLeft, 
  CreditCard, 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";

interface LoanApplication {
  personalInfo: {
    fullName: string;
    nidNumber: string;
    phone: string;
    email: string;
    address: string;
    dateOfBirth: string;
  };
  professionalInfo: {
    occupation: string;
    monthlyIncome: string;
    workPlace: string;
    workExperience: string;
  };
  loanInfo: {
    loanAmount: string;
    loanPurpose: string;
    loanTerm: string;
    preferredEmi: string;
  };
  documents: {
    nidCopy: File | null;
    incomeCertificate: File | null;
    bankStatement: File | null;
  };
}

export default function LoanApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [application, setApplication] = useState<LoanApplication>({
    personalInfo: {
      fullName: '',
      nidNumber: '',
      phone: '',
      email: '',
      address: '',
      dateOfBirth: ''
    },
    professionalInfo: {
      occupation: '',
      monthlyIncome: '',
      workPlace: '',
      workExperience: ''
    },
    loanInfo: {
      loanAmount: '',
      loanPurpose: '',
      loanTerm: '',
      preferredEmi: ''
    },
    documents: {
      nidCopy: null,
      incomeCertificate: null,
      bankStatement: null
    }
  });

  const handleInputChange = (section: keyof LoanApplication, field: string, value: string) => {
    setApplication(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (field: keyof LoanApplication['documents'], file: File) => {
    setApplication(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const steps = [
    { number: 1, title: "ব্যক্তিগত তথ্য", icon: User },
    { number: 2, title: "পেশাগত তথ্য", icon: Briefcase },
    { number: 3, title: "ঋণের তথ্য", icon: DollarSign },
    { number: 4, title: "ডকুমেন্ট", icon: FileText }
  ];

  if (isSubmitted) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <Link to="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">ঋণের আবেদন</h1>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">আবেদন সফলভাবে জমা হয়েছে!</h2>
            <p className="text-gray-600 mb-4">
              আপনার ঋণের আবেদন পর্যালোচনার জন্য পাঠানো হয়েছে। আমরা ২৪-৪৮ ঘন্টার মধ্যে আপনার সাথে যোগাযোগ করব।
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-blue-900 font-medium">আবেদন নম্বর: <span className="font-bold">LB-2024-001234</span></p>
              <p className="text-blue-700 text-sm mt-1">এই নম্বরটি সংরক্ষণ করুন</p>
            </div>
            <Link 
              to="/"
              className="bg-bkash-500 hover:bg-bkash-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              হোমে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">ঋণের আবেদন</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-white text-bkash-500' :
                  isCompleted ? 'bg-green-500 text-white' :
                  'bg-white/20 text-white/60'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">ব্যক্তিগত তথ্য</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">পূর্ণ নাম *</label>
                <input
                  type="text"
                  value={application.personalInfo.fullName}
                  onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">জাতীয় পরিচয়পত্র নম্বর *</label>
                <input
                  type="text"
                  value={application.personalInfo.nidNumber}
                  onChange={(e) => handleInputChange('personalInfo', 'nidNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  placeholder="১০ বা ১৭ সংখ্যার NID নম্বর"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  value={application.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                <input
                  type="email"
                  value={application.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা *</label>
                <textarea
                  value={application.personalInfo.address}
                  onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  rows={3}
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">জন্ম তারিখ *</label>
                <input
                  type="date"
                  value={application.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Professional Information */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">পেশাগত তথ্য</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">পেশা *</label>
                <select
                  value={application.professionalInfo.occupation}
                  onChange={(e) => handleInputChange('professionalInfo', 'occupation', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                >
                  <option value="">পেশা নির্বাচন করুন</option>
                  <option value="government">সরকারি চাকরি</option>
                  <option value="private">বেসরকারি চাকরি</option>
                  <option value="business">ব্যবসা</option>
                  <option value="teacher">শিক্ষক</option>
                  <option value="doctor">ডাক্তার</option>
                  <option value="farmer">কৃষক</option>
                  <option value="other">অন্যান্য</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">মাসিক আয় *</label>
                <input
                  type="number"
                  value={application.professionalInfo.monthlyIncome}
                  onChange={(e) => handleInputChange('professionalInfo', 'monthlyIncome', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  placeholder="টাকার পরিমাণ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">কর্মক্ষেত্র *</label>
                <input
                  type="text"
                  value={application.professionalInfo.workPlace}
                  onChange={(e) => handleInputChange('professionalInfo', 'workPlace', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  placeholder="প্রতিষ্ঠানের নাম বা ব্যবসার ধরন"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">কাজের অভিজ্ঞতা *</label>
                <input
                  type="text"
                  value={application.professionalInfo.workExperience}
                  onChange={(e) => handleInputChange('professionalInfo', 'workExperience', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  placeholder="কত বছর অভিজ্ঞতা"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Loan Information */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">ঋণের তথ্য</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ঋণের পরিমাণ *</label>
                <input
                  type="number"
                  value={application.loanInfo.loanAmount}
                  onChange={(e) => handleInputChange('loanInfo', 'loanAmount', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  placeholder="টাকার পরিমাণ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ঋণের উদ্দেশ্য *</label>
                <select
                  value={application.loanInfo.loanPurpose}
                  onChange={(e) => handleInputChange('loanInfo', 'loanPurpose', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                >
                  <option value="">উদ্দেশ্য নির্বাচন করুন</option>
                  <option value="business">ব্যবসার জন্য</option>
                  <option value="home">বাড়ি তৈরি/সংস্কার</option>
                  <option value="education">শিক্ষার জন্য</option>
                  <option value="medical">চিকিৎসার জন্য</option>
                  <option value="agriculture">কৃষিকাজের জন্য</option>
                  <option value="personal">ব্যক্তিগত প্রয়োজন</option>
                  <option value="other">অন্যান্য</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ঋণের মেয়াদ *</label>
                <select
                  value={application.loanInfo.loanTerm}
                  onChange={(e) => handleInputChange('loanInfo', 'loanTerm', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                >
                  <option value="">মেয়াদ নির্বাচন করুন</option>
                  <option value="6">৬ মাস</option>
                  <option value="12">১ বছর</option>
                  <option value="18">১.৫ বছর</option>
                  <option value="24">২ বছর</option>
                  <option value="36">ৃ বছর</option>
                  <option value="60">৫ বছর</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">পছন্দের মাসিক কিস্তি</label>
                <input
                  type="number"
                  value={application.loanInfo.preferredEmi}
                  onChange={(e) => handleInputChange('loanInfo', 'preferredEmi', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  placeholder="আনুমানিক টাকার পরিমাণ"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Documents */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">প্রয়োজনীয় ডকুমেন্ট</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">জাতীয় পরিচয়পত্রের কপি *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-bkash-500 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">ক্লিক করে ফাইল আপলোড করুন</p>
                  <input type="file" className="hidden" accept="image/*,.pdf" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">আয়ের সনদপত্র *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-bkash-500 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">ক্লিক করে ফাইল আপলোড করুন</p>
                  <input type="file" className="hidden" accept="image/*,.pdf" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ব্যাংক স্টেটমেন্ট (ঐচ্ছিক)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-bkash-500 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">ক্লিক করে ফাইল আপলোড করুন</p>
                  <input type="file" className="hidden" accept="image/*,.pdf" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              পূর্ববর্তী
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-bkash-500 hover:bg-bkash-600 text-white px-6 py-3 rounded-xl font-medium transition-colors ml-auto"
            >
              পরবর্তী
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors ml-auto"
            >
              আবেদন জমা দিন
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
