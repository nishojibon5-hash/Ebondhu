import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Smartphone,
  ArrowLeft,
  Gift
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pin: '',
    confirmPin: '',
    referralCode: ''
  });
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referralBonus, setReferralBonus] = useState(0);

  useEffect(() => {
    // Check for referral code in URL
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
      setReferralBonus(15); // ১৫ টাকা bonus for referral
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user types
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('নাম লিখুন');
      return false;
    }
    if (!formData.phone) {
      setError('মোবাইল নম্বর দিন');
      return false;
    }
    if (formData.phone.length !== 11) {
      setError('সঠিক মোবাইল নম্বর দিন (১১ সংখ্যা)');
      return false;
    }

    // Check if phone number already exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (existingUsers.some((user: any) => user.phone === formData.phone)) {
      setError('এই নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে');
      return false;
    }
    if (!formData.phone.startsWith('01')) {
      setError('মোবাইল নম্বর ০১ দি��়ে শুরু হতে হবে');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.pin) {
      setError('পিন নম্বর দিন');
      return false;
    }
    if (formData.pin.length !== 5) {
      setError('পিন ৫ সংখ্যার হতে হবে');
      return false;
    }
    if (!formData.confirmPin) {
      setError('পি��� নিশ্চিত করুন');
      return false;
    }
    if (formData.pin !== formData.confirmPin) {
      setError('পিন মিলছে না');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateStep2()) {
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Create new user object
      const newUser = {
        name: formData.name,
        phone: formData.phone,
        pin: formData.pin,
        joinDate: new Date().toISOString(),
        referredBy: formData.referralCode || null,
        balance: referralBonus // Start with referral bonus if any
      };

      // Add to registered users
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // Process referral if exists
      if (formData.referralCode) {
        processReferralReward(formData.referralCode, newUser);
      }

      // Store user data for future login (but don't auto-login)
      localStorage.setItem('registeredPhone', formData.phone);
      localStorage.setItem('registeredName', formData.name);
      localStorage.setItem('registeredPin', formData.pin);

      const successMessage = referralBonus > 0
        ? `রেজিস্ট্রেশন সফল! ৳${referralBonus} বোনাস পেয়েছেন। এখন লগিন করুন।`
        : 'রেজিস্ট্রেশন সফল হয়েছে! এখন লগিন করুন।';

      setSuccess(successMessage);

      setTimeout(() => {
        navigate('/login');
      }, 3000);
      setIsLoading(false);
    }, 2000);
  };

  const processReferralReward = (referralCode: string, newUser: any) => {
    // Find the referrer by code
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const referrer = allUsers.find((user: any) => `LB${user.phone.slice(-6)}` === referralCode);

    if (referrer) {
      // Update referrer's referral data
      const referralData = JSON.parse(localStorage.getItem('referralData') || '{}');

      if (!referralData[referrer.phone]) {
        referralData[referrer.phone] = {
          referralCode: `LB${referrer.phone.slice(-6)}`,
          totalReferrals: 0,
          totalEarnings: 0,
          referredUsers: []
        };
      }

      // Add new referral
      referralData[referrer.phone].totalReferrals += 1;
      referralData[referrer.phone].totalEarnings += 15;
      referralData[referrer.phone].referredUsers.push({
        id: Date.now(),
        name: newUser.name,
        phone: newUser.phone,
        joinDate: new Date().toLocaleDateString('bn-BD'),
        status: 'completed',
        reward: 15
      });

      localStorage.setItem('referralData', JSON.stringify(referralData));

      // Add ৳15 to referrer's balance if they're currently logged in
      if (localStorage.getItem('userPhone') === referrer.phone) {
        const currentBalance = parseFloat(localStorage.getItem('userBalance') || '0');
        const newBalance = currentBalance + 15;
        localStorage.setItem('userBalance', newBalance.toString());
        // Persist to registered users store
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const idx = users.findIndex((u: any) => u.phone === referrer.phone);
        if (idx !== -1) {
          users[idx].balance = (users[idx].balance || 0) + 15;
          localStorage.setItem('registeredUsers', JSON.stringify(users));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bkash-50 to-bkash-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-bkash-500 to-bkash-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">লোন বন্ধু</h1>
          <p className="text-gray-600">নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= 1 ? 'bg-bkash-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`h-1 w-8 ${currentStep >= 2 ? 'bg-bkash-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= 2 ? 'bg-bkash-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="space-y-4">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">ব্যক্তিগত তথ্য</h3>
                  <p className="text-sm text-gray-600">আপনার নাম ও ফোন নম্বর দিন</p>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পূর্ণ নাম
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent text-lg"
                      placeholder="আপনার পূর্ণ নাম"
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    মোবাইল নম্বর
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent text-lg"
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                    />
                  </div>
                </div>

                {/* Referral Code Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    রেফার কোড (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Gift className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.referralCode}
                      onChange={(e) => handleInputChange('referralCode', e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent text-lg"
                      placeholder="যেমন: LB123456"
                      maxLength={8}
                    />
                  </div>
                  {formData.referralCode && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">
                        🎉 রেফার কোড প্রয়োগ করা হয়েছে! আপনি ১৫ টাকা বোনাস পাবেন।
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 2: PIN Setup */}
            {currentStep === 2 && (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">পিন সেটআপ</h3>
                  <p className="text-sm text-gray-600">আপনার অ্যাকাউন্টের জন্য একটি পিন তৈরি করুন</p>
                </div>

                {/* PIN Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পিন নম্বর (৫ সংখ্যা)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPin ? "text" : "password"}
                      value={formData.pin}
                      onChange={(e) => handleInputChange('pin', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent text-lg"
                      placeholder="৫ সংখ্যার পিন"
                      maxLength={5}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPin ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm PIN Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পিন নিশ্চিত করুন
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPin ? "text" : "password"}
                      value={formData.confirmPin}
                      onChange={(e) => handleInputChange('confirmPin', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent text-lg"
                      placeholder="পিন আবার লিখুন"
                      maxLength={5}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPin ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* PIN Guidelines */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-blue-800 text-xs">
                    <strong>পিন নির্দেশিকা:</strong><br/>
                    ��� ৫ সংখ্যার পিন ব্যবহার করুন<br/>
                    • সহজ পিন (১২৩৪৫) এ��়িয়ে চলুন<br/>
                    • পিনটি গোপন রাখুন
                  </p>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3">
              {currentStep === 2 && (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>পূর্ববর্তী</span>
                </button>
              )}
              
              {currentStep === 1 ? (
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-bkash-500 to-bkash-600 hover:from-bkash-600 hover:to-bkash-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>পরবর্তী</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>রেজিস্ট্রেশন সম্পন্ন</span>
                      <CheckCircle className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <Link 
                  to="/login" 
                  className="text-bkash-500 hover:text-bkash-600 font-medium transition-colors"
                >
                  লগিন করুন
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
