import { useState } from "react";
import { Users, UserPlus, MessageCircle, MoreHorizontal, Bookmark, Settings, HelpCircle } from "lucide-react";

interface SuggestedUser {
  id: number;
  name: string;
  phone: string;
  photo: string;
  mutualFriends: number;
}

interface SidebarProps {
  currentUserPhone: string;
}

export function Sidebar({ currentUserPhone }: SidebarProps) {
  const [suggestedUsers] = useState<SuggestedUser[]>([
    {
      id: 1,
      name: "নাজমা খাতুন",
      phone: "01916678901",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=nazma",
      mutualFriends: 12,
    },
    {
      id: 2,
      name: "করিম বিশ্বাস",
      phone: "01617789012",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=karim2",
      mutualFriends: 8,
    },
    {
      id: 3,
      name: "শাকিলা আক্তার",
      phone: "01718890123",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=shakila",
      mutualFriends: 15,
    },
    {
      id: 4,
      name: "রহিম মেম্বার",
      phone: "01819901234",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahim",
      mutualFriends: 5,
    },
  ]);

  const [addedFriends, setAddedFriends] = useState<number[]>([]);

  const handleAddFriend = (id: number) => {
    setAddedFriends([...addedFriends, id]);
  };

  return (
    <div className="w-72 space-y-4 hidden xl:block">
      {/* বিজ্ঞাপন বিভাগ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">স্পন্সর করা</h3>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2].map((ad) => (
            <div key={ad} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <img
                src={`https://images.unsplash.com/photo-${ad === 1 ? "1611532736000-d3179f11fbe4" : "1514306688772-aad680eaf2e9"}?w=300&h=200&fit=crop`}
                alt="বিজ্ঞাপন"
                className="w-full h-32 object-cover"
              />
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-900">আমার ক্যাশ অ্যাপ</p>
                <p className="text-xs text-gray-500">এখনই নিবন্ধন করুন</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* পরিচিত জনদের সাথে সংযোগ করুন */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-bkash-500" />
            <h3 className="font-bold text-gray-900">মানুষ আপনাকে চেনেন</h3>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <img
                src={user.photo}
                alt={user.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500">{user.mutualFriends} সাধারণ বন্ধু</p>
              </div>
              {addedFriends.includes(user.id) ? (
                <button className="text-xs font-semibold text-bkash-600 bg-bkash-50 px-3 py-1 rounded-full hover:bg-bkash-100 transition-colors">
                  যোগ করা হয়েছে
                </button>
              ) : (
                <button
                  onClick={() => handleAddFriend(user.id)}
                  className="text-xs font-semibold text-white bg-bkash-500 px-3 py-1 rounded-full hover:bg-bkash-600 transition-colors flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  যোগ করুন
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* গুরুত্বপূর্ণ লিঙ্ক */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 space-y-2">
          <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 text-sm text-gray-700">
            <Bookmark className="w-4 h-4 text-gray-500" />
            সংরক্ষিত
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 text-sm text-gray-700">
            <Users className="w-4 h-4 text-gray-500" />
            গ্রুপস
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 text-sm text-gray-700">
            <MessageCircle className="w-4 h-4 text-gray-500" />
            মেসেঞ্জার
          </button>
        </div>
      </div>

      {/* সেটিংস এবং সহায়তা */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 space-y-2">
          <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 text-sm text-gray-700">
            <Settings className="w-4 h-4 text-gray-500" />
            সেটিংস এবং গোপনীয়তা
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 text-sm text-gray-700">
            <HelpCircle className="w-4 h-4 text-gray-500" />
            সাহায্য এবং সহায়তা
          </button>
        </div>
      </div>

      {/* ফুটার টেক্সট */}
      <div className="px-2 py-4 text-xs text-gray-500 space-y-1">
        <p className="text-center">গোপনীয়তা · শর্তাবলী · বিজ্ঞাপন</p>
        <p className="text-center">© ২০২৬ amarcash</p>
      </div>
    </div>
  );
}
