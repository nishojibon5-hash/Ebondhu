import { useState } from "react";
import { X, Upload, AlertCircle } from "lucide-react";
import { createStory } from "../../lib/api/social";
import { uploadImage } from "../../lib/api/media";

interface CreateStoryProps {
  userPhone: string;
  userName: string;
  userPhoto?: string;
  onClose: () => void;
  onStoryCreated: () => void;
}

export function CreateStory({
  userPhone,
  userName,
  userPhoto,
  onClose,
  onStoryCreated,
}: CreateStoryProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("অনুগ্রহ করে একটি ছবি নির্বাচন করুন");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("ছবি খুব বড় (সর্বোচ্চ 10MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setError("");
    };
    reader.onerror = () => {
      setError("ছবি পড়তে ব্যর্থ হয়েছে");
    };
    reader.readAsDataURL(file);
  };

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

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.9,
          );
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

  const handleUpload = async () => {
    if (!image) {
      setError("অনুগ্রহ করে একটি ছবি নির্বাচন করুন");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Process image
      const imageBlob = await processImage(image);
      if (!imageBlob) {
        throw new Error("ছবি প্রক্রিয়া করতে ব্যর্থ হয়েছে");
      }

      // Upload image
      const imageFile = new File([imageBlob], "story.jpg", {
        type: "image/jpeg",
      });

      const uploadResponse = await uploadImage(imageFile);
      if (!uploadResponse.ok || !uploadResponse.file) {
        throw new Error(uploadResponse.error || "ছবি আপলোড ব্যর্থ");
      }

      const imageId = uploadResponse.file.id;

      // Create story
      const storyResponse = await createStory(
        userPhone,
        userName,
        userPhoto,
        imageId,
      );

      if (!storyResponse.ok) {
        throw new Error(storyResponse.error || "স্টোরি তৈরি ব্যর্থ");
      }

      setSuccessMessage("স্টোরি সফলভাবে শেয়ার করা হয়েছে! ✓");

      setTimeout(() => {
        setImage(null);
        onStoryCreated();
        onClose();
      }, 500);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "স্টোরি তৈরিতে ত্রুটি হয়েছে";
      console.error("Story upload error:", err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* হেডার */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">নতুন স্টোরি</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* কন্টেন্ট */}
        <div className="p-6">
          {image ? (
            <div className="space-y-4">
              <img
                src={image}
                alt="preview"
                className="w-full rounded-lg object-cover max-h-96"
              />
              <button
                onClick={() => setImage(null)}
                disabled={isLoading}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                অন্য ছবি বেছে নিন
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="story-image"
                  disabled={isLoading}
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">ছবি নির্বাচন করুন</p>
                  <p className="text-sm text-gray-500">বা এখানে টেনে আনুন</p>
                </div>
              </label>
            </div>
          )}

          {/* এরর মেসেজ */}
          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* সাফল্যের মেসেজ */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">
                {successMessage}
              </p>
            </div>
          )}
        </div>

        {/* ফুটার */}
        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            বাতিল
          </button>
          <button
            onClick={handleUpload}
            disabled={!image || isLoading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                আপলোড করছি...
              </>
            ) : (
              "স্টোরি শেয়ার করুন"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
