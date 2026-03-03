import { useState, useEffect } from "react";
import { Eye, MousePointerClick } from "lucide-react";
import { logAdImpression, logAdClick } from "../../lib/api/ads";

interface FeedAdProps {
  ad: {
    id: string;
    title: string;
    description: string;
    image: string;
    category?: string;
    pricePerMille?: string;
  };
  userPhone: string;
}

export function FeedAd({ ad, userPhone }: FeedAdProps) {
  const [hasLogged, setHasLogged] = useState(false);

  // Log impression when ad becomes visible
  useEffect(() => {
    if (!hasLogged) {
      // Use Intersection Observer to track visibility
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Ad is visible
              logAdImpression(ad.id, userPhone).catch((error) => {
                console.error("Failed to log ad impression:", error);
              });
              setHasLogged(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }, // Ad needs to be 50% visible
      );

      const element = document.getElementById(`ad-${ad.id}`);
      if (element) {
        observer.observe(element);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [ad.id, userPhone, hasLogged]);

  const handleAdClick = async () => {
    try {
      await logAdClick(ad.id, userPhone);
    } catch (error) {
      console.error("Failed to log ad click:", error);
    }
  };

  return (
    <div
      id={`ad-${ad.id}`}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 overflow-hidden mb-4 hover:shadow-md transition-shadow"
    >
      {/* Ad Badge */}
      <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">
        বিজ্ঞাপন 📢
      </div>

      {/* Ad Content */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Ad Image */}
          {ad.image && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleAdClick();
              }}
              className="flex-shrink-0"
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
              />
            </a>
          )}

          {/* Ad Details */}
          <div className="flex-1 min-w-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleAdClick();
              }}
              className="block hover:text-blue-600 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1 truncate">
                {ad.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {ad.description}
              </p>
            </a>

            {/* Category & Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {ad.category && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {ad.category}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                বিজ্ঞাপন দেখুন
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAdClick}
          className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-md transition-shadow flex items-center justify-center gap-2"
        >
          <MousePointerClick className="w-4 h-4" />
          বিজ্ঞাপন দেখুন
        </button>
      </div>
    </div>
  );
}
