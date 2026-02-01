import { useState, useEffect } from "react";
import {
  ArrowLeft,
  UserPlus,
  Phone,
  MessageCircle,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  sendFriendRequest,
  getUserPosts,
  Post,
  getFriends,
} from "../lib/api/social";

export default function UserProfile() {
  const navigate = useNavigate();
  const { userPhone } = useParams<{ userPhone: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const currentUserPhone = localStorage.getItem("userPhone") || "";
  const currentUserName = localStorage.getItem("userName") || "";

  useEffect(() => {
    loadUserData();
  }, [userPhone]);

  const loadUserData = async () => {
    if (!userPhone) return;

    setIsLoading(true);
    try {
      // Load user's posts
      const postsResponse = await getUserPosts(userPhone);
      if (postsResponse.ok && postsResponse.posts) {
        setPosts(postsResponse.posts);
      }

      // Load user's friends count
      const friendsResponse = await getFriends(userPhone);
      if (friendsResponse.ok && friendsResponse.friends) {
        setFriendsCount(friendsResponse.friends.length);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleMessage = () => {
    if (userPhone) {
      navigate("/messages", { state: { selectedUserPhone: userPhone } });
    }
  };

  if (!userPhone) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">প্রোফাইল খুঁজে পাওয়া যায়নি</p>
      </div>
    );
  }

  // Generate user avatar initials
  const userInitial = userPhone?.charAt(0).toUpperCase() || "U";
  const userAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userPhone}`;

  return (
    <div className="min-h-screen bg-gray-100 pb-20 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-sm max-w-md mx-auto">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
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
            {/* Avatar and Actions */}
            <div className="flex items-end justify-between -mt-16 mb-4">
              <img
                src={userAvatarUrl}
                alt={userPhone}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />

              {currentUserPhone !== userPhone && (
                <div className="flex gap-2">
                  <button
                    onClick={handleMessage}
                    className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                    বার্তা
                  </button>
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
                    {friendRequestSent ? "অনুরোধ পাঠানো" : "বন্ধু যোগ করুন"}
                  </button>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                ব্যবহারকারী
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {userPhone}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{friendsCount}</p>
                <p className="text-sm text-gray-600">বন্ধু</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{posts.length}</p>
                <p className="text-sm text-gray-600">পোস্ট</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {posts.reduce((acc, post) => acc + post.likesCount, 0)}
                </p>
                <p className="text-sm text-gray-600">লাইক</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts Section */}
        {isLoading ? (
          <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-gray-500">লোড হচ্ছে...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="mt-4 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 px-4">সাম্প্রতিক পোস্টসমূহ</h2>
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <p className="text-gray-700">{post.content}</p>
                </div>

                {/* Post Image/Video */}
                {post.image && (
                  <div className="w-full bg-gray-200">
                    {post.mediaType === "video" ? (
                      <video
                        src={post.image}
                        className="w-full max-h-96 object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={post.image}
                        alt="পোস্ট"
                        className="w-full max-h-96 object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Post Stats */}
                <div className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    <span>{post.likesCount} জন পছন্দ করেছে</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} মন্তব্য</span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-4 py-2 flex gap-2 text-gray-600">
                  <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    পছন্দ
                  </button>
                  <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    মন্তব্য
                  </button>
                  <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    শেয়ার
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4">সাম্প্রতিক পোস্টসমূহ</h2>
            <p className="text-gray-600 text-center py-8">
              এই ব্যবহারকারীর কোন পোস্ট নেই
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
