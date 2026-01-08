import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Send,
  Smile,
  Image,
  X,
} from "lucide-react";

export interface Post {
  id: string;
  author: {
    name: string;
    phone: string;
    photo: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  liked: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    phone: string;
    photo: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

interface EnhancedPostCardProps {
  post: Post;
  currentUserName: string;
  currentUserPhone: string;
  currentUserPhoto?: string;
  onDelete?: () => void;
}

export function EnhancedPostCard({
  post,
  currentUserName,
  currentUserPhone,
  currentUserPhoto,
  onDelete,
}: EnhancedPostCardProps) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: {
          name: currentUserName,
          phone: currentUserPhone,
          photo:
            currentUserPhoto ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserPhone}`,
        },
        content: newComment,
        timestamp: "এখন",
        likes: 0,
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* পোস্ট হেডার */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={post.author.photo}
            alt={post.author.name}
            className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
          />
          <div>
            <p className="font-bold text-gray-900 hover:underline cursor-pointer">
              {post.author.name}
            </p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>

        {/* মেনু বাটন */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              {post.author.phone === currentUserPhone ? (
                <>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                    পোস্ট সম্পাদনা করুন
                  </button>
                  <button
                    onClick={onDelete}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  >
                    পোস্ট মুছুন
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                    পোস্ট লুকান
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                    জানান এটি স্প্যাম
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* পোস্ট কন্টেন্ট */}
      <div className="p-4">
        <p className="text-gray-900 text-base leading-normal break-words">
          {post.content}
        </p>

        {/* পোস্ট ইমেজ */}
        {post.image && (
          <div className="mt-3 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={post.image}
              alt="পোস্ট ইমেজ"
              className="w-full h-auto max-h-96 object-cover hover:opacity-90 cursor-pointer"
            />
          </div>
        )}

        {/* পোস্ট স্ট্যাটিস্টিক্স */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1">
            <span className="bg-bkash-500 text-white rounded-full px-2 py-1 text-xs">
              ❤️
            </span>
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{comments.length} কমেন্ট</span>
            <span>{post.shares} শেয়ার</span>
          </div>
        </div>

        {/* অ্যাকশন বাটন */}
        <div className="grid grid-cols-3 gap-2 py-2">
          <button
            onClick={handleLike}
            className={`py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              liked
                ? "text-bkash-500 bg-bkash-50 hover:bg-bkash-100"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            পছন্দ
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="py-2 rounded-lg font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            কমেন্ট
          </button>

          <button className="py-2 rounded-lg font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
            <Share className="w-5 h-5" />
            শেয়ার করুন
          </button>
        </div>
      </div>

      {/* কমেন্ট সেকশন */}
      {showComments && (
        <div className="border-t border-gray-100 p-4">
          {/* বিদ্যমান কমেন্ট */}
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <img
                  src={comment.author.photo}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {comment.author.name}
                    </p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 ml-2">
                    <span className="text-xs text-gray-500">
                      {comment.timestamp}
                    </span>
                    <button className="text-xs text-gray-500 hover:text-bkash-500">
                      পছন্দ করুন ({comment.likes})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* নতুন কমেন্ট ইনপুট */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <img
              src={
                currentUserPhoto ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserPhone}`
              }
              alt="আপনার প্রোফাইল"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCommentSubmit();
                  }
                }}
                placeholder="আপনার মতামত শেয়ার করুন..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button className="text-gray-500 hover:text-bkash-500">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()}
              className="text-bkash-500 hover:text-bkash-600 disabled:text-gray-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
