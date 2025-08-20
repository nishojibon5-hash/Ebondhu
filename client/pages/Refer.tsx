import { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Share2,
  Copy,
  Users,
  DollarSign,
  Gift,
  Smartphone,
  WhatsApp,
  Facebook,
  MessageCircle,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  referredUsers: Array<{
    id: number;
    name: string;
    phone: string;
    joinDate: string;
    status: 'completed' | 'pending';
    reward: number;
  }>;
}

export default function Refer() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [shareMethod, setShareMethod] = useState<'link' | 'code'>('link');

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = () => {
    // Generate referral code from user phone
    const userPhone = localStorage.getItem('userPhone') || '01711123456';
    const referralCode = `LB${userPhone.slice(-6)}`; // LB + last 6 digits

    // Load all referral data
    const allReferralData = JSON.parse(localStorage.getItem('referralData') || '{}');

    // Get user-specific data
    if (allReferralData[userPhone]) {
      setReferralData(allReferralData[userPhone]);
    } else {
      // Initialize referral data for this user
      const newData: ReferralData = {
        referralCode,
        totalReferrals: 0,
        totalEarnings: 0,
        referredUsers: []
      };

      // Save to all referral data
      allReferralData[userPhone] = newData;
      localStorage.setItem('referralData', JSON.stringify(allReferralData));
      setReferralData(newData);
    }
  };

  const shareLink = `https://loanbomdhu.app/register?ref=${referralData?.referralCode}`;
  const shareText = `লোন বন্ধু অ্যাপে যোগ দিন এবং দারুণ সব সুবিধা পান! আমার রেফার কোড: ${referralData?.referralCode}\n\nডাউনলোড লিংক: ${shareLink}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('কপি করা হয়েছে!');
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareViaSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
    window.open(smsUrl);
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">রেফার করুন</h1>
            <p className="text-sm text-orange-100">বন্ধুদের রেফার করে আয় করুন</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{referralData?.totalReferrals || 0}</p>
            <p className="text-sm text-gray-600">মোট রেফার</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">৳{referralData?.totalEarnings || 0}</p>
            <p className="text-sm text-gray-600">মোট আয়</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Gift className="h-5 w-5 text-orange-500" />
            <span>কিভাবে কাজ করে</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600">1</div>
              <div>
                <p className="font-medium text-gray-900">আপনার রেফার কোড শেয়ার করুন</p>
                <p className="text-sm text-gray-600">বন্ধুদের কাছে আপনার রেফার কোড পাঠান</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600">2</div>
              <div>
                <p className="font-medium text-gray-900">বন্ধু রেজিস্ট্রেশন করবে</p>
                <p className="text-sm text-gray-600">আপনার কোড দিয়ে নতুন অ্যাকাউন্ট তৈরি করবে</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600">3</div>
              <div>
                <p className="font-medium text-gray-900">১৫ টাকা পুরস্কার পান</p>
                <p className="text-sm text-gray-600">প্রতি সফল রেফারে ১৫ টাকা আপনার ব্যালেন্সে যোগ হবে</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">���পনার রেফার কোড</h2>
          
          {/* Tab Switch */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-4">
            <button
              onClick={() => setShareMethod('code')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                shareMethod === 'code'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              রেফার কোড
            </button>
            <button
              onClick={() => setShareMethod('link')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                shareMethod === 'link'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              লিংক
            </button>
          </div>

          {/* Code/Link Display */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-lg font-bold text-gray-900">
                {shareMethod === 'code' ? referralData?.referralCode : shareLink}
              </p>
              <button
                onClick={() => copyToClipboard(shareMethod === 'code' ? referralData?.referralCode || '' : shareLink)}
                className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4 text-orange-600" />
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={shareViaWhatsApp}
              className="p-3 bg-green-100 hover:bg-green-200 rounded-xl transition-colors text-center"
            >
              <MessageCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-green-800">WhatsApp</p>
            </button>

            <button
              onClick={shareViaFacebook}
              className="p-3 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors text-center"
            >
              <Facebook className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-blue-800">Facebook</p>
            </button>

            <button
              onClick={shareViaSMS}
              className="p-3 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors text-center"
            >
              <Smartphone className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-purple-800">SMS</p>
            </button>
          </div>
        </div>

        {/* Referred Users */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">আপনার রেফার তালিকা</h2>
          
          {referralData?.referredUsers && referralData.referredUsers.length > 0 ? (
            <div className="space-y-3">
              {referralData.referredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                      <p className="text-xs text-gray-500">{user.joinDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${
                      user.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {user.status === 'completed' ? 'সম্পন্ন' : 'অপেক্ষমাণ'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">৳{user.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">এখনও কোনো রেফার নেই</p>
              <p className="text-sm text-gray-400">বন্ধুদের রেফার করে আয় শুরু করুন</p>
            </div>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">শর্তাবলী:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• প্রতি রেফারে ১৫ টাকা পুরস্কার</li>
            <li>• একটি নম্বর দিয়ে শুধুমাত্র একটি অ্যাকাউন্ট</li>
            <li>• রেফার করা ব্যক্তি অবশ্যই রেজিস্ট্রেশন সম্পন্ন করতে হবে</li>
            <li>• পুরস্কার ২৤ ঘন্টার মধ্যে যোগ হবে</li>
            <li>• ভুয়া রেফার কঠোরভাবে নিষিদ্ধ</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
