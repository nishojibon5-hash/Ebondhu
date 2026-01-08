import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface Story {
  id: number;
  userName: string;
  userPhone: string;
  userImage: string;
  storyImage: string;
  timestamp: string;
  viewed: boolean;
}

interface StorySectionProps {
  currentUserPhone: string;
  currentUserName: string;
  currentUserPhoto?: string;
  onCreateStory?: () => void;
}

export function StorySection({
  currentUserPhone,
  currentUserName,
  currentUserPhoto,
  onCreateStory,
}: StorySectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  // ডেমো স্টোরি ডেটা
  const stories: Story[] = [
    {
      id: 1,
      userName: "আপনার গল্প",
      userPhone: currentUserPhone,
      userImage:
        currentUserPhoto ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserPhone}`,
      storyImage: "https://images.unsplash.com/photo-1611532736000-d3179f11fbe4?w=400&h=600&fit=crop",
      timestamp: "এখন",
      viewed: true,
    },
    {
      id: 2,
      userName: "মোঃ করিম",
      userPhone: "01711123456",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=karim",
      storyImage: "https://images.unsplash.com/photo-1518262941223-68d6b6f1376e?w=400&h=600&fit=crop",
      timestamp: "৩০ মিনিট আগে",
      viewed: false,
    },
    {
      id: 3,
      userName: "ফাতেমা বেগম",
      userPhone: "01812234567",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatema",
      storyImage: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=600&fit=crop",
      timestamp: "১ ঘণ্টা আগে",
      viewed: true,
    },
    {
      id: 4,
      userName: "আহমেদ হোসেন",
      userPhone: "01913345678",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
      storyImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
      timestamp: "২ ঘণ্টা আগে",
      viewed: false,
    },
    {
      id: 5,
      userName: "রিনা খান",
      userPhone: "01614456789",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=rina",
      storyImage: "https://images.unsplash.com/photo-1502930917128-1aa500764cbd?w=400&h=600&fit=crop",
      timestamp: "৩ ঘণ্টা আগে",
      viewed: true,
    },
    {
      id: 6,
      userName: "সাকিব আল হাসান",
      userPhone: "01715567890",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=sakib",
      storyImage: "https://images.unsplash.com/photo-1514306688772-aad680eaf2e9?w=400&h=600&fit=crop",
      timestamp: "৫ ঘণ্টা আগে",
      viewed: false,
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("story-scroll");
    if (container) {
      const scrollAmount = 200;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;
      container.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-full flex items-center gap-2">
          {/* নিজের স্টোরি তৈরির বাটন */}
          <div
            onClick={onCreateStory}
            className="flex-shrink-0 w-24 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg cursor-pointer hover:shadow-lg transition-all flex flex-col items-center justify-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 text-center">
              <img
                src={
                  currentUserPhoto ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserPhone}`
                }
                alt="আপনার প্রোফাইল"
                className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-white"
              />
              <div className="w-6 h-6 rounded-full bg-bkash-500 border-2 border-white flex items-center justify-center mx-auto mb-1">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">গল্প তৈরি করুন</span>
            </div>
          </div>

          {/* স্টোরি স্ক্রোল করার জায়গা */}
          <div className="relative flex-1 overflow-hidden">
            <div
              id="story-scroll"
              className="flex gap-2 overflow-x-hidden scroll-smooth"
            >
              {stories.slice(1).map((story) => (
                <div
                  key={story.id}
                  className={`flex-shrink-0 w-24 h-40 rounded-lg cursor-pointer hover:shadow-lg transition-all relative overflow-hidden group ${
                    story.viewed ? "opacity-70" : ""
                  }`}
                >
                  <img
                    src={story.storyImage}
                    alt={story.userName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>

                  {/* প্রোফাইল ছবি এবং নাম */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <img
                      src={story.userImage}
                      alt={story.userName}
                      className={`w-6 h-6 rounded-full mx-auto mb-1 border-2 ${
                        story.viewed ? "border-gray-400" : "border-bkash-500"
                      }`}
                    />
                    <p className="text-xs text-white text-center font-medium truncate">
                      {story.userName.substring(0, 8)}
                    </p>
                  </div>

                  {/* ভিউ স্ট্যাটাস */}
                  {story.viewed && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* স্ক্রোল বাটন */}
            {scrollPosition > 0 && (
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
