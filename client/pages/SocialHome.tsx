import { useState, useEffect } from "react";
import { 
  Home, 
  Zap, 
  Users, 
  User, 
  MessageCircle,
  Heart,
  Share2,
  Smartphone,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { CreatePost } from "../components/social/CreatePost";
import { PostCard } from "../components/social/PostCard";
import { getFeed, Post } from "../lib/api/social";
import { getUserSession } from "../lib/storage";

export default function SocialHome() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "friends" | "profile">("feed");

  const userPhone = localStorage.getItem("userPhone") || "";
  const userName = localStorage.getItem("userName") || "ব্যবহারকারী";
  const userPhoto = localStorage.getItem("userPhoto");

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setIsLoading(true);
    const response = await getFeed(userPhone);
    if (response.ok && response.posts) {
      setPosts(response.posts);
    } else {
      setError(response.error || "ফিড লোড করতে ব্যর্থ");
    }
    setIsLoading(false);
  };

  const handlePostCreated = () => {
    loadFeed();
  };

  const handlePostDeleted = () => {
    loadFeed();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    localStorage.removeItem("userBalance");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 rounded-lg p-2 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">amarcash</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <Link
              to="/notifications"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {showMenu ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="bg-white border-t border-gray-200 absolute right-0 top-full w-48 shadow-lg rounded-b-lg">
            <Link
              to="/profile"
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-200 text-sm"
            >
              🧑‍💼 মোর প্রোফাইল
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-red-600"
            >
              🚪 লগ আউট
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Create Post */}
        {userPhone && (
          <CreatePost
            userPhone={userPhone}
            userName={userName}
            userPhoto={userPhoto}
            onPostCreated={handlePostCreated}
          />
        )}

        {/* Posts Feed */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bkash-500"></div>
            <p className="text-gray-600 mt-2">ফিড লোড করছি...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-600 mb-2 font-semibold">এখনও কোন পোস্ট নেই</p>
            <p className="text-sm text-gray-500">
              আপনার চিন্তা শেয়ার করুন এবং অন্যদের সাথে সংযুক্ত হন
            </p>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserPhone={userPhone}
                currentUserName={userName}
                currentUserPhoto={userPhoto}
                onPostDeleted={handlePostDeleted}
                onCommentAdded={handlePostCreated}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
              activeTab === "feed"
                ? "text-bkash-600 border-t-2 border-bkash-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">ফিড</span>
          </button>

          <button
            onClick={() => navigate("/friends")}
            className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">বন্ধুরা</span>
          </button>

          {/* Earning Button - Opens Cash App */}
          <button
            onClick={() => navigate("/earning-dashboard")}
            className="flex-1 flex flex-col items-center justify-center py-3 bg-gradient-to-r from-bkash-500 to-bkash-600 text-white font-bold transition-all transform hover:scale-105"
          >
            <Zap className="w-6 h-6" />
            <span className="text-xs font-bold mt-1">আয়</span>
          </button>

          <button
            onClick={() => navigate("/social-feed")}
            className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">চ্যাট</span>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">প্রোফাইল</span>
          </button>
        </div>
      </div>
    </div>
  );
}
