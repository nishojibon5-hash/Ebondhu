import { useState } from "react";
import {
  X,
  Upload,
  AlertCircle,
  Plus,
  BarChart3,
  Eye,
  MousePointerClick,
} from "lucide-react";
import {
  createAd,
  getAdvertiserAds,
  updateAdStatus,
} from "../../lib/api/ads";
import { uploadImage } from "../../lib/api/media";

interface AdsCreatorProps {
  userPhone: string;
  userName: string;
  userPhoto?: string;
  userBalance: number;
}

export function AdsCreator({
  userPhone,
  userName,
  userPhoto,
  userBalance,
}: AdsCreatorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("সাধারণ");
  const [dailyBudget, setDailyBudget] = useState("100");
  const [pricePerMille, setPricePerMille] = useState("10");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [ads, setAds] = useState<any[]>([]);
  const [adsLoaded, setAdsLoaded] = useState(false);

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

  const handleCreateAd = async () => {
    if (!title.trim()) {
      setError("বিজ্ঞাপনের শিরোনাম দিন");
      return;
    }

    if (!description.trim()) {
      setError("বিজ্ঞাপনের বিবরণ দিন");
      return;
    }

    if (!image) {
      setError("বিজ্ঞাপনের ছবি নির্বাচন করুন");
      return;
    }

    const budget = parseFloat(dailyBudget);
    if (isNaN(budget) || budget <= 0) {
      setError("সঠিক বাজেট দিন");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Process and upload image
      const imageBlob = await processImage(image);
      if (!imageBlob) {
        throw new Error("ছবি প্রক্রিয়া করতে ব্যর্থ");
      }

      const imageFile = new File([imageBlob], "ad-image.jpg", {
        type: "image/jpeg",
      });

      const uploadResponse = await uploadImage(imageFile);
      if (!uploadResponse.ok || !uploadResponse.file) {
        throw new Error(uploadResponse.error || "ছবি আপলোড ব্যর্থ");
      }

      const imageUrl = uploadResponse.file.id;

      // Create ad
      const adResponse = await createAd(
        userPhone,
        title,
        description,
        imageUrl,
        category,
        dailyBudget,
        pricePerMille,
      );

      if (!adResponse.ok) {
        throw new Error(adResponse.error || "বিজ্ঞাপন তৈরি ব্যর্থ");
      }

      setSuccessMessage("বিজ্ঞাপন সফলভাবে তৈরি হয়েছে! ✓");
      setTitle("");
      setDescription("");
      setCategory("সাধারণ");
      setDailyBudget("100");
      setPricePerMille("10");
      setImage(null);

      // Reload ads
      setTimeout(() => {
        loadAds();
        setShowCreateForm(false);
        setSuccessMessage("");
      }, 500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "বিজ্ঞাপন তৈরিতে ত্রুটি";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAds = async () => {
    const response = await getAdvertiserAds(userPhone);
    if (response.ok && response.ads) {
      setAds(response.ads);
      setAdsLoaded(true);
    }
  };

  const toggleAd = async (adId: string, currentStatus: string) => {
    const newStatus = currentStatus === "সক্রিয়" ? "নিষ্ক্রিয়" : "সক্রিয়";
    const response = await updateAdStatus(adId, newStatus);
    if (response.ok) {
      loadAds();
    }
  };

  if (!adsLoaded && ads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <button
            onClick={() => {
              loadAds();
              setShowCreateForm(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            নতুন বিজ্ঞাপন তৈরি করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Ad Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">নতুন বিজ্ঞাপন</h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setTitle("");
                  setDescription("");
                  setImage(null);
                  setError("");
                }}
                disabled={isLoading}
                className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  বিজ্ঞাপনের শিরোনাম
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: আমার পণ্য কিনুন"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  বিজ্ঞাপনের বিবরণ
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="আপনার বিজ্ঞাপনের বিবরণ লিখুন"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  বিজ্ঞাপনের ছবি
                </label>
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="preview"
                      className="w-full max-h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setImage(null)}
                      disabled={isLoading}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">ছবি নির্বাচন করুন</p>
                    </div>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    বিভাগ
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option value="সাধারণ">সাধারণ</option>
                    <option value="ই-কমার্স">ই-কমার্স</option>
                    <option value="সেবা">সেবা</option>
                    <option value="শিক্ষা">শিক্ষা</option>
                    <option value="বিনোদন">বিনোদন</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    দৈনিক বাজেট (টাকা)
                  </label>
                  <input
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(e.target.value)}
                    min="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  প্রতি ১০০০ ইম্প্রেশনের মূল্য (টাকা)
                </label>
                <input
                  type="number"
                  value={pricePerMille}
                  onChange={(e) => setPricePerMille(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">
                    {successMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setTitle("");
                  setDescription("");
                  setImage(null);
                  setError("");
                }}
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50"
              >
                বাতিল
              </button>
              <button
                onClick={handleCreateAd}
                disabled={!title || !description || !image || isLoading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    তৈরি করছি...
                  </>
                ) : (
                  "বিজ্ঞাপন তৈরি করুন"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ads List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">আমার বিজ্ঞাপনগুলি</h2>
          <button
            onClick={() => {
              setShowCreateForm(true);
              loadAds();
            }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            নতুন বিজ্ঞাপন
          </button>
        </div>

        {ads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">কোনো বিজ্ঞাপন নেই</p>
            <button
              onClick={() => {
                setShowCreateForm(true);
                loadAds();
              }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              প্রথম বিজ্ঞাপন তৈরি করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Ad Image */}
                {ad.image && (
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-40 object-cover"
                  />
                )}

                {/* Ad Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{ad.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {ad.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1 bg-blue-50 p-2 rounded">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">
                        {ad.impressions} দেখা
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 p-2 rounded">
                      <MousePointerClick className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{ad.clicks} ক্লিক</span>
                    </div>
                  </div>

                  {/* Category & Budget */}
                  <div className="text-xs text-gray-500 mb-3">
                    <p>বিভাগ: {ad.category}</p>
                    <p>বাজেট: ৳{ad.dailyBudget}/দিন</p>
                  </div>

                  {/* Status Toggle */}
                  <button
                    onClick={() => toggleAd(ad.id, ad.status)}
                    className={`w-full py-2 rounded font-semibold text-sm transition-colors ${
                      ad.status === "সক্রিয়"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {ad.status === "সক্রিয়" ? "সক্রিয় - বন্ধ করুন" : "নিষ্ক্রিয় - চালু করুন"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
