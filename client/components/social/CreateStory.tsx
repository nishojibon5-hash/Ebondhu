import { useState } from "react";
import { X, Upload } from "lucide-react";
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("অনুগ্রহ করে একটি ছবি নির্বাচন করুন");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("অনুগ্রহ করে একটি ছবি নির্বাচন করুন");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Convert base64 to blob
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "story.jpg", { type: "image/jpeg" });
            const uploadResponse = await uploadImage(file);

            if (uploadResponse.ok && uploadResponse.file) {
              const imageId = uploadResponse.file.id;

              // Create story in database
              const storyResponse = await createStory(
                userPhone,
                userName,
                userPhoto,
                imageId,
              );

              if (storyResponse.ok) {
                onStoryCreated();
                onClose();
              } else {
                setError(storyResponse.error || "স্টোরি তৈরি ব্যর্থ");
              }
            } else {
              setError(uploadResponse.error || "ছবি আপলোড ব্যর্থ");
            }
          }
          setIsLoading(false);
        }, "image/jpeg");
      };

      img.onerror = () => {
        setError("ছবি লোড করতে পারা যায়নি");
        setIsLoading(false);
      };

      img.src = image;
    } catch (err) {
      setError("স্টোরি তৈরিতে ত্রুটি হয়েছে");
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
            className="p-1 hover:bg-gray-100 rounded-full"
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
                className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
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
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">ছবি নির্বাচন করুন</p>
                  <p className="text-sm text-gray-500">বা এখানে টেনে আনুন</p>
                </div>
              </label>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </div>

        {/* ফুটার */}
        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            বাতিল
          </button>
          <button
            onClick={handleUpload}
            disabled={!image || isLoading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? "আপলোড করছি..." : "স্টোরি শেয়ার করুন"}
          </button>
        </div>
      </div>
    </div>
  );
}
