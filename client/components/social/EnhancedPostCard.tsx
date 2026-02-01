import { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Send,
  X,
  Smile,
} from "lucide-react";
import { Post as APIPost } from "../../lib/api/social";

export interface Post {
  id: string;
  userPhone: string;
  userName: string;
  userPhoto?: string;
  content: string;
  image?: string;
  mediaType?: "image" | "video";
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  likes?: number;
  comments?: Comment[];
  shares?: number;
  liked?: boolean;
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
  post: Post | APIPost;
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
  const [liked, setLiked] = useState((post as any).liked || false);
  const [likeCount, setLikeCount] = useState(
    (post as any).likes || (post as APIPost).likesCount || 0,
  );
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(
    (post as any).comments || [],
  );
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const reactionRef = useRef<HTMLDivElement>(null);

  // Handle both old and new post interfaces
  const postData = post as APIPost & {
    liked?: boolean;
    comments?: Comment[];
    shares?: number;
  };
  const authorPhoto =
    postData.userPhoto ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${postData.userPhone}`;

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

  const emotions = [
    { emoji: "👍", name: "পছন্দ" },
    { emoji: "❤️", name: "ভালোবাসা" },
    { emoji: "😂", name: "হাসি" },
    { emoji: "😮", name: "অবাক" },
    { emoji: "😢", name: "দুঃখ" },
    { emoji: "😠", name: "রাগ" },
  ];

  const getTimeAgo = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return "এখন";
      if (seconds < 3600) return `${Math.floor(seconds / 60)} মিনিট আগে`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)} ঘণ্টা আগে`;
      return `${Math.floor(seconds / 86400)} দিন আগে`;
    } catch {
      return "এখন";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reactionRef.current &&
        !reactionRef.current.contains(event.target as Node)
      ) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showReactions]);

  const handleReaction = (emoji: string) => {
    setUserReaction(userReaction === emoji ? null : emoji);
    setShowReactions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* পোস্ট হেডার */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={authorPhoto}
            alt={postData.userName}
            className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80 object-cover"
          />
          <div>
            <p className="font-bold text-gray-900 hover:underline cursor-pointer">
              {postData.userName}
            </p>
            <p className="text-xs text-gray-500">
              {getTimeAgo(postData.createdAt)}
            </p>
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
              {postData.userPhone === currentUserPhone ? (
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
          {postData.content}
        </p>

        {/* পোস্ট মিডিয়া */}
        {postData.image && (
          <div className="mt-3 rounded-lg overflow-hidden bg-gray-100">
            {postData.mediaType === "video" ? (
              <video
                src={postData.image}
                className="w-full h-auto max-h-96 object-cover hover:opacity-90 cursor-pointer"
                controls
                controlsList="nodownload"
              />
            ) : (
              <img
                src={postData.image}
                alt="পোস্ট ইমেজ"
                className="w-full h-auto max-h-96 object-cover hover:opacity-90 cursor-pointer"
              />
            )}
          </div>
        )}

        {/* পোস্ট স্ট্যাটিস্টিক্স */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1">
            <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              ❤️
            </span>
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{comments.length} কমেন্ট</span>
            <span>{(postData as any).shares || 0} শেয়ার</span>
          </div>
        </div>

        {/* অ্যাকশন বাটন */}
        <div className="grid grid-cols-3 gap-2 py-2 relative">
          {/* রিঅ্যাকশন বাটন */}
          <div ref={reactionRef} className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className={`w-full py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                userReaction
                  ? "text-blue-500 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{userReaction || "👍"}</span>
              পছন্দ
            </button>

            {/* ইমোজি প্যানেল */}
            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-1 z-20">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.emoji}
                    onClick={() => handleReaction(emotion.emoji)}
                    className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={emotion.name}
                  >
                    {emotion.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

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
                  className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
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
                    <button className="text-xs text-gray-500 hover:text-blue-500">
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
              className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
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
            </div>
            <button
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()}
              className="text-blue-500 hover:text-blue-600 disabled:text-gray-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
