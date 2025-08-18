import { useState } from "react";
import { 
  ArrowLeft,
  Phone,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Operator {
  id: string;
  name: string;
  logo: string;
  color: string;
  prefix: string[];
  popularAmounts: number[];
}

interface RechargeOffer {
  amount: number;
  validity: string;
  data?: string;
  minutes?: string;
  sms?: string;
  isPopular?: boolean;
}

export default function MobileRecharge() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<RechargeOffer | null>(null);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const operators: Operator[] = [
    {
      id: 'grameenphone',
      name: 'গ্রামীণফোন',
      logo: '📱',
      color: 'bg-green-500',
      prefix: ['017', '013'],
      popularAmounts: [19, 39, 79, 119, 199]
    },
    {
      id: 'banglalink',
      name: 'বাংলালিংক',
      logo: '📞',
      color: 'bg-orange-500',
      prefix: ['019', '014'],
      popularAmounts: [20, 40, 80, 120, 200]
    },
    {
      id: 'robi',
      name: 'রবি',
      logo: '📲',
      color: 'bg-red-500',
      prefix: ['018'],
      popularAmounts: [19, 44, 89, 129, 199]
    },
    {
      id: 'airtel',
      name: 'এয়ারটেল',
      logo: '📱',
      color: 'bg-red-600',
      prefix: ['016'],
      popularAmounts: [20, 45, 85, 125, 195]
    },
    {
      id: 'teletalk',
      name: 'টেলিটক',
      logo: '☎️',
      color: 'bg-blue-500',
      prefix: ['015'],
      popularAmounts: [20, 40, 75, 115, 180]
    }
  ];

  const getOperatorOffers = (operatorId: string): RechargeOffer[] => {
    const offerSets: {[key: string]: RechargeOffer[]} = {
      grameenphone: [
        { amount: 19, validity: '৩ দিন', data: '১ জিবি', minutes: '৫০ মিনিট', isPopular: true },
        { amount: 39, validity: '৭ দিন', data: '২ জিবি', minutes: '১২০ মিনিট' },
        { amount: 79, validity: '১৫ দিন', data: '৪ জিবি', minutes: '২৫০ মিনিট', isPopular: true },
        { amount: 119, validity: '৩০ দিন', data: '৬ জিবি', minutes: '৪০০ মিনিট' },
        { amount: 199, validity: '৩০ দিন', data: '১২ জিবি', minutes: '৬০০ মিনিট' }
      ],
      banglalink: [
        { amount: 20, validity: '৩ দিন', data: '১ জিবি', minutes: '৪০ মিনিট', isPopular: true },
        { amount: 40, validity: '৭ দিন', data: '১.৫ জিবি', minutes: '১০০ মিনিট' },
        { amount: 80, validity: '১৫ দিন', data: '৩ জিবি', minutes: '২০০ মিনিট', isPopular: true },
        { amount: 120, validity: '৩০ দিন', data: '৫ জিবি', minutes: '৩৫০ মিনিট' },
        { amount: 200, validity: '৩০ দিন', data: '১০ জিবি', minutes: '৫৫০ মিনিট' }
      ],
      robi: [
        { amount: 19, validity: '৩ দিন', data: '১ জিবি', minutes: '৪৫ মিনিট', isPopular: true },
        { amount: 44, validity: '৭ দিন', data: '২ জিবি', minutes: '১১০ মিনিট' },
        { amount: 89, validity: '১৫ দিন', data: '৪ জিবি', minutes: '২২০ মিনিট', isPopular: true },
        { amount: 129, validity: '৩০ দিন', data: '৬ জিবি', minutes: '৩৮০ মিনিট' },
        { amount: 199, validity: '৩০ দিন', data: '১১ জিবি', minutes: '৫৮০ মিনিট' }
      ],
      airtel: [
        { amount: 20, validity: '৩ দিন', data: '১ জিবি', minutes: '৪২ মিনিট', isPopular: true },
        { amount: 45, validity: '৭ দিন', data: '২ জিবি', minutes: '১০৫ মিনিট' },
        { amount: 85, validity: '১৫ দিন', data: '৩.৫ জিবি', minutes: '২১০ মিনিট', isPopular: true },
        { amount: 125, validity: '৩০ দিন', data: '৫.৫ জিবি', minutes: '৩৬০ মিনিট' },
        { amount: 195, validity: '৩০ দিন', data: '১০.৫ জিবি', minutes: '৫৬০ মিনিট' }
      ],
      teletalk: [
        { amount: 20, validity: '৩ দিন', data: '১ জিবি', minutes: '৪০ মিনিট', isPopular: true },
        { amount: 40, validity: '৭ দিন', data: '১.৮ জিবি', minutes: '৯৫ মিনিট' },
        { amount: 75, validity: '১৫ দিন', data: '৩.২ জিবি', minutes: '১৯০ মিনিট', isPopular: true },
        { amount: 115, validity: '৩০ দিন', data: '৫.২ জিবি', minutes: '৩৪০ মিনিট' },
        { amount: 180, validity: '৩০ দিন', data: '৯.৫ জিবি', minutes: '৫২০ মিনিট' }
      ]
    };
    return offerSets[operatorId] || [];
  };

  const currentBalance = parseFloat(localStorage.getItem('userBalance') || '5000');

  const detectOperator = (phone: string): Operator | null => {
    if (phone.length >= 3) {
      const prefix = phone.substring(0, 3);
      return operators.find(op => op.prefix.includes(prefix)) || null;
    }
    return null;
  };

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!phoneNumber || phoneNumber.length !== 11) {
      newErrors.phoneNumber = '১১ সংখ্যার মোবাইল নম্বর লিখুন';
    } else if (!phoneNumber.startsWith('01')) {
      newErrors.phoneNumber = 'সঠিক মোবাইল নম্বর লিখুন';
    } else if (!selectedOperator) {
      newErrors.phoneNumber = 'এই নম্বরের অপারেটর সমর্থিত নয়';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};
    const rechargeAmount = parseFloat(amount);
    
    if (!amount || rechargeAmount <= 0) newErrors.amount = 'রিচার্জের পরিমাণ নির্বাচন করুন';
    else if (rechargeAmount < 10) newErrors.amount = 'ন্যূনতম ১০ টাকা রিচার্জ করতে পারবেন';
    else if (rechargeAmount > 5000) newErrors.amount = 'সর্বোচ্চ ৫,০০০ টাকা রিচার্জ করতে পারবেন';
    else if (rechargeAmount > currentBalance) newErrors.amount = 'অপর্যাপ্ত ব্যালেন্স';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!pin || pin.length !== 5) newErrors.pin = '৫ সংখ্যার পিন লিখুন';
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

  const handleRecharge = () => {
    if (validateStep3()) {
      setIsProcessing(true);
      
      setTimeout(() => {
        // Verify PIN
        if (pin === '12345' || pin === localStorage.getItem('userPin')) {
          const rechargeAmount = parseFloat(amount);
          
          // Update balance
          const newBalance = currentBalance - rechargeAmount;
          localStorage.setItem('userBalance', newBalance.toString());
          
          // Save transaction
          const transaction = {
            id: Date.now(),
            type: 'mobile_recharge',
            amount: rechargeAmount,
            operator: selectedOperator?.name,
            phoneNumber,
            offer: selectedOffer,
            date: new Date().toISOString(),
            status: 'completed'
          };
          
          const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
          transactions.unshift(transaction);
          localStorage.setItem('transactions', JSON.stringify(transactions));
          
          setCurrentStep(4); // Success step
        } else {
          setErrors({ pin: 'ভুল পিন দিয়েছেন' });
        }
        setIsProcessing(false);
      }, 2000);
    }
  };

  const selectOperator = (operator: Operator) => {
    setSelectedOperator(operator);
    // Auto-detect based on current phone number
    if (phoneNumber) {
      const detected = detectOperator(phoneNumber);
      if (detected?.id !== operator.id) {
        setPhoneNumber('');
      }
    }
  };

  const handlePhoneChange = (phone: string) => {
    setPhoneNumber(phone);
    const detected = detectOperator(phone);
    if (detected) {
      setSelectedOperator(detected);
    }
  };

  const selectOffer = (offer: RechargeOffer) => {
    setSelectedOffer(offer);
    setAmount(offer.amount.toString());
  };

  if (currentStep === 4) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
          <h1 className="text-xl font-bold">রিচার্জ সফল</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">রিচার্জ সফল!</h2>
            <p className="text-gray-600 mb-6">আপনার মোবাইল রিচার্জ সম্পন্ন হয়েছে</p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">অপারেটর</span>
                  <span className="font-medium">{selectedOperator?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">নম্বর</span>
                  <span className="font-medium">{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">পরিমাণ</span>
                  <span className="font-medium">৳{amount}</span>
                </div>
                {selectedOffer && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">মেয়াদ</span>
                      <span className="font-medium">{selectedOffer.validity}</span>
                    </div>
                    {selectedOffer.data && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ডেটা</span>
                        <span className="font-medium">{selectedOffer.data}</span>
                      </div>
                    )}
                    {selectedOffer.minutes && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">মিনিট</span>
                        <span className="font-medium">{selectedOffer.minutes}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                হোম��� ফিরুন
              </button>
              <button 
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedOperator(null);
                  setPhoneNumber('');
                  setAmount('');
                  setSelectedOffer(null);
                  setPin('');
                  setErrors({});
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                আরো রিচার্জ করুন
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
          <Link to="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">মোবাইল রিচার্জ</h1>
            <p className="text-sm text-white/80">ব্যালেন্স: ৳{currentBalance.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step <= currentStep 
                  ? 'bg-white text-bkash-500' 
                  : 'bg-white/20 text-white/60'
              }`}>
                {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 3 && <div className={`w-8 h-1 ${step < currentStep ? 'bg-white' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Step 1: Select Operator & Phone */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Phone Number Input */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">মোবাইল নম্বর</h2>
              
              <div className="mb-4">
                <div className="relative">
                  <Phone className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    maxLength={11}
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                {selectedOperator && (
                  <p className="text-green-600 text-sm mt-1 flex items-center space-x-1">
                    <span>{selectedOperator.logo}</span>
                    <span>{selectedOperator.name} সনাক্ত করা হয়েছে</span>
                  </p>
                )}
              </div>
            </div>

            {/* Operator Selection */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">অপারেটর নির্বাচন করুন</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {operators.map((operator) => (
                  <button
                    key={operator.id}
                    onClick={() => selectOperator(operator)}
                    className={`p-4 border-2 rounded-xl transition-colors ${
                      selectedOperator?.id === operator.id
                        ? 'border-bkash-500 bg-bkash-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 ${operator.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xl`}>
                        {operator.logo}
                      </div>
                      <p className="font-medium text-gray-900">{operator.name}</p>
                      <p className="text-xs text-gray-500">
                        {operator.prefix.map(p => `${p}x`).join(', ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Amount/Package */}
        {currentStep === 2 && selectedOperator && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">রিচার্জ প্যাকেজ</h2>
              
              {/* Selected Number Info */}
              <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${selectedOperator.color} rounded-full flex items-center justify-center text-white text-sm`}>
                    {selectedOperator.logo}
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">{selectedOperator.name}</p>
                    <p className="text-sm text-blue-700">{phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Packages */}
              <div className="space-y-3 mb-6">
                {getOperatorOffers(selectedOperator.id).map((offer, index) => (
                  <button
                    key={index}
                    onClick={() => selectOffer(offer)}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-colors relative ${
                      selectedOffer?.amount === offer.amount
                        ? 'border-bkash-500 bg-bkash-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {offer.isPopular && (
                      <div className="absolute -top-2 left-4">
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>জনপ্রিয়</span>
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-bkash-500 text-lg">৳{offer.amount}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center space-x-1">
                            <Zap className="h-3 w-3" />
                            <span>মেয়াদ: {offer.validity}</span>
                          </p>
                          {offer.data && (
                            <p className="flex items-center space-x-1">
                              <span>📶</span>
                              <span>ডেটা: {offer.data}</span>
                            </p>
                          )}
                          {offer.minutes && (
                            <p className="flex items-center space-x-1">
                              <span>📞</span>
                              <span>মিনিট: {offer.minutes}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {selectedOffer?.amount === offer.amount && (
                          <CheckCircle className="h-6 w-6 text-bkash-500" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-3">কাস্টম পরিমাণ</h3>
                <div className="relative">
                  <DollarSign className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={!selectedOffer ? amount : ''}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSelectedOffer(null);
                    }}
                    placeholder="কাস্টম পরিমাণ লিখুন"
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm with PIN */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">পিন দিয়ে নিশ্চিত করুন</h2>
              
              {/* Transaction Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>অপারেটর:</span>
                    <span className="font-medium">{selectedOperator?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>নম্বর:</span>
                    <span className="font-medium">{phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>পরিমাণ:</span>
                    <span className="font-medium">৳{amount}</span>
                  </div>
                  {selectedOffer && (
                    <>
                      <div className="flex justify-between">
                        <span>মেয়াদ:</span>
                        <span className="font-medium">{selectedOffer.validity}</span>
                      </div>
                      {selectedOffer.data && (
                        <div className="flex justify-between">
                          <span>ডেটা:</span>
                          <span className="font-medium">{selectedOffer.data}</span>
                        </div>
                      )}
                    </>
                  )}
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
                      errors.pin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin}</p>}
                <p className="text-xs text-gray-500 mt-1">ডেমো পিন: 12345</p>
              </div>

              {/* Warning */}
              <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-800">
                    রিচার্জ নিশ্চিত করার পর টাকা ফেরত পাওয়া যাবে না। নম্বর ও পরিমাণ যাচাই করুন।
                  </p>
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
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              পরবর্তী
            </button>
          ) : (
            <button
              onClick={handleRecharge}
              disabled={isProcessing}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                isProcessing
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isProcessing ? 'প্রক্রিয়াধীন...' : 'রিচার্জ করুন'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
