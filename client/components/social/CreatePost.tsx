import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  AlertCircle,
} from "lucide-react";
import { createPost } from "../../lib/api/social";
import { uploadImage, uploadVideo } from "../../lib/api/media";

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
  const [media, setMedia] = useState<{
    type: "image" | "video";
    data: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Process image asynchronously
  const processImage = (imageData: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/jpeg", 0.9);
        } catch (err) {
          console.error("Image processing error:", err);
          resolve(null);
        }
      };

      img.onerror = () => {
        console.error("Image load error");
        resolve(null);
      };

      img.src = imageData;
    });
  };

  const handleMediaSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(
        `ফাইলটি খুব বড় (সর্বোচ্চ ${type === "video" ? "50" : "10"}MB)`,
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setMedia({ type, data: event.target?.result as string });
      setError("");
    };
    reader.onerror = () => {
      setError("ফাইল পড়তে ব্যর্থ");
    };
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!content.trim()) {
      setError("পোস্ট খালি রাখা যাবে না");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      let mediaUrl = "";
      let mediaType = "";

      // Upload media if present
      if (media) {
        if (media.type === "image") {
          try {
            const imageBlob = await processImage(media.data);
            if (!imageBlob) {
              throw new Error("ছবি প্রক্রিয়া করতে ব্যর্থ");
            }

            const imageFile = new File([imageBlob], "post-image.jpg", {
              type: "image/jpeg",
            });
            const uploadResponse = await uploadImage(imageFile);

            if (!uploadResponse.ok || !uploadResponse.file) {
              throw new Error(uploadResponse.error || "ছবি আপলোড ব্যর্থ");
            }

            mediaUrl = uploadResponse.file.id;
            mediaType = "image";
          } catch (err) {
            const errorMsg =
              err instanceof Error ? err.message : "ছবি আপলোড ব্যর্থ";
            setError(errorMsg);
            setIsLoading(false);
            return;
          }
        } else if (media.type === "video") {
          try {
            const byteString = atob(media.data.split(",")[1]);
            const mimeString =
              media.data.split(",")[0].match(/:(.*?);/)?.[1] || "video/mp4";
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const videoBlob = new Blob([ab], { type: mimeString });
            const videoFile = new File([videoBlob], "post-video.mp4", {
              type: "video/mp4",
            });

            const uploadResponse = await uploadVideo(videoFile);

            if (!uploadResponse.ok || !uploadResponse.file) {
              throw new Error(uploadResponse.error || "ভিডিও আপলোড ব্যর্থ");
            }

            mediaUrl = uploadResponse.file.id;
            mediaType = "video";
          } catch (err) {
            const errorMsg =
              err instanceof Error ? err.message : "ভিডিও আপলোড ব্যর্থ";
            setError(errorMsg);
            setIsLoading(false);
            return;
          }
        }
      }

      // Create post
      const postResponse = await createPost(
        userPhone,
        userName,
        userPhoto,
        content,
        mediaUrl,
        mediaType as "image" | "video" | "",
      );

      if (!postResponse.ok) {
        throw new Error(postResponse.error || "পোস্ট তৈরি ব্যর্থ");
      }

      setContent("");
      setMedia(null);
      setSuccessMessage("পোস্ট সফলভাবে শেয়ার করা হয়েছে! ✓");
      
      // Reload feed after a short delay
      setTimeout(() => {
        onPostCreated();
        setSuccessMessage("");
      }, 500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "পোস্ট তৈরিতে ত্রুটি হয়েছে";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
      {/* হেডার */}
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

      {/* কন্টেন্ট ইনপুট */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="আপনার চিন্তা শেয়ার করুন..."
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        rows={3}
        disabled={isLoading}
      />

      {/* মিডিয়া প্রিভিউ */}
      {media && (
        <div className="mt-3 relative">
          {media.type === "image" ? (
            <img
              src={media.data}
              alt="preview"
              className="w-full max-h-60 object-cover rounded-lg"
            />
          ) : (
            <video
              src={media.data}
              className="w-full max-h-60 object-cover rounded-lg"
              controls
            />
          )}
          <button
            onClick={() => setMedia(null)}
            disabled={isLoading}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* এরর মেসেজ */}
      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* সাফল্যের মেসেজ */}
      {successMessage && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* অ্যাকশন */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-600 disabled:opacity-50">
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm">ছবি</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleMediaSelect(e, "image")}
              className="hidden"
              disabled={isLoading}
            />
          </label>

          <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-600 disabled:opacity-50">
            <VideoIcon className="w-5 h-5" />
            <span className="text-sm">ভিডিও</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleMediaSelect(e, "video")}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>

        <button
          onClick={handlePost}
          disabled={isLoading || !content.trim()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-shadow flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              পোস্ট করছি...
            </>
          ) : (
            "পোস্ট করুন"
          )}
        </button>
      </div>
    </div>
  );
}
