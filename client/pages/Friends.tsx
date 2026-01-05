import { useState, useEffect } from "react";
import { ArrowLeft, UserPlus, UserCheck, Trash2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  Friend,
  FriendRequest,
} from "../lib/api/social";

export default function Friends() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

  const userPhone = localStorage.getItem("userPhone") || "";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    const [friendsResponse, requestsResponse] = await Promise.all([
      getFriends(userPhone),
      getFriendRequests(userPhone),
    ]);

    if (friendsResponse.ok && friendsResponse.friends) {
      setFriends(friendsResponse.friends);
    }

    if (requestsResponse.ok && requestsResponse.requests) {
      setFriendRequests(requestsResponse.requests);
    }

    setIsLoading(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    const response = await acceptFriendRequest(requestId);
    if (response.ok) {
      setFriendRequests(friendRequests.filter((r) => r.id !== requestId));
      loadData();
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const response = await rejectFriendRequest(requestId);
    if (response.ok) {
      setFriendRequests(friendRequests.filter((r) => r.id !== requestId));
    }
  };

  const handleRemoveFriend = async (friendPhone: string) => {
    if (window.confirm("বন্ধু মুছে ফেলতে চান?")) {
      const response = await removeFriend(userPhone, friendPhone);
      if (response.ok) {
        setFriends(friends.filter((f) => f.friendPhone !== friendPhone));
      }
    }
  };

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
          <h1 className="text-xl font-bold text-gray-900">বন্ধুরা</h1>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 flex gap-4 border-t border-gray-200">
          <button
            onClick={() => setActiveTab("friends")}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === "friends"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            বন্ধু ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === "requests"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            অনুরোধ ({friendRequests.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">লোড করছি...</p>
          </div>
        ) : activeTab === "friends" ? (
          friends.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600 mb-2">এখনও কোন বন্ধু নেই</p>
              <p className="text-sm text-gray-500">
                মানুষকে খুঁজে তাদের সাথে সংযুক্ত হন
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                      {friend.friendPhone?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {friend.friendPhone}
                      </p>
                      <p className="text-xs text-gray-500">বন্ধু</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/profile/${friend.friendPhone}`)
                      }
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend.friendPhone)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : friendRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-2">কোন অনুরোধ নেই</p>
            <p className="text-sm text-gray-500">
              নতুন বন্ধুদের অনুরোধ এখানে দেখা যাবে
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {friendRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">
                    {request.fromPhone?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {request.fromPhone}
                    </p>
                    <p className="text-xs text-gray-500">বন্ধু অনুরোধ</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                  >
                    <UserCheck className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
