import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Settings, Zap } from "lucide-react";
import {
  getMonetizeSettings,
  updateMonetizeSettings,
} from "../../lib/api/ads";

interface ContentMonetizeSettingsProps {
  userPhone: string;
  userName: string;
}

export function ContentMonetizeSettings({
  userPhone,
  userName,
}: ContentMonetizeSettingsProps) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, [userPhone]);

  const loadSettings = async () => {
    setLoading(true);
    const response = await getMonetizeSettings(userPhone);
    if (response.ok && response.settings) {
      setEnabled(response.settings.contentMonetizeEnabled);
    }
    setLoading(false);
  };

  const handleToggle = async () => {
    setUpdating(true);
    setError("");
    setSuccessMessage("");

    const response = await updateMonetizeSettings(userPhone, !enabled);

    if (response.ok) {
      setEnabled(!enabled);
      setSuccessMessage(
        !enabled
          ? "বিষয়বস্তু মনিটাইজেশন সক্রিয় করা হয়েছে ✓"
          : "বিষয়বস্তু মনিটাইজেশন নিষ্ক্রিয় করা হয়েছে",
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(response.error || "সেটিংস আপডেট করতে ব্যর্থ");
    }

    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">বিষয়বস্তু মনিটাইজেশন</h2>
        </div>
        <p className="text-sm text-gray-600 ml-12">
          আপনার পোস্ট এবং গল্পের উপর বিজ্ঞাপন দেখান এবং আয় করুন
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Main Toggle */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">বিজ্ঞাপন সক্ষম করুন</h3>
            <p className="text-sm text-gray-600">
              আপনার বিষয়বস্তুর উপর প্রাসঙ্গিক বিজ্ঞাপন দেখান
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={updating}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              enabled ? "bg-green-600" : "bg-gray-300"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                enabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Info Cards */}
        {enabled && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 mb-1">সক্রিয়</p>
                <p className="text-sm text-green-700">
                  বিজ্ঞাপনগুলি এখন আপনার নিউজফিডে দেখাবে এবং আপনি প্রতিটি ১০০০ ভিউ এর জন্য ৳{" "}
                  <span className="font-semibold">10</span> আয় করবেন।
                </p>
              </div>
            </div>
          </div>
        )}

        {!enabled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">নিষ্ক্রিয়</p>
                <p className="text-sm text-blue-700">
                  বিষয়বস্তু মনিটাইজেশন এখন বন্ধ। সক্ষম করুন এবং আপনার বিষয়বস্তু থেকে আয় করুন।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features List */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">মনিটাইজেশন সুবিধাগুলি</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              স্বয়ংক্রিয় বিজ্ঞাপন প্রদর্শন
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              প্রতিটি ১০০০ ভিউতে ৳10 উপার্জন
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              বিজ্ঞাপনদাতাদের জন্য প্রথম ২টি বিজ্ঞাপন বিনামূল্যে
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              রিয়েল-টাইম উপার্জন বিশ্লেষণ
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Important Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-amber-900 mb-1">গুরুত্বপূর্ণ:</p>
          <p className="text-xs text-amber-700">
            বিজ্ঞাপন আপনার নিউজফিড এবং গল্পগুলিতে প্রদর্শিত হবে। নিশ্চিত করুন যে আপনার বিষয়বস্তু
            আমাদের সম্প্রদায়ের নির্দেশিকা মেনে চলে এবং নিরাপদ, উপযুক্ত এবং বিজ্ঞাপনের জন্য উপযুক্ত।
          </p>
        </div>
      </div>
    </div>
  );
}
