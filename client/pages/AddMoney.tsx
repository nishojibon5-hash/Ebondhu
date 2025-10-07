import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Smartphone,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  QrCode,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface PaymentMethod {
  id: string;
  name: string;
  type: "mfs" | "bank" | "card";
  logo: string;
  color: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
  feeType: "fixed" | "percentage";
}

export default function AddMoney() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [txnId, setTxnId] = useState("");
  const BKASH_RECEIVER = "01650074073";

  const paymentMethods: PaymentMethod[] = [
    {
      id: "bkash",
      name: "বিকাশ",
      type: "mfs",
      logo: "💳",
      color: "bg-pink-500",
      description: "বিকাশ থেকে সরাসরি টাকা যোগ করুন",
      minAmount: 10,
      maxAmount: 25000,
      fee: 18.5,
      feeType: "fixed",
    },
    {
      id: "nagad",
      name: "নগদ",
      type: "mfs",
      logo: "📱",
      color: "bg-orange-500",
      description: "নগদ থেকে স���াসরি টাকা যোগ করুন",
      minAmount: 10,
      maxAmount: 20000,
      fee: 15,
      feeType: "fixed",
    },
    {
      id: "rocket",
      name: "রকেট",
      type: "mfs",
      logo: "🚀",
      color: "bg-purple-500",
      description: "রকেট থেকে সরাসরি টাকা যোগ করুন",
      minAmount: 10,
      maxAmount: 15000,
      fee: 12,
      feeType: "fixed",
    },
    {
      id: "dbbl",
      name: "ডাচ-বাংলা ব্যাংক",
      type: "bank",
      logo: "🏦",
      color: "bg-green-600",
      description: "ডেবিট/ক্রেডিট কার্ড দিয়ে টাকা যোগ করুন",
      minAmount: 100,
      maxAmount: 50000,
      fee: 1.85,
      feeType: "percentage",
    },
    {
      id: "city_bank",
      name: "সিটি ব্যাংক",
      type: "bank",
      logo: "🏪",
      color: "bg-blue-600",
      description: "সিটি ব্যাংক কার্ড দিয়ে টাকা যোগ করুন",
      minAmount: 100,
      maxAmount: 50000,
      fee: 2,
      feeType: "percentage",
    },
    {
      id: "brac_bank",
      name: "ব্র্যাক ব্যাংক",
      type: "bank",
      logo: "🏛️",
      color: "bg-teal-600",
      description: "ব্র্যাক ব্যাংক কার্ড দিয়ে টাকা যোগ করুন",
      minAmount: 100,
      maxAmount: 50000,
      fee: 1.75,
      feeType: "percentage",
    },
  ];

  const currentBalance = parseFloat(localStorage.getItem("userBalance") || "0");

  const calculateFee = (method: PaymentMethod, amount: number): number => {
    if (method.feeType === "fixed") {
      return method.fee;
    } else {
      return (amount * method.fee) / 100;
    }
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedMethod) newErrors.method = "পেমেন্ট পদ���ধতি নির্বাচন করুন";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    const addAmount = parseFloat(amount);

    if (!amount || addAmount <= 0) newErrors.amount = "সঠিক পরিমাণ লিখুন";
    else if (selectedMethod && addAmount < selectedMethod.minAmount) {
      newErrors.amount = `ন্যূনতম ৳${selectedMethod.minAmount} যোগ করতে পারবেন`;
    } else if (selectedMethod && addAmount > selectedMethod.maxAmount) {
      newErrors.amount = `সর্বোচ্চ ৳${selectedMethod.maxAmount} যোগ করতে পারবেন`;
    }

    if (
      selectedMethod?.type === "mfs" &&
      (!accountNumber || accountNumber.length !== 11)
    ) {
      newErrors.accountNumber = "১১ সংখ্যার মোবাইল নম্বর লিখুন";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!pin || pin.length !== 5) newErrors.pin = "৫ সংখ্যার পিন লিখুন";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAddMoney = () => {
    if (validateStep3()) {
      setIsProcessing(true);

      setTimeout(() => {
        // Verify PIN
        if (pin === localStorage.getItem("userPin")) {
          const addAmount = parseFloat(amount);
          const fee = selectedMethod
            ? calculateFee(selectedMethod, addAmount)
            : 0;

          // For demo purposes, simulate successful payment
          // In real implementation, redirect to payment gateway
          if (selectedMethod?.type === "mfs") {
            // Generate payment URL for mobile financial services
            const demoUrl = `https://payment.${selectedMethod.id}.com/pay?amount=${addAmount}&fee=${fee}&ref=${Date.now()}`;
            setPaymentUrl(demoUrl);
            setCurrentStep(4); // Payment step
          } else {
            // For banks, direct success simulation
            simulateSuccessfulPayment(addAmount);
          }
        } else {
          setErrors({ pin: "ভুল পিন দিয��েছেন" });
        }
        setIsProcessing(false);
      }, 2000);
    }
  };

  const simulateSuccessfulPayment = (addAmount: number) => {
    // Update balance
    const newBalance = currentBalance + addAmount;
    localStorage.setItem("userBalance", newBalance.toString());

    // Persist to registered users store
    const userPhone = localStorage.getItem("userPhone");
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const idx = users.findIndex((u: any) => u.phone === userPhone);
    if (idx !== -1) {
      users[idx].balance = newBalance;
      localStorage.setItem("registeredUsers", JSON.stringify(users));
    }

    // Save transaction
    const transaction = {
      id: Date.now(),
      type: "add_money",
      amount: addAmount,
      method: selectedMethod?.name,
      accountNumber,
      fee: selectedMethod ? calculateFee(selectedMethod, addAmount) : 0,
      date: new Date().toISOString(),
      status: "completed",
    };

    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]",
    );
    transactions.unshift(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    setCurrentStep(5); // Success step
  };

  const submitManualRequest = () => {
    const addAmount = parseFloat(amount);
    const newErrors: { [key: string]: string } = {};
    if (!selectedMethod) newErrors.method = "পেমেন্ট পদ্ধতি নির্বাচন করুন";
    if (!amount || addAmount <= 0) newErrors.amount = "সঠিক পরিমাণ লিখুন";
    if (!txnId || txnId.trim().length < 6)
      newErrors.txnId = "সঠিক ট্রানজেকশন আইডি লিখুন";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const userPhone = localStorage.getItem("userPhone") || "unknown";
    const req = {
      id: Date.now(),
      userPhone,
      amount: addAmount,
      method: selectedMethod?.id || "bkash",
      targetNumber: BKASH_RECEIVER,
      txnId: txnId.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const key = "manualTopupRequests";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.unshift(req);
    localStorage.setItem(key, JSON.stringify(list));
    setCurrentStep(6);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("কপি করা হয়েছে!");
  };

  if (currentStep === 6) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
          <h1 className="text-xl font-bold">রিকুয়েস্ট পাঠানো হয়েছে</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              এডমিনের অনুমোদনের অপেক্ষায়
            </h2>
            <p className="text-gray-600 mb-6">
              ট্রানজেকশন আইডি যাচাই করে এডমিন ব্যালেন্সে টাকা যোগ করবেন
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                হোমে ফিরুন
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedMethod(null);
                  setAmount("");
                  setAccountNumber("");
                  setPin("");
                  setPaymentUrl("");
                  setErrors({});
                  setManualMode(false);
                  setTxnId("");
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                আরো টাকা যোগ করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
          <h1 className="text-xl font-bold">টাকা যোগ সফল</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              টাকা সফলভাবে যোগ হয়েছে!
            </h2>
            <p className="text-gray-600 mb-6">
              আপনার ওয়ালেটে টাকা যোগ সম্পন্ন হয়েছে
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">পদ্ধতি</span>
                  <span className="font-medium">{selectedMethod?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">পরিমাণ</span>
                  <span className="font-medium">৳{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ফি</span>
                  <span className="font-medium">
                    ৳
                    {selectedMethod
                      ? calculateFee(
                          selectedMethod,
                          parseFloat(amount),
                        ).toFixed(2)
                      : "0"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-medium">নতুন ব্যালেন্স</span>
                  <span className="font-bold text-green-600">
                    ৳{(currentBalance + parseFloat(amount)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                হোমে ফিরুন
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedMethod(null);
                  setAmount("");
                  setAccountNumber("");
                  setPin("");
                  setPaymentUrl("");
                  setErrors({});
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                আরো টাকা যোগ করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 4 && paymentUrl) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
          <h1 className="text-xl font-bold">পেমেন্ট সম্পন্ন করুন</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 ${selectedMethod?.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl`}
              >
                {selectedMethod?.logo}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {selectedMethod?.name} পেমেন্ট
              </h2>
              <p className="text-gray-600">
                ���িচের QR কোড স্ক্যান করুন অথবা লিংকে যান
              </p>
            </div>

            {/* QR Code (Demo) */}
            <div className="bg-gray-100 w-48 h-48 rounded-xl flex items-center justify-center mx-auto mb-6">
              <QrCode className="h-32 w-32 text-gray-400" />
            </div>

            {/* Payment Details */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>পরিমাণ:</span>
                  <span className="font-medium">৳{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>ফি:</span>
                  <span className="font-medium">
                    ৳
                    {selectedMethod
                      ? calculateFee(
                          selectedMethod,
                          parseFloat(amount),
                        ).toFixed(2)
                      : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>মার্চেন্ট:</span>
                  <span className="font-medium">amarcash ওয়ালেট</span>
                </div>
              </div>
            </div>

            {/* Payment URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                পেমেন্ট লিংক
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={paymentUrl}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(paymentUrl)}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="h-5 w-5" />
                <span>{selectedMethod?.name} অ্যাপে যান</span>
              </a>

              <button
                onClick={() => simulateSuccessfulPayment(parseFloat(amount))}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                পেমেন্ট সম্পন্ন হয়েছে
              </button>

              <button
                onClick={() => setCurrentStep(1)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                বাতিল করুন
              </button>
            </div>
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
          <Link
            to="/"
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">টাকা যোগ করুন</h1>
            <p className="text-sm text-white/80">
              ব্যালেন্স: ৳{currentBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step <= currentStep
                    ? "bg-white text-bkash-500"
                    : "bg-white/20 text-white/60"
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div
                  className={`w-8 h-1 ${step < currentStep ? "bg-white" : "bg-white/20"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Step 1: Select Payment Method */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                পেমেন্ট পদ্ধতি নির্বাচন করুন
              </h2>

              {/* Mobile Financial Services */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>মোবাইল ব্যাংকিং</span>
                </h3>
                <div className="space-y-3">
                  {paymentMethods
                    .filter((m) => m.type === "mfs")
                    .map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method)}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                          selectedMethod?.id === method.id
                            ? "border-bkash-500 bg-bkash-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center text-white text-xl`}
                          >
                            {method.logo}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">
                              {method.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {method.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              ফি: ৳{method.fee} • সীমা: ��{method.minAmount} - ৳
                              {method.maxAmount.toLocaleString()}
                            </p>
                          </div>
                          {selectedMethod?.id === method.id && (
                            <CheckCircle className="h-6 w-6 text-bkash-500" />
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Banks */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>ব্যাংক কার্ড</span>
                </h3>
                <div className="space-y-3">
                  {paymentMethods
                    .filter((m) => m.type === "bank")
                    .map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method)}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                          selectedMethod?.id === method.id
                            ? "border-bkash-500 bg-bkash-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center text-white text-xl`}
                          >
                            {method.logo}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">
                              {method.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {method.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              ফি: {method.fee}% • সীমা: ৳{method.minAmount} - ৳
                              {method.maxAmount.toLocaleString()}
                            </p>
                          </div>
                          {selectedMethod?.id === method.id && (
                            <CheckCircle className="h-6 w-6 text-bkash-500" />
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Enter Amount and Details */}
        {currentStep === 2 && selectedMethod && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                পরিমাণ ও বিবরণ
              </h2>

              {/* Selected Method Info */}
              <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 ${selectedMethod.color} rounded-full flex items-center justify-center text-white text-sm`}
                  >
                    {selectedMethod.logo}
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedMethod.name}
                    </p>
                    <p className="text-sm text-blue-700">
                      {selectedMethod.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  পরিমাণ (টাকা)
                </label>
                <div className="relative">
                  <DollarSign className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="পরিমাণ লিখুন"
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                      errors.amount ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  সীমা: ৳{selectedMethod.minAmount} - ৳
                  {selectedMethod.maxAmount.toLocaleString()}
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[100, 500, 1000, 2000].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="p-2 text-sm border border-gray-300 rounded-lg hover:border-bkash-500 hover:bg-bkash-50 transition-colors"
                  >
                    ৳{quickAmount}
                  </button>
                ))}
              </div>

              {/* Account Number for MFS */}
              {selectedMethod.type === "mfs" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedMethod.name} নম্বর
                  </label>
                  <input
                    type="tel"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    maxLength={11}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                      errors.accountNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>
              )}

              {/* Fee Calculation */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>যোগ করার পরিমাণ:</span>
                      <span>৳{amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>সেবা চার্জ:</span>
                      <span>
                        ৳
                        {calculateFee(
                          selectedMethod,
                          parseFloat(amount),
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-yellow-300 pt-2">
                      <span>মোট পেমেন্ট:</span>
                      <span>
                        ৳
                        {(
                          parseFloat(amount) +
                          calculateFee(selectedMethod, parseFloat(amount))
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 mt-4">
                <button
                  onClick={() => {
                    setManualMode(false);
                    if (validateStep2()) setCurrentStep(3);
                  }}
                  className="w-full bg-bkash-600 hover:bg-bkash-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  নেক্সট (লাইভ পেমেন্ট)
                </button>
                <button
                  onClick={() => {
                    const addAmount = parseFloat(amount);
                    const err: { [key: string]: string } = {};
                    if (!selectedMethod) err.method = "পেমেন্ট পদ্ধতি নির্বাচন করুন";
                    if (!amount || isNaN(addAmount) || addAmount <= 0)
                      err.amount = "সঠিক পরিমাণ লিখুন";
                    setErrors(err);
                    if (Object.keys(err).length === 0) {
                      setManualMode(true);
                      setCurrentStep(3);
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  সেন্ড মানি করে ট্রানজেকশন আইডি সাবমিট
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Enter PIN or Manual Submit */}
        {currentStep === 3 &&
          (manualMode ? (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  সেন্ড মানি করে ট্রানজেকশন আইডি দিন
                </h2>

                <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
                  <p className="text-blue-900 font-medium">
                    নিচের বিকাশ নম্বরে সেন্ড মানি করুন
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold text-blue-900">
                      {BKASH_RECEIVER}
                    </span>
                    <button
                      onClick={() => copyToClipboard(BKASH_RECEIVER)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1"
                    >
                      <Copy className="h-4 w-4" /> কপি
                    </button>
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    পরিমাণ: ৳{amount} • রেফারেন্স: আপনার মোবাইল নম্বর (
                    {localStorage.getItem("userPhone") || ""})
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ট্রানজেকশন আইডি
                  </label>
                  <input
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="bKash Transaction ID"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${errors.txnId ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.txnId && (
                    <p className="text-red-500 text-sm mt-1">{errors.txnId}</p>
                  )}
                </div>

                <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200 mb-2 text-sm text-yellow-900">
                  ভুল/ভুয়া ট্রানজেকশন আইডি দিলে অ্যাকাউন্টে সতর্কতা পাঠানো হবে।
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mb-2">{errors.amount}</p>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={submitManualRequest}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    রিকুয়েস্ট সাবমিট করুন
                  </button>
                  <button
                    onClick={() => {
                      setManualMode(false);
                    }}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                  >
                    লাইভ পেমেন্টে যান
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  পিন দিয়ে নিশ্চিত করুন
                </h2>

                {/* Transaction Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>পদ্ধতি:</span>
                      <span className="font-medium">
                        {selectedMethod?.name}
                      </span>
                    </div>
                    {selectedMethod?.type === "mfs" && (
                      <div className="flex justify-between">
                        <span>নম্বর:</span>
                        <span className="font-medium">{accountNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>পরিমাণ:</span>
                      <span className="font-medium">৳{amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ফি:</span>
                      <span className="font-medium">
                        ৳
                        {selectedMethod
                          ? calculateFee(
                              selectedMethod,
                              parseFloat(amount),
                            ).toFixed(2)
                          : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                      <span>মোট পেমেন্ট:</span>
                      <span className="text-bkash-500">
                        ৳
                        {selectedMethod
                          ? (
                              parseFloat(amount) +
                              calculateFee(selectedMethod, parseFloat(amount))
                            ).toFixed(2)
                          : amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PIN Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পিন লিখুন
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? "text" : "password"}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="৫ সংখ্যার পিন"
                      maxLength={5}
                      className={`w-full pr-10 pl-3 py-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                        errors.pin ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPin ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.pin && (
                    <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
                  )}
                </div>

                {/* Warning */}
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      নিশ্চিত করার পর আপনাকে {selectedMethod?.name} পেমেন্ট পেজে
                      নিয়ে যাওয়া হবে।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* Navigation Buttons */}
        {(!manualMode || currentStep !== 3) && (
          <div className="flex space-x-4 mt-6">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                পূর্ববর্তী
              </button>
            )}

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                পরবর্তী
              </button>
            ) : (
              <button
                onClick={handleAddMoney}
                disabled={isProcessing}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  isProcessing
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isProcessing ? "প্রক্রিয��াধীন..." : "পেমেন্ট শুরু করুন"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
