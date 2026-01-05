import { useState } from "react";
import { ArrowLeft, UserPlus, Mail, Phone, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { sendFriendRequest } from "../lib/api/social";

export default function UserProfile() {
  const navigate = useNavigate();
  const { userPhone } = useParams<{ userPhone: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const currentUserPhone = localStorage.getItem("userPhone") || "";

  const handleSendFriendRequest = async () => {
    if (!userPhone) return;

    setIsLoading(true);
    const response = await sendFriendRequest(currentUserPhone, userPhone);

    if (response.ok) {
      setFriendRequestSent(true);
    } else {
      alert(response.error || "অনুরোধ পাঠানোর সময় ত্রুটি হয়েছে");
    }
    setIsLoading(false);
  };

  if (!userPhone) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">প্রোফাইল খুঁজে পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/social-feed")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">প্রোফাইল</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

          {/* Profile Info */}
          <div className="px-4 pb-4">
            {/* Avatar */}
            <div className="flex items-end gap-4 -mt-16 mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white">
                {userPhone?.charAt(0) || "U"}
              </div>

              {currentUserPhone !== userPhone && (
                <button
                  onClick={handleSendFriendRequest}
                  disabled={isLoading || friendRequestSent}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                    friendRequestSent
                      ? "bg-gray-100 text-gray-600 cursor-default"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  {friendRequestSent ? "অনুরোধ পাঠানো হয়েছে" : "বন্ধু যোগ করুন"}
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                ব্যবহারকারী
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {userPhone}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">বন্ধু</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">পোস্ট</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">অনুসরণকারী</p>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">জীবনী</h3>
              <p className="text-gray-600 text-sm">
                এটি একটি নতুন ব্যবহারকারী প্রোফাইল
              </p>
            </div>

            {/* Joined */}
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              আজ যোগ দিয়েছেন
            </div>
          </div>
        </div>

        {/* User Posts Section */}
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">সাম্প্রতিক পোস্টসমূহ</h2>
          <p className="text-gray-600 text-center py-8">
            এই ব্যবহারকারীর কোন পোস্ট নেই
          </p>
        </div>
      </div>
    </div>
  );
}
