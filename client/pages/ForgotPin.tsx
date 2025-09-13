import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Smartphone,
  RefreshCw,
} from "lucide-react";

export default function ForgotPin() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
    newPin: "",
    confirmPin: "",
  });
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError("");

    if (!formData.phone) {
      setError("মোবাইল নম্বর দিন");
      setIsLoading(false);
      return;
    }

    if (formData.phone.length !== 11) {
      setError("সঠিক মোবাইল নম্বর দিন");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setOtpSent(true);
      setCurrentStep(2);
      startCountdown();
      setSuccess("OTP পাঠানো হয়েছে আপনার মোবাইলে");
      setIsLoading(false);
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setError("");

    if (!formData.otp) {
      setError("OTP দিন");
      setIsLoading(false);
      return;
    }

    if (formData.otp.length !== 6) {
      setError("OTP ৬ সংখ্যার হতে হবে");
      setIsLoading(false);
      return;
    }

    // Simulate API call - accept 123456 as valid OTP
    setTimeout(() => {
      if (formData.otp === "123456") {
        setCurrentStep(3);
        setSuccess("OTP যাচাই সফল হয়েছে");
      } else {
        setError("ভুল OTP দিয়েছেন");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResetPin = async () => {
    setIsLoading(true);
    setError("");

    if (!formData.newPin) {
      setError("নতুন পিন দিন");
      setIsLoading(false);
      return;
    }

    if (formData.newPin.length !== 5) {
      setError("পিন ৫ সংখ্যার হতে হবে");
      setIsLoading(false);
      return;
    }

    if (formData.newPin !== formData.confirmPin) {
      setError("পিন মিলছে না");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess("পিন সফলভাবে পরিবর্তন হয়েছে!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      setIsLoading(false);
    }, 2000);
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      startCountdown();
      setSuccess("নতুন OTP পাঠানো হয়েছে");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">পিন রিসেট</h1>
          <p className="text-gray-600">আপনার পিন পুনরায় সেট করুন</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 1
                  ? "bg-bkash-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-6 ${currentStep >= 2 ? "bg-bkash-500" : "bg-gray-200"}`}
            ></div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 2
                  ? "bg-bkash-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <div
              className={`h-1 w-6 ${currentStep >= 3 ? "bg-bkash-500" : "bg-gray-200"}`}
            ></div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 3
                  ? "bg-bkash-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="space-y-4">
            {/* Step 1: Phone Number */}
            {currentStep === 1 && (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    মোবাইল নম্বর
                  </h3>
                  <p className="text-sm text-gray-600">
                    আপনার রেজিস্টার করা মোবাইল নম্বর দিন
                  </p>
                </div>

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
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent text-lg"
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-bkash-500 to-bkash-600 hover:from-bkash-600 hover:to-bkash-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5" />
                      <span>OTP পাঠান</span>
                    </>
                  )}
                </button>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    OTP যাচাইকরণ
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formData.phone} এ পাঠানো OTP দিন
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP (৬ সংখ্যা)
                  </label>
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => handleInputChange("otp", e.target.value)}
                    className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent text-lg text-center tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    onClick={handleResendOTP}
                    disabled={countdown > 0}
                    className="text-bkash-500 hover:text-bkash-600 text-sm font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>
                      {countdown > 0
                        ? `পুনরায় পাঠান (${countdown}s)`
                        : "পুনরায় OTP পাঠান"}
                    </span>
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3"></div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>OTP যাচাই করুন</span>
                    </>
                  )}
                </button>
              </>
            )}

            {/* Step 3: New PIN Setup */}
            {currentStep === 3 && (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">নতুন পিন</h3>
                  <p className="text-sm text-gray-600">
                    আপনার নতুন পিন সেট করুন
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    নতুন পিন (৫ সংখ্যা)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPin ? "text" : "password"}
                      value={formData.newPin}
                      onChange={(e) =>
                        handleInputChange("newPin", e.target.value)
                      }
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent text-lg"
                      placeholder="৫ সংখ���যার নতুন পিন"
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
                      onChange={(e) =>
                        handleInputChange("confirmPin", e.target.value)
                      }
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

                <button
                  onClick={handleResetPin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      <span>পিন ���রিবর্তন করুন</span>
                    </>
                  )}
                </button>
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

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-200">
              <Link
                to="/login"
                className="text-bkash-500 hover:text-bkash-600 font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>লগিনে ফিরে যান</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
