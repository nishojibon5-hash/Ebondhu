import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Search,
  Phone,
  Info,
  MoreVertical,
} from "lucide-react";
import {
  getConversations,
  getConversation,
  sendMessage,
  Conversation,
  Message,
} from "../lib/api/social";

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userPhone = localStorage.getItem("userPhone") || "";
  const userName = localStorage.getItem("userName") || "ব্যবহারকারী";
  const userPhoto = localStorage.getItem("userPhoto");

  useEffect(() => {
    loadConversations();
  }, [userPhone]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    setIsLoading(true);
    const response = await getConversations(userPhone);
    if (response.ok && response.conversations) {
      setConversations(response.conversations);
    }
    setIsLoading(false);
  };

  const loadMessages = async (conversation: Conversation) => {
    const response = await getConversation(userPhone, conversation.userPhone);
    if (response.ok && response.messages) {
      setMessages(response.messages);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const response = await sendMessage(
      userPhone,
      selectedConversation.userPhone,
      messageInput,
    );
    if (response.ok && response.message) {
      setMessages([...messages, response.message]);
      setMessageInput("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      (conv.userName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) || conv.userPhone.includes(searchQuery),
  );

  const getTimeFormat = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "এখন";
      if (diffMins < 60) return `${diffMins}m`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;

      return date.toLocaleDateString("bn-BD");
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* মোবাইল হেডার */}
        <div className="lg:hidden flex items-center gap-2 mb-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">মেসেঞ্জার</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          {/* কথোপকথন তালিকা */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {/* হেডার */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                মেসেঞ্জার
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="অনুসন্ধান করুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* কথোপকথন লিস্ট */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  লোড হচ্ছে...
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.userPhone}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation?.userPhone === conversation.userPhone
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={
                          conversation.userPhoto ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.userPhone}`
                        }
                        alt={conversation.userName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">
                            {conversation.userName}
                          </p>
                          <p className="text-xs text-gray-500 flex-shrink-0">
                            {getTimeFormat(conversation.lastMessageTime)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="mt-1">
                            <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  কোন কথোপকথন নেই
                </div>
              )}
            </div>
          </div>

          {/* চ্যাট উইন্ডো */}
          {selectedConversation ? (
            <div className="hidden lg:flex lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex-col">
              {/* চ্যাট হেডার */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      selectedConversation.userPhoto ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.userPhone}`
                    }
                    alt={selectedConversation.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {selectedConversation.userName}
                    </h3>
                    <p className="text-xs text-gray-500">অনলাইনে</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Info className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* মেসেজ এরিয়া */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.fromPhone === userPhone
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.fromPhone === userPhone
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.fromPhone === userPhone
                              ? "text-blue-100"
                              : "text-gray-600"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString(
                            "bn-BD",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    কোন মেসেজ নেই। কথোপকথন শুরু করুন।
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ইনপুট এরিয়া */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="মেসেজ লিখুন..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg font-semibold mb-2">
                  কোন কথোপকথন নির্বাচিত
                </p>
                <p>বার্তা শুরু করতে একটি কথোপকথন বেছে নিন</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
