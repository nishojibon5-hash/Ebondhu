// Social Media API Service

export interface Story {
  id: string;
  userPhone: string;
  userName: string;
  userPhoto?: string;
  image: string;
  expiresAt: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userPhone: string;
  userName: string;
  userPhoto?: string;
  content: string;
  image?: string;
  mediaType?: "image" | "video";
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userPhone: string;
  userName: string;
  userPhoto?: string;
  content: string;
  createdAt: string;
}

export interface Like {
  id: string;
  postId: string;
  userPhone: string;
  userName: string;
  createdAt: string;
}

export interface Friend {
  id: string;
  friendPhone: string;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  fromPhone: string;
  toPhone: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

// Posts API
export async function createPost(
  userPhone: string,
  userName: string,
  userPhoto: string | undefined,
  content: string,
  image?: string,
  mediaType?: "image" | "video",
): Promise<{ ok: boolean; post?: Post; error?: string }> {
  try {
    const response = await fetch("/api/social/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPhone,
        userName,
        userPhoto,
        content,
        image,
        mediaType: mediaType || "image",
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Create post error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getFeed(userPhone?: string): Promise<{
  ok: boolean;
  posts?: Post[];
  error?: string;
}> {
  try {
    const query = userPhone ? `?userPhone=${userPhone}` : "";
    const response = await fetch(`/api/social/feed${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get feed error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getUserPosts(userPhone: string): Promise<{
  ok: boolean;
  posts?: Post[];
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/posts/${userPhone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get user posts error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function deletePost(postId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/posts/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Delete post error:", error);
    return { ok: false, error: "Network error" };
  }
}

// Comments API
export async function addComment(
  postId: string,
  userPhone: string,
  userName: string,
  userPhoto: string | undefined,
  content: string,
): Promise<{ ok: boolean; comment?: Comment; error?: string }> {
  try {
    const response = await fetch("/api/social/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        userPhone,
        userName,
        userPhoto,
        content,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Add comment error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getPostComments(postId: string): Promise<{
  ok: boolean;
  comments?: Comment[];
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/comments/${postId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get comments error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function deleteComment(commentId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Delete comment error:", error);
    return { ok: false, error: "Network error" };
  }
}

// Likes API
export async function toggleLike(
  postId: string,
  userPhone: string,
  userName: string,
): Promise<{ ok: boolean; liked?: boolean; error?: string }> {
  try {
    const response = await fetch("/api/social/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        userPhone,
        userName,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Toggle like error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getPostLikes(postId: string): Promise<{
  ok: boolean;
  likes?: Like[];
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/likes/${postId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get likes error:", error);
    return { ok: false, error: "Network error" };
  }
}

// Friends API
export async function sendFriendRequest(
  fromPhone: string,
  toPhone: string,
): Promise<{ ok: boolean; request?: FriendRequest; error?: string }> {
  try {
    const response = await fetch("/api/social/friend-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromPhone,
        toPhone,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Send friend request error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function acceptFriendRequest(requestId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(
      `/api/social/friend-requests/${requestId}/accept`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Accept friend request error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function rejectFriendRequest(requestId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(
      `/api/social/friend-requests/${requestId}/reject`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Reject friend request error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getFriendRequests(userPhone: string): Promise<{
  ok: boolean;
  requests?: FriendRequest[];
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/friend-requests/${userPhone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get friend requests error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getFriends(userPhone: string): Promise<{
  ok: boolean;
  friends?: Friend[];
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/friends/${userPhone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get friends error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function removeFriend(
  userPhone: string,
  friendPhone: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/social/friends/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPhone,
        friendPhone,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Remove friend error:", error);
    return { ok: false, error: "Network error" };
  }
}

// Search API
export interface SearchUser {
  phone: string;
  name: string;
  photo?: string;
  isFriend?: boolean;
}

export async function searchUsers(query: string): Promise<{
  ok: boolean;
  users?: SearchUser[];
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/search-users?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Search users error:", error);
    return { ok: false, error: "Network error" };
  }
}

// Messages API
export interface Message {
  id: string;
  fromPhone: string;
  toPhone: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  userPhone: string;
  userName?: string;
  userPhoto?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export async function sendMessage(
  fromPhone: string,
  toPhone: string,
  content: string
): Promise<{ ok: boolean; message?: Message; error?: string }> {
  try {
    const response = await fetch("/api/social/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromPhone,
        toPhone,
        content,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Send message error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getConversation(
  userPhone: string,
  otherUserPhone: string
): Promise<{ ok: boolean; messages?: Message[]; error?: string }> {
  try {
    const response = await fetch(
      `/api/social/messages/${userPhone}/${otherUserPhone}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Get conversation error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getConversations(userPhone: string): Promise<{
  ok: boolean;
  conversations?: Conversation[];
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/conversations/${userPhone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get conversations error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function markMessageAsRead(messageId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/messages/${messageId}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Mark message as read error:", error);
    return { ok: false, error: "Network error" };
  }
}

// Stories API
export async function createStory(
  userPhone: string,
  userName: string,
  userPhoto: string | undefined,
  image: string,
): Promise<{ ok: boolean; story?: Story; error?: string }> {
  try {
    const response = await fetch("/api/social/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPhone,
        userName,
        userPhoto,
        image,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Create story error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getStories(userPhone?: string): Promise<{
  ok: boolean;
  stories?: Story[];
  error?: string;
}> {
  try {
    const query = userPhone ? `?userPhone=${userPhone}` : "";
    const response = await fetch(`/api/social/stories${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get stories error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getUserStories(userPhone: string): Promise<{
  ok: boolean;
  stories?: Story[];
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/stories/${userPhone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get user stories error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function deleteStory(storyId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/social/stories/${storyId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Delete story error:", error);
    return { ok: false, error: "Network error" };
  }
}
