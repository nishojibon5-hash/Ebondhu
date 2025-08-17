import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Building2,
  User,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Save,
  Briefcase
} from "lucide-react";

export default function SomitiSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    somitiName: '',
    managerName: '',
    managerPhone: '',
    area: '',
    establishedDate: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.somitiName || !formData.managerName || !formData.managerPhone) {
      setError('প্রয়োজনীয় সব ফিল্ড পূরণ করুন');
      setIsLoading(false);
      return;
    }

    if (formData.managerPhone.length !== 11) {
      setError('সঠিক মোবাইল নম্বর দিন');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess('সমিতি ম্যানেজার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
      
      // Store somiti manager data
      const somitiData = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        totalMembers: 0,
        totalWorkers: 0,
        totalFund: 0
      };
      
      localStorage.setItem('somitiManager', JSON.stringify(somitiData));
      localStorage.setItem('isSomitiManager', 'true');
      
      setTimeout(() => {
        navigate('/somiti-manager');
      }, 2000);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bkash-50 to-bkash-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">সমিতি ম্যানেজার</h1>
          <p className="text-gray-600">নতুন সমিতি তৈরি করুন</p>
        </div>

        {/* Setup Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">সমিতির তথ্য</h3>
              <p className="text-sm text-gray-600">আপনার সমিতির বিস্তারিত তথ্য দিন</p>
            </div>

            {/* Somiti Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                সমিতির নাম *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.somitiName}
                  onChange={(e) => handleInputChange('somitiName', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="যেমন: আশা সমিতি"
                />
              </div>
            </div>

            {/* Manager Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ম্যানেজারের নাম *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.managerName}
                  onChange={(e) => handleInputChange('managerName', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="আপনার পূর্ণ নাম"
                />
              </div>
            </div>

            {/* Manager Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ম্যানেজারের মোবাইল *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.managerPhone}
                  onChange={(e) => handleInputChange('managerPhone', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                />
              </div>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                এলাকা
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="যেমন: ঢাকা, মিরপুর"
                />
              </div>
            </div>

            {/* Established Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                প্রতিষ্ঠার তারিখ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.establishedDate}
                  onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিবরণ (ঐচ্ছিক)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="সমিতি সম্পর্কে কিছু বলুন..."
              />
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

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>সমিতি তৈরি করুন</span>
                </>
              )}
            </button>

            {/* Back Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <Link 
                to="/" 
                className="text-purple-500 hover:text-purple-600 font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>ড্যাশবোর্ডে ফিরে যান</span>
              </Link>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-blue-800 text-xs text-center">
                <strong>বিঃদ্রঃ</strong> সমিতি তৈরি করার পর আপনি কর্মী ও সদস্য যোগ করতে পারবেন।
                আপনার সমিতির সব কার্যক্রম পরিচালনা করতে পারবেন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
