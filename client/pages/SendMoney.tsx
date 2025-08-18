import { useState } from "react";
import { 
  ArrowLeft,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Phone,
  Eye,
  EyeOff
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Contact {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  lastUsed?: string;
}

export default function SendMoney() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [recipient, setRecipient] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [reference, setReference] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Demo contacts
  const recentContacts: Contact[] = [
    { id: 1, name: 'মোঃ করিম', phone: '01711123456', avatar: '👨‍💼', lastUsed: 'গতকাল' },
    { id: 2, name: 'ফাতেমা বেগম', phone: '01812234567', avatar: '👩‍🎓', lastUsed: '৩ দিন আগে' },
    { id: 3, name: 'রহিম উদ্দিন', phone: '01913345678', avatar: '👨‍🔧', lastUsed: '১ সপ্তাহ আগে' }
  ];

  const currentBalance = parseFloat(localStorage.getItem('userBalance') || '5000');
  const transferCharge = 5;

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!recipient) newErrors.recipient = 'প্রাপক নির্বাচন করুন';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};
    const transferAmount = parseFloat(amount);
    
    if (!amount || transferAmount <= 0) newErrors.amount = 'সঠিক পরিমাণ লিখুন';
    else if (transferAmount < 10) newErrors.amount = 'ন্যূনতম ১০ টাকা পাঠাতে পারবেন';
    else if (transferAmount > 25000) newErrors.amount = 'সর্বোচ্চ ২৫,০০০ টাকা পাঠাতে পারবেন';
    else if ((transferAmount + transferCharge) > currentBalance) {
      newErrors.amount = 'অপর্যাপ্ত ব্যালেন্স (চার্জ সহ)';
    }
    
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

  const handleSendMoney = () => {
    if (validateStep3()) {
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        // Verify PIN (demo: 12345)
        if (pin === '12345' || pin === localStorage.getItem('userPin')) {
          const transferAmount = parseFloat(amount);
          const totalDeduction = transferAmount + transferCharge;
          
          // Update balance
          const newBalance = currentBalance - totalDeduction;
          localStorage.setItem('userBalance', newBalance.toString());
          
          // Save transaction
          const transaction = {
            id: Date.now(),
            type: 'send_money',
            amount: transferAmount,
            charge: transferCharge,
            recipient: recipient?.name,
            recipientPhone: recipient?.phone,
            reference,
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

  const selectRecipient = (contact: Contact) => {
    setRecipient(contact);
    setCurrentStep(2);
  };

  const selectRecipientByPhone = () => {
    const phone = prompt('প্রাপকের মোবাইল নম্বর লিখুন:');
    if (phone && phone.length === 11 && phone.startsWith('01')) {
      const newContact: Contact = {
        id: Date.now(),
        name: 'নতুন প্রাপক',
        phone,
        avatar: '👤'
      };
      setRecipient(newContact);
      setCurrentStep(2);
    } else if (phone) {
      alert('সঠিক মোবাইল নম্বর দিন (১১ সংখ্যা)');
    }
  };

  if (currentStep === 4) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold">টাকা পাঠানো সফল</h1>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">সফলভাবে পাঠানো হয়েছে!</h2>
            <p className="text-gray-600 mb-6">আপনার টাকা পাঠানো সম্পন্ন হয়েছে</p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">প্রাপক</span>
                  <span className="font-medium">{recipient?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">মোবাইল</span>
                  <span className="font-medium">{recipient?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">পরিমাণ</span>
                  <span className="font-medium">৳{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">চার্জ</span>
                  <span className="font-medium">৳{transferCharge}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-medium">মোট</span>
                  <span className="font-bold text-bkash-500">��{parseFloat(amount) + transferCharge}</span>
                </div>
                {reference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">রেফারেন্স</span>
                    <span className="font-medium">{reference}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                হোমে ফিরুন
              </button>
              <button 
                onClick={() => {
                  setCurrentStep(1);
                  setRecipient(null);
                  setAmount('');
                  setPin('');
                  setReference('');
                  setErrors({});
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                আরো টাকা পাঠান
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
            <h1 className="text-xl font-bold">টাকা পাঠান</h1>
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
        {/* Step 1: Select Recipient */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">কার কাছে পাঠাবেন?</h2>
              
              {/* Add New Recipient */}
              <button
                onClick={selectRecipientByPhone}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-bkash-500 hover:bg-bkash-50 transition-colors mb-4"
              >
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">নতুন নম্বর যোগ করুন</span>
                </div>
              </button>

              {/* Recent Contacts */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 text-sm">সাম্প্রতিক</h3>
                {recentContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => selectRecipient(contact)}
                    className="w-full p-3 border border-gray-200 rounded-xl hover:border-bkash-500 hover:bg-bkash-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {contact.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                      {contact.lastUsed && (
                        <p className="text-xs text-gray-500">{contact.lastUsed}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {currentStep === 2 && recipient && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">কত ��াকা পাঠাবেন?</h2>
              
              {/* Recipient Info */}
              <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                    {recipient.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">{recipient.name}</p>
                    <p className="text-sm text-blue-700">{recipient.phone}</p>
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
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[100, 200, 500, 1000].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="p-2 text-sm border border-gray-300 rounded-lg hover:border-bkash-500 hover:bg-bkash-50 transition-colors"
                  >
                    ৳{quickAmount}
                  </button>
                ))}
              </div>

              {/* Reference (Optional) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  রেফারেন্স (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="যেমন: বেতন, উপহার, ইত্যাদি"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                />
              </div>

              {/* Charge Info */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>পাঠানোর পরিমাণ:</span>
                      <span>৳{amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>সেবা চার্জ:</span>
                      <span>৳{transferCharge}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-yellow-300 pt-2">
                      <span>মোট কেটে নেওয়া হবে:</span>
                      <span>৳{parseFloat(amount) + transferCharge}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Enter PIN */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">পিন দিয়ে নিশ্চিত করুন</h2>
              
              {/* Transaction Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>প্রাপক:</span>
                    <span className="font-medium">{recipient?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>মোবাইল:</span>
                    <span className="font-medium">{recipient?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>পরিমাণ:</span>
                    <span className="font-medium">৳{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>চার্জ:</span>
                    <span className="font-medium">৳{transferCharge}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                    <span>মোট:</span>
                    <span className="text-bkash-500">৳{parseFloat(amount) + transferCharge}</span>
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
              <div className="bg-red-50 rounded-xl p-3 border border-red-200 mb-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-800">
                    নিশ্চিত করার পর টাকা ফেরত পাওয়া যাবে না। সঠিক নম্বর ও পরিমাণ যাচাই করুন।
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
              onClick={handleSendMoney}
              disabled={isProcessing}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                isProcessing
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isProcessing ? 'প্রক্রিয়াধীন...' : 'টাকা পাঠান'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
