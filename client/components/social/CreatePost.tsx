import { useState } from "react";
import { Heart, MessageCircle, Share2, Image as ImageIcon } from "lucide-react";
import { createPost } from "../../lib/api/social";
import { uploadImage } from "../../lib/api/media";

interface CreatePostProps {
  userPhone: string;
  userName: string;
  userPhoto?: string;
  onPostCreated: () => void;
}

export function CreatePost({
  userPhone,
  userName,
  userPhoto,
  onPostCreated,
}: CreatePostProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      setError("পোস্ট খালি রাখা যাবে না");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let imageUrl = "";

      // Upload image if present
      if (image) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], "post-image.jpg", {
                type: "image/jpeg",
              });
              const uploadResponse = await uploadImage(file);

              if (uploadResponse.ok && uploadResponse.file) {
                imageUrl = uploadResponse.file.id;
              }
            }

            // Create post
            await createPostData(imageUrl);
          }, "image/jpeg");
        };

        img.src = image;
      } else {
        await createPostData("");
      }
    } catch (err) {
      setError("পোস্ট তৈরিতে ত্রুটি হয়েছে");
      setIsLoading(false);
    }
  };

  const createPostData = async (imageUrl: string) => {
    const response = await createPost(
      userPhone,
      userName,
      userPhoto,
      content,
      imageUrl,
    );

    if (response.ok) {
      setContent("");
      setImage(null);
      onPostCreated();
    } else {
      setError(response.error || "পোস্ট তৈরি ব্যর্থ");
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
            {userName?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-800">{userName}</p>
          <p className="text-xs text-gray-500">{userPhone}</p>
        </div>
      </div>

      {/* Content Input */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="আপনার চিন্তা শেয়ার করুন..."
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        rows={3}
      />

      {/* Image Preview */}
      {image && (
        <div className="mt-3 relative">
          <img
            src={image}
            alt="preview"
            className="w-full max-h-60 object-cover rounded-lg"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-600">
          <ImageIcon className="w-5 h-5" />
          <span className="text-sm">ছবি</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </label>

        <button
          onClick={handlePost}
          disabled={isLoading || !content.trim()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
        >
          {isLoading ? "পোস্ট করছি..." : "পোস্ট করুন"}
        </button>
      </div>
    </div>
  );
}
