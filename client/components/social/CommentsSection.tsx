import { useState, useEffect } from "react";
import { Trash2, Send } from "lucide-react";
import {
  addComment,
  getPostComments,
  deleteComment,
  Comment,
} from "../../lib/api/social";

interface CommentsSectionProps {
  postId: string;
  currentUserPhone: string;
  currentUserName: string;
  currentUserPhoto?: string;
  onCommentAdded?: () => void;
}

export function CommentsSection({
  postId,
  currentUserPhone,
  currentUserName,
  currentUserPhoto,
  onCommentAdded,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setIsLoading(true);
    const response = await getPostComments(postId);
    if (response.ok && response.comments) {
      setComments(response.comments);
    }
    setIsLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const response = await addComment(
      postId,
      currentUserPhone,
      currentUserName,
      currentUserPhoto,
      newComment,
    );

    if (response.ok && response.comment) {
      setComments([...comments, response.comment]);
      setNewComment("");
      onCommentAdded?.();
    }
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("মন্তব্য মুছে ফেলতে চান?")) {
      const response = await deleteComment(commentId);
      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "এখনই";
    if (diffMins < 60) return `${diffMins}মি`;

    return date.toLocaleDateString("bn-BD");
  };

  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
      {/* Comments List */}
      {isLoading ? (
        <p className="text-center text-gray-500 py-2 text-sm">লোড করছি...</p>
      ) : comments.length > 0 ? (
        <div className="space-y-3 mb-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              {comment.userPhoto ? (
                <img
                  src={comment.userPhoto}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {comment.userName?.charAt(0) || "U"}
                </div>
              )}

              <div className="flex-1 bg-white rounded-lg px-3 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {comment.userName}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.content}
                    </p>
                  </div>

                  {comment.userPhone === currentUserPhone && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Add Comment Form */}
      <div className="flex items-center gap-2">
        {currentUserPhoto ? (
          <img
            src={currentUserPhoto}
            alt={currentUserName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {currentUserName?.charAt(0) || "U"}
          </div>
        )}

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddComment();
              }
            }}
            placeholder="মন্তব্য লিখুন..."
            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleAddComment}
            disabled={isSubmitting || !newComment.trim()}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
