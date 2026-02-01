import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getStories, Story } from "../../lib/api/social";
import { CreateStory } from "./CreateStory";

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
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadStories();
  }, [currentUserPhone]);

  const loadStories = async () => {
    setIsLoading(true);
    const response = await getStories(currentUserPhone);
    if (response.ok && response.stories) {
      setStories(response.stories);
    }
    setIsLoading(false);
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("story-scroll");
    if (container) {
      const scrollAmount = 300;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;

      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  const handleStoryClick = (storyId: string) => {
    setViewedStories((prev) => new Set(prev).add(storyId));
  };

  const handleStoryCreated = async () => {
    await loadStories();
    if (onCreateStory) {
      onCreateStory();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
        <div className="animate-pulse flex gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-24 h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200 relative">
        {/* স্ক্রল বাটন */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={() => handleScroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* স্টোরি কন্টেইনার */}
        <div className="flex gap-2 overflow-x-hidden scroll-smooth" id="story-scroll">
          {/* নিজের স্টোরি বাটন */}
          <button
            onClick={() => setShowCreateStory(true)}
            className="flex-shrink-0 w-24 h-32 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 p-2 flex flex-col items-center justify-center hover:shadow-lg transition-shadow group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <span className="text-xl">+</span>
            </div>
            <p className="text-xs text-white text-center font-medium">
              স্টোরি যোগ করুন
            </p>
          </button>

          {/* অন্যদের স্টোরি */}
          {stories.length > 0 ? (
            stories.map((story) => (
              <button
                key={story.id}
                onClick={() => handleStoryClick(story.id)}
                className={`flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow relative ${
                  viewedStories.has(story.id) ? "opacity-70" : ""
                }`}
              >
                <img
                  src={story.image}
                  alt={story.userName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                {/* ব্যবহারকারীর তথ্য */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <img
                    src={story.userPhoto}
                    alt={story.userName}
                    className={`w-6 h-6 rounded-full mx-auto mb-1 border-2 ${
                      viewedStories.has(story.id)
                        ? "border-gray-400"
                        : "border-blue-400"
                    }`}
                  />
                  <p className="text-xs text-white text-center font-medium truncate">
                    {story.userName.substring(0, 8)}
                  </p>
                </div>

                {/* ভিউ স্ট্যাটাস */}
                {viewedStories.has(story.id) && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-gray-400 rounded-full"></div>
                )}
              </button>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>কোন স্টোরি নেই</p>
            </div>
          )}
        </div>
      </div>

      {/* স্টোরি তৈরি মডেল */}
      {showCreateStory && (
        <CreateStory
          userPhone={currentUserPhone}
          userName={currentUserName}
          userPhoto={currentUserPhoto}
          onClose={() => setShowCreateStory(false)}
          onStoryCreated={handleStoryCreated}
        />
      )}
    </>
  );
}
