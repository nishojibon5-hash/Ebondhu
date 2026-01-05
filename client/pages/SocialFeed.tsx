import { useState, useEffect } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreatePost } from "../components/social/CreatePost";
import { PostCard } from "../components/social/PostCard";
import { getFeed, Post } from "../lib/api/social";

export default function SocialFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const userPhone = localStorage.getItem("userPhone") || "";
  const userName = localStorage.getItem("userName") || "ব্যবহারকারী";
  const userPhoto = localStorage.getItem("userPhoto") || undefined;

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

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">আমার ক্যাশ সোশ্যাল</h1>
        </div>
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
            <p className="text-gray-600">ফিড লোড করছি...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-2">এখনও কোন পোস্ট নেই</p>
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
    </div>
  );
}
