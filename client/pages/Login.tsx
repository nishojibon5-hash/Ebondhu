import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  Phone, 
  Lock, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Smartphone
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    pin: ''
  });
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.phone || !formData.pin) {
      setError('সব ফিল্ড পূরণ করুন');
      setIsLoading(false);
      return;
    }

    if (formData.phone.length !== 11) {
      setError('সঠিক মোবাইল নম্বর দিন');
      setIsLoading(false);
      return;
    }

    if (formData.pin.length !== 5) {
      setError('পিন ৫ সংখ্যার হতে হবে');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Check for demo user first (PIN 12345)
      if (formData.pin === '12345') {
        setSuccess('সফলভাবে লগিন হয়েছে!');

        // Store demo user data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userPhone', formData.phone);
        localStorage.setItem('userName', 'মোঃ আব্দুর রহিম');
        localStorage.setItem('userPin', '12345');

        // Initialize demo balance if not exists
        if (!localStorage.getItem('userBalance')) {
          localStorage.setItem('userBalance', '5000');
        }

        setTimeout(() => {
          navigate('/');
        }, 1000);
        setIsLoading(false);
        return;
      }

      // Check registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find((u: any) => u.phone === formData.phone && u.pin === formData.pin);

      if (user) {
        setSuccess('সফলভাবে লগিন হয়েছে!');

        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userPhone', user.phone);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userPin', user.pin);
        localStorage.setItem('userBalance', user.balance.toString());

        // Load user's referral data
        const allReferralData = JSON.parse(localStorage.getItem('referralData') || '{}');
        if (allReferralData[user.phone]) {
          localStorage.setItem('referralData', JSON.stringify(allReferralData[user.phone]));
        }

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError('ভুল ফোন নম্বর বা পিন');
      }
      setIsLoading(false);
    }, 2000);
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
          <p className="text-gray-600">আপনার অ্যাকাউন্টে লগিন করুন</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="space-y-4">
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

            {/* PIN Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                পিন নম্বর
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

            {/* Forgot PIN Link */}
            <div className="text-center">
              <Link 
                to="/forgot-pin" 
                className="text-bkash-500 hover:text-bkash-600 text-sm font-medium transition-colors"
              >
                পিন ভুলে গেছেন?
              </Link>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-bkash-500 to-bkash-600 hover:from-bkash-600 hover:to-bkash-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>লগিন করুন</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                নতুন ব্যবহারকারী?{' '}
                <Link 
                  to="/register" 
                  className="text-bkash-500 hover:text-bkash-600 font-medium transition-colors"
                >
                  রেজিস্ট্রেশন করুন
                </Link>
              </p>
            </div>

            {/* Demo Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
              <p className="text-blue-800 text-xs text-center">
                <strong>ডেমো:</strong> যেকোনো ফোন নম্বর ও পিন <strong>12345</strong> দিয়ে লগিন করুন
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
