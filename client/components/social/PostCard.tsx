import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreVertical, Trash2 } from "lucide-react";
import { Post, toggleLike, deletePost } from "../../lib/api/social";
import { CommentsSection } from "./CommentsSection";

interface PostCardProps {
  post: Post;
  currentUserPhone: string;
  currentUserName: string;
  currentUserPhoto?: string;
  onPostDeleted?: () => void;
  onCommentAdded?: () => void;
}

export function PostCard({
  post,
  currentUserPhone,
  currentUserName,
  currentUserPhoto,
  onPostDeleted,
  onCommentAdded,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    const response = await toggleLike(post.id, currentUserPhone, currentUserName);

    if (response.ok) {
      setLiked(response.liked || false);
      setLikesCount((prev) => (response.liked ? prev + 1 : prev - 1));
    }
    setIsLiking(false);
  };

  const handleDelete = async () => {
    if (window.confirm("এই পোস্ট মুছে ফেলতে চান?")) {
      const response = await deletePost(post.id);
      if (response.ok) {
        onPostDeleted?.();
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "এখনই";
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    if (diffDays < 7) return `${diffDays} দিন আগে`;

    return date.toLocaleDateString("bn-BD");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {post.userPhoto ? (
              <img
                src={post.userPhoto}
                alt={post.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {post.userName?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{post.userName}</h3>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {post.userPhone === currentUserPhone && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    মুছুন
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt="post"
            className="w-full rounded-lg max-h-96 object-cover"
          />
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-600 flex justify-between">
        <span>{likesCount} পছন্দ</span>
        <span>{post.commentsCount} মন্তব্য</span>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-around gap-2">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg transition-colors ${
            liked
              ? "text-red-600 bg-red-50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm">পছন্দ</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 flex-1 justify-center py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">মন্তব্য</span>
        </button>

        <button className="flex items-center gap-2 flex-1 justify-center py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="text-sm">শেয়ার</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentsSection
          postId={post.id}
          currentUserPhone={currentUserPhone}
          currentUserName={currentUserName}
          currentUserPhoto={currentUserPhoto}
          onCommentAdded={onCommentAdded}
        />
      )}
    </div>
  );
}
