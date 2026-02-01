import { useState, useRef, useEffect } from "react";
import { Search, X, UserPlus, UserCheck } from "lucide-react";
import { searchUsers, SearchUser, sendFriendRequest } from "../../lib/api/social";

interface SearchUsersProps {
  currentUserPhone: string;
  onUserSelect?: (user: SearchUser) => void;
}

export function SearchUsers({ currentUserPhone, onUserSelect }: SearchUsersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showResults]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    try {
      const response = await searchUsers(query);
      if (response.ok && response.users) {
        setSearchResults(response.users);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (userPhone: string) => {
    try {
      const response = await sendFriendRequest(currentUserPhone, userPhone);
      if (response.ok) {
        // Update the search results to mark as friend request sent
        setSearchResults(
          searchResults.map((u) =>
            u.phone === userPhone ? { ...u, isFriend: true } : u
          )
        );
      }
    } catch (error) {
      console.error("Add friend error:", error);
    }
  };

  const handleUserClick = (user: SearchUser) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="অনুসন্ধান করুন..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full outline-none text-sm focus:bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* সার্চ ফলাফল */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              লোড হচ্ছে...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {searchResults.map((user) => (
                <div
                  key={user.phone}
                  className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <button
                    onClick={() => handleUserClick(user)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <img
                      src={
                        user.photo ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.phone}`
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </div>
                  </button>

                  {!user.isFriend && (
                    <button
                      onClick={() => handleAddFriend(user.phone)}
                      className="p-2 hover:bg-blue-50 rounded-full text-blue-600 flex-shrink-0"
                      title="বন্ধু যোগ করুন"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  )}
                  {user.isFriend && (
                    <div className="p-2 text-green-600 flex-shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              কোন ব্যবহারকারী পাওয়া যায়নি
            </div>
          )}
        </div>
      )}
    </div>
  );
}
