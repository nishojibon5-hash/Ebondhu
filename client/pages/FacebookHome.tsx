import { useState, useEffect } from "react";
import {
  Home,
  Users,
  Play,
  ShoppingBag,
  Gamepad2,
  Clock,
  Bookmark,
  Flag,
  Settings,
  HelpCircle,
  MessageCircle,
  Bell,
  Search,
  Menu,
  X,
  Plus,
  EllipsisHorizontal,
  Zap,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { CreatePost } from "../components/social/CreatePost";
import { EnhancedPostCard, Post } from "../components/social/EnhancedPostCard";
import { StorySection } from "../components/social/StorySection";
import { Sidebar } from "../components/social/Sidebar";
import { getFeed } from "../lib/api/social";

export default function FacebookHome() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);

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
      setPosts(
        response.posts.map((p) => ({
          ...p,
          likes: Math.floor(Math.random() * 100) + 5,
          shares: Math.floor(Math.random() * 20),
          liked: false,
          comments: [],
        }))
      );
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* টপ নেভিগেশন বার */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* লোগো */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 rounded-lg p-2 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">amarcash</h1>
          </div>

          {/* সার্চ বার */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="অনুসন্ধান করুন..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full outline-none text-sm focus:bg-gray-50"
              />
            </div>
          </div>

          {/* ডান দিকের বাটনগুলি */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex">
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </button>
            <Link
              to="/notifications"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex relative"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </Link>

            {/* প্রোফাইল ড্রপডাউন */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
              >
                <img
                  src={
                    userPhoto ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userPhone}`
                  }
                  alt="প্রোফাইল"
                  className="w-8 h-8 rounded-full"
                />
                <Menu className="w-5 h-5 text-gray-700" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-48 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 hover:bg-gray-50 text-sm text-gray-900 font-semibold"
                  >
                    👤 আমার প্রোফাইল
                  </Link>
                  <button
                    onClick={() => navigate("/earning-dashboard")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-900 font-semibold border-t border-gray-200"
                  >
                    ⚡ ক্যাশ সেবা
                  </button>
                  <Link
                    to="/settings"
                    className="block px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 border-t border-gray-200"
                  >
                    ⚙️ সেটিংস
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-red-600 font-semibold border-t border-gray-200"
                  >
                    🚪 লগ আউট
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* বাম সাইডবার - নেভিগেশন মেনু */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-20 p-4 space-y-2">
              {[
                { icon: Home, label: "হোম", path: "/", active: true },
                { icon: Users, label: "বন্ধুরা", path: "/friends" },
                { icon: MessageCircle, label: "মেসেঞ্জার", path: "/messages" },
                { icon: Play, label: "ভিডিও", path: "/videos" },
                { icon: ShoppingBag, label: "মার্কেটপ্লেস", path: "/marketplace" },
                { icon: Gamepad2, label: "গেমস", path: "/games" },
                { icon: Clock, label: "স্মৃতি", path: "/memories" },
                { icon: Bookmark, label: "সংরক্ষিত", path: "/saved" },
              ].map(({ icon: Icon, label, path, active }, index) => (
                <Link
                  key={index}
                  to={path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? "bg-bkash-50 text-bkash-600 font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{label}</span>
                </Link>
              ))}

              <hr className="my-4" />

              {/* যোগাযোগ তালিকা */}
              <p className="px-4 text-xs font-bold text-gray-500 uppercase">
                অনলাইনে
              </p>
              {[
                { name: "করিম", online: true },
                { name: "ফাতেমা", online: true },
                { name: "আহমেদ", online: false },
              ].map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                    {user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* মধ্য কলাম - ফিড */}
          <div className="lg:col-span-2">
            {/* স্টোরি সেকশন */}
            <StorySection
              currentUserPhone={userPhone}
              currentUserName={userName}
              currentUserPhoto={userPhoto}
              onCreateStory={() => setShowCreateStory(!showCreateStory)}
            />

            {/* পোস্ট তৈরি */}
            {userPhone && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      userPhoto ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userPhone}`
                    }
                    alt="আপনার প্রোফাইল"
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <input
                    type="text"
                    placeholder={`${userName}, আপনার চিন্তা শেয়ার করুন...`}
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:bg-gray-50"
                  />
                </div>
                <hr className="my-3" />
                <div className="flex items-center justify-around gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700 text-sm font-semibold flex-1 justify-center">
                    🎥 লাইভ ভিডিও
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700 text-sm font-semibold flex-1 justify-center">
                    🖼️ ছবি/ভিডিও
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700 text-sm font-semibold flex-1 justify-center">
                    😊 অনুভূতি
                  </button>
                </div>
              </div>
            )}

            {/* পোস্ট ফিড */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bkash-500"></div>
                <p className="text-gray-600 mt-2">ফিড লোড করছি...</p>
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
                  <EnhancedPostCard
                    key={post.id}
                    post={post}
                    currentUserName={userName}
                    currentUserPhone={userPhone}
                    currentUserPhoto={userPhoto}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ডান সাইডবার */}
          <Sidebar currentUserPhone={userPhone} />
        </div>
      </div>

      {/* মোবাইল বটম নেভিগেশন */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex-1 flex flex-col items-center justify-center py-3 text-bkash-600 border-t-2 border-bkash-600 font-bold">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">হোম</span>
          </button>
          <button
            onClick={() => navigate("/friends")}
            className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">বন্ধুরা</span>
          </button>
          <button
            onClick={() => navigate("/earning-dashboard")}
            className="flex-1 flex flex-col items-center justify-center py-3 bg-gradient-to-r from-bkash-500 to-bkash-600 text-white font-bold"
          >
            <Zap className="w-6 h-6" />
            <span className="text-xs mt-1">আয়</span>
          </button>
          <button className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1">চ্যাট</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">আমি</span>
          </button>
        </div>
      </div>
    </div>
  );
}
