import { RequestHandler } from "express";
import {
  appendRow,
  findRows,
  getRows,
  updateRow,
  SHEET_NAMES,
  findRow,
  deleteRow,
} from "../services/sheets";
import crypto from "crypto";

// ============ POSTS ============

export const handleCreatePost: RequestHandler = async (req, res) => {
  try {
    const { userPhone, userName, userPhoto, content, image, mediaType } = req.body;

    if (!userPhone || !content) {
      return res.status(400).json({
        ok: false,
        error: "User phone and content are required",
      });
    }

    const postId = crypto.randomUUID();
    const now = new Date().toISOString();

    const postData = [
      postId,
      userPhone,
      userName || "",
      userPhoto || "",
      content,
      image || "",
      mediaType || "image",
      "0",
      "0",
      now,
      now,
    ];

    await appendRow(SHEET_NAMES.POSTS, postData);

    res.status(201).json({
      ok: true,
      post: {
        id: postId,
        userPhone,
        userName,
        userPhoto,
        content,
        image,
        mediaType: mediaType || "image",
        likesCount: 0,
        commentsCount: 0,
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetFeed: RequestHandler = async (req, res) => {
  try {
    const { userPhone } = req.query;

    const posts = await getRows(SHEET_NAMES.POSTS);
    const friendsData = userPhone
      ? await findRows(SHEET_NAMES.FRIENDS, "userPhone", userPhone as string)
      : [];

    const friendPhones = friendsData.map((f) => f.friendPhone);

    const feedPosts = posts
      .filter(
        (post) =>
          post.userPhone === userPhone || friendPhones.includes(post.userPhone),
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((post) => ({
        id: post.id,
        userPhone: post.userPhone,
        userName: post.userName,
        userPhoto: post.userPhoto,
        content: post.content,
        image: post.image,
        mediaType: post.mediaType || "image",
        likesCount: parseInt(post.likesCount || "0"),
        commentsCount: parseInt(post.commentsCount || "0"),
        createdAt: post.createdAt,
      }));

    res.json({
      ok: true,
      posts: feedPosts,
    });
  } catch (error) {
    console.error("Get feed error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetUserPosts: RequestHandler = async (req, res) => {
  try {
    const { userPhone } = req.params;

    const posts = await findRows(SHEET_NAMES.POSTS, "userPhone", userPhone);

    const sortedPosts = posts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((post) => ({
        id: post.id,
        userPhone: post.userPhone,
        userName: post.userName,
        userPhoto: post.userPhoto,
        content: post.content,
        image: post.image,
        mediaType: post.mediaType || "image",
        likesCount: parseInt(post.likesCount || "0"),
        commentsCount: parseInt(post.commentsCount || "0"),
        createdAt: post.createdAt,
      }));

    res.json({
      ok: true,
      posts: sortedPosts,
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleDeletePost: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.params;

    const posts = await getRows(SHEET_NAMES.POSTS);
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: "Post not found",
      });
    }

    await deleteRow(SHEET_NAMES.POSTS, postIndex);

    // Delete associated comments and likes
    const comments = await findRows(SHEET_NAMES.COMMENTS, "postId", postId);
    const likes = await findRows(SHEET_NAMES.LIKES, "postId", postId);

    for (const comment of comments) {
      const comments2 = await getRows(SHEET_NAMES.COMMENTS);
      const commentIndex = comments2.findIndex((c) => c.id === comment.id);
      if (commentIndex !== -1) {
        await deleteRow(SHEET_NAMES.COMMENTS, commentIndex);
      }
    }

    for (const like of likes) {
      const likes2 = await getRows(SHEET_NAMES.LIKES);
      const likeIndex = likes2.findIndex((l) => l.id === like.id);
      if (likeIndex !== -1) {
        await deleteRow(SHEET_NAMES.LIKES, likeIndex);
      }
    }

    res.json({
      ok: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

// ============ COMMENTS ============

export const handleAddComment: RequestHandler = async (req, res) => {
  try {
    const { postId, userPhone, userName, userPhoto, content } = req.body;

    if (!postId || !userPhone || !content) {
      return res.status(400).json({
        ok: false,
        error: "Post ID, user phone, and content are required",
      });
    }

    const commentId = crypto.randomUUID();
    const now = new Date().toISOString();

    const commentData = [
      commentId,
      postId,
      userPhone,
      userName || "",
      userPhoto || "",
      content,
      now,
    ];

    await appendRow(SHEET_NAMES.COMMENTS, commentData);

    // Update post comments count
    const posts = await getRows(SHEET_NAMES.POSTS);
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex !== -1) {
      const post = posts[postIndex];
      const newCommentsCount = (parseInt(post.commentsCount || "0") + 1).toString();

      const updatedPost = [
        post.id,
        post.userPhone,
        post.userName,
        post.userPhoto,
        post.content,
        post.image,
        post.likesCount,
        newCommentsCount,
        post.createdAt,
        new Date().toISOString(),
      ];

      await updateRow(SHEET_NAMES.POSTS, postIndex, updatedPost);
    }

    res.status(201).json({
      ok: true,
      comment: {
        id: commentId,
        postId,
        userPhone,
        userName,
        userPhoto,
        content,
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetPostComments: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await findRows(SHEET_NAMES.COMMENTS, "postId", postId);

    const sortedComments = comments
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((comment) => ({
        id: comment.id,
        postId: comment.postId,
        userPhone: comment.userPhone,
        userName: comment.userName,
        userPhoto: comment.userPhoto,
        content: comment.content,
        createdAt: comment.createdAt,
      }));

    res.json({
      ok: true,
      comments: sortedComments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleDeleteComment: RequestHandler = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comments = await getRows(SHEET_NAMES.COMMENTS);
    const commentIndex = comments.findIndex((c) => c.id === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: "Comment not found",
      });
    }

    const comment = comments[commentIndex];
    await deleteRow(SHEET_NAMES.COMMENTS, commentIndex);

    // Update post comments count
    const posts = await getRows(SHEET_NAMES.POSTS);
    const postIndex = posts.findIndex((p) => p.id === comment.postId);

    if (postIndex !== -1) {
      const post = posts[postIndex];
      const newCommentsCount = Math.max(0, parseInt(post.commentsCount || "0") - 1).toString();

      const updatedPost = [
        post.id,
        post.userPhone,
        post.userName,
        post.userPhoto,
        post.content,
        post.image,
        post.likesCount,
        newCommentsCount,
        post.createdAt,
        new Date().toISOString(),
      ];

      await updateRow(SHEET_NAMES.POSTS, postIndex, updatedPost);
    }

    res.json({
      ok: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

// ============ LIKES ============

export const handleToggleLike: RequestHandler = async (req, res) => {
  try {
    const { postId, userPhone, userName } = req.body;

    if (!postId || !userPhone) {
      return res.status(400).json({
        ok: false,
        error: "Post ID and user phone are required",
      });
    }

    const likes = await getRows(SHEET_NAMES.LIKES);
    const existingLike = likes.find(
      (l) => l.postId === postId && l.userPhone === userPhone,
    );

    if (existingLike) {
      // Unlike
      const likeIndex = likes.findIndex(
        (l) => l.postId === postId && l.userPhone === userPhone,
      );
      await deleteRow(SHEET_NAMES.LIKES, likeIndex);

      // Update post likes count
      const posts = await getRows(SHEET_NAMES.POSTS);
      const postIndex = posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        const post = posts[postIndex];
        const newLikesCount = Math.max(0, parseInt(post.likesCount || "0") - 1).toString();

        const updatedPost = [
          post.id,
          post.userPhone,
          post.userName,
          post.userPhoto,
          post.content,
          post.image,
          newLikesCount,
          post.commentsCount,
          post.createdAt,
          new Date().toISOString(),
        ];

        await updateRow(SHEET_NAMES.POSTS, postIndex, updatedPost);
      }

      res.json({
        ok: true,
        liked: false,
      });
    } else {
      // Like
      const likeId = crypto.randomUUID();
      const now = new Date().toISOString();

      const likeData = [likeId, postId, userPhone, userName || "", now];

      await appendRow(SHEET_NAMES.LIKES, likeData);

      // Update post likes count
      const posts = await getRows(SHEET_NAMES.POSTS);
      const postIndex = posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        const post = posts[postIndex];
        const newLikesCount = (parseInt(post.likesCount || "0") + 1).toString();

        const updatedPost = [
          post.id,
          post.userPhone,
          post.userName,
          post.userPhoto,
          post.content,
          post.image,
          newLikesCount,
          post.commentsCount,
          post.createdAt,
          new Date().toISOString(),
        ];

        await updateRow(SHEET_NAMES.POSTS, postIndex, updatedPost);
      }

      res.status(201).json({
        ok: true,
        liked: true,
      });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetPostLikes: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.params;

    const likes = await findRows(SHEET_NAMES.LIKES, "postId", postId);

    res.json({
      ok: true,
      likes: likes.map((like) => ({
        id: like.id,
        postId: like.postId,
        userPhone: like.userPhone,
        userName: like.userName,
        createdAt: like.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get likes error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

// ============ FRIENDS ============

export const handleSendFriendRequest: RequestHandler = async (req, res) => {
  try {
    const { fromPhone, toPhone } = req.body;

    if (!fromPhone || !toPhone) {
      return res.status(400).json({
        ok: false,
        error: "Both phone numbers are required",
      });
    }

    if (fromPhone === toPhone) {
      return res.status(400).json({
        ok: false,
        error: "Cannot send friend request to yourself",
      });
    }

    // Check if already friends
    const friends = await getRows(SHEET_NAMES.FRIENDS);
    const isFriend = friends.some(
      (f) =>
        (f.userPhone === fromPhone && f.friendPhone === toPhone) ||
        (f.userPhone === toPhone && f.friendPhone === fromPhone),
    );

    if (isFriend) {
      return res.status(400).json({
        ok: false,
        error: "Already friends",
      });
    }

    // Check if request already exists
    const requests = await getRows(SHEET_NAMES.FRIEND_REQUESTS);
    const existingRequest = requests.find(
      (r) =>
        r.fromPhone === fromPhone &&
        r.toPhone === toPhone &&
        r.status === "pending",
    );

    if (existingRequest) {
      return res.status(400).json({
        ok: false,
        error: "Friend request already sent",
      });
    }

    const requestId = crypto.randomUUID();
    const now = new Date().toISOString();

    const requestData = [requestId, fromPhone, toPhone, "pending", now];

    await appendRow(SHEET_NAMES.FRIEND_REQUESTS, requestData);

    res.status(201).json({
      ok: true,
      request: {
        id: requestId,
        fromPhone,
        toPhone,
        status: "pending",
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("Send friend request error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleAcceptFriendRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;

    const requests = await getRows(SHEET_NAMES.FRIEND_REQUESTS);
    const requestIndex = requests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: "Friend request not found",
      });
    }

    const request = requests[requestIndex];

    // Add friendship
    const friendshipId = crypto.randomUUID();
    const now = new Date().toISOString();

    const friendshipData = [
      friendshipId,
      request.fromPhone,
      request.toPhone,
      now,
    ];

    await appendRow(SHEET_NAMES.FRIENDS, friendshipData);

    // Update request status
    const updatedRequest = [
      request.id,
      request.fromPhone,
      request.toPhone,
      "accepted",
      request.createdAt,
    ];

    await updateRow(SHEET_NAMES.FRIEND_REQUESTS, requestIndex, updatedRequest);

    res.json({
      ok: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    console.error("Accept friend request error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleRejectFriendRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;

    const requests = await getRows(SHEET_NAMES.FRIEND_REQUESTS);
    const requestIndex = requests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: "Friend request not found",
      });
    }

    const request = requests[requestIndex];

    // Update request status
    const updatedRequest = [
      request.id,
      request.fromPhone,
      request.toPhone,
      "rejected",
      request.createdAt,
    ];

    await updateRow(SHEET_NAMES.FRIEND_REQUESTS, requestIndex, updatedRequest);

    res.json({
      ok: true,
      message: "Friend request rejected",
    });
  } catch (error) {
    console.error("Reject friend request error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetFriendRequests: RequestHandler = async (req, res) => {
  try {
    const { userPhone } = req.params;

    const requests = await findRows(
      SHEET_NAMES.FRIEND_REQUESTS,
      "toPhone",
      userPhone,
    );

    const pendingRequests = requests
      .filter((r) => r.status === "pending")
      .map((r) => ({
        id: r.id,
        fromPhone: r.fromPhone,
        toPhone: r.toPhone,
        status: r.status,
        createdAt: r.createdAt,
      }));

    res.json({
      ok: true,
      requests: pendingRequests,
    });
  } catch (error) {
    console.error("Get friend requests error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetFriends: RequestHandler = async (req, res) => {
  try {
    const { userPhone } = req.params;

    const friends = await getRows(SHEET_NAMES.FRIENDS);

    const userFriends = friends
      .filter(
        (f) =>
          f.userPhone === userPhone || f.friendPhone === userPhone,
      )
      .map((f) => ({
        id: f.id,
        friendPhone: f.userPhone === userPhone ? f.friendPhone : f.userPhone,
        createdAt: f.createdAt,
      }));

    res.json({
      ok: true,
      friends: userFriends,
    });
  } catch (error) {
    console.error("Get friends error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleRemoveFriend: RequestHandler = async (req, res) => {
  try {
    const { userPhone, friendPhone } = req.body;

    if (!userPhone || !friendPhone) {
      return res.status(400).json({
        ok: false,
        error: "Both phone numbers are required",
      });
    }

    const friends = await getRows(SHEET_NAMES.FRIENDS);
    const friendIndex = friends.findIndex(
      (f) =>
        (f.userPhone === userPhone && f.friendPhone === friendPhone) ||
        (f.userPhone === friendPhone && f.friendPhone === userPhone),
    );

    if (friendIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: "Friend not found",
      });
    }

    await deleteRow(SHEET_NAMES.FRIENDS, friendIndex);

    res.json({
      ok: true,
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error("Remove friend error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

// ============ STORIES ============

export const handleCreateStory: RequestHandler = async (req, res) => {
  try {
    const { userPhone, userName, userPhoto, image } = req.body;

    if (!userPhone || !image) {
      return res.status(400).json({
        ok: false,
        error: "User phone and image are required",
      });
    }

    const storyId = crypto.randomUUID();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const storyData = [
      storyId,
      userPhone,
      userName || "",
      userPhoto || "",
      image,
      expiresAt,
      now,
    ];

    await appendRow(SHEET_NAMES.STORIES, storyData);

    res.status(201).json({
      ok: true,
      story: {
        id: storyId,
        userPhone,
        userName,
        userPhoto,
        image,
        expiresAt,
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("Create story error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetStories: RequestHandler = async (req, res) => {
  try {
    const { userPhone } = req.query;

    const stories = await getRows(SHEET_NAMES.STORIES);
    const now = new Date().toISOString();

    // Filter non-expired stories
    const validStories = stories.filter((story) => {
      return new Date(story.expiresAt) > new Date(now);
    });

    let feedStories = validStories;

    // If userPhone provided, include user's friends' stories
    if (userPhone) {
      const friends = await findRows(
        SHEET_NAMES.FRIENDS,
        "userPhone",
        userPhone as string
      );
      const friendPhones = friends.map((f) => f.friendPhone);

      feedStories = validStories.filter(
        (story) =>
          story.userPhone === userPhone || friendPhones.includes(story.userPhone)
      );
    }

    const sortedStories = feedStories
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((story) => ({
        id: story.id,
        userPhone: story.userPhone,
        userName: story.userName,
        userPhoto: story.userPhoto,
        image: story.image,
        expiresAt: story.expiresAt,
        createdAt: story.createdAt,
      }));

    res.json({
      ok: true,
      stories: sortedStories,
    });
  } catch (error) {
    console.error("Get stories error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetUserStories: RequestHandler = async (req, res) => {
  try {
    const { userPhone } = req.params;

    const stories = await findRows(SHEET_NAMES.STORIES, "userPhone", userPhone);
    const now = new Date().toISOString();

    // Filter non-expired stories
    const validStories = stories.filter((story) => {
      return new Date(story.expiresAt) > new Date(now);
    });

    const sortedStories = validStories
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((story) => ({
        id: story.id,
        userPhone: story.userPhone,
        userName: story.userName,
        userPhoto: story.userPhoto,
        image: story.image,
        expiresAt: story.expiresAt,
        createdAt: story.createdAt,
      }));

    res.json({
      ok: true,
      stories: sortedStories,
    });
  } catch (error) {
    console.error("Get user stories error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleDeleteStory: RequestHandler = async (req, res) => {
  try {
    const { storyId } = req.params;

    const stories = await getRows(SHEET_NAMES.STORIES);
    const storyIndex = stories.findIndex((s) => s.id === storyId);

    if (storyIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: "Story not found",
      });
    }

    await deleteRow(SHEET_NAMES.STORIES, storyIndex);

    res.json({
      ok: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.error("Delete story error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

// ============ SEARCH ============

export const handleSearchUsers: RequestHandler = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserPhone = req.query.currentUserPhone as string;

    if (!q) {
      return res.status(400).json({
        ok: false,
        error: "Query parameter is required",
      });
    }

    const users = await getRows(SHEET_NAMES.USERS);
    const friends = currentUserPhone
      ? await findRows(SHEET_NAMES.FRIENDS, "userPhone", currentUserPhone)
      : [];

    const friendPhones = friends.map((f) => f.friendPhone);

    const searchResults = users
      .filter(
        (u) =>
          (u.name?.toLowerCase().includes((q as string).toLowerCase()) ||
            u.phone.includes(q as string)) &&
          u.phone !== currentUserPhone
      )
      .map((u) => ({
        phone: u.phone,
        name: u.name || u.phone,
        photo: u.photo || "",
        isFriend: friendPhones.includes(u.phone),
      }));

    res.json({
      ok: true,
      users: searchResults,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

// ============ MESSAGES ============

export const handleSendMessage: RequestHandler = async (req, res) => {
  try {
    const { fromPhone, toPhone, content } = req.body;

    if (!fromPhone || !toPhone || !content) {
      return res.status(400).json({
        ok: false,
        error: "All fields are required",
      });
    }

    const messageId = crypto.randomUUID();
    const now = new Date().toISOString();

    const messageData = [messageId, fromPhone, toPhone, content, "false", now];

    await appendRow(SHEET_NAMES.MESSAGES, messageData);

    res.status(201).json({
      ok: true,
      message: {
        id: messageId,
        fromPhone,
        toPhone,
        content,
        read: false,
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetConversation: RequestHandler = async (req, res) => {
  try {
    const { userPhone, otherUserPhone } = req.params;

    const messages = await getRows(SHEET_NAMES.MESSAGES);

    const conversation = messages
      .filter(
        (m) =>
          (m.fromPhone === userPhone && m.toPhone === otherUserPhone) ||
          (m.fromPhone === otherUserPhone && m.toPhone === userPhone)
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .map((m) => ({
        id: m.id,
        fromPhone: m.fromPhone,
        toPhone: m.toPhone,
        content: m.content,
        read: m.read === "true",
        createdAt: m.createdAt,
      }));

    res.json({
      ok: true,
      messages: conversation,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetConversations: RequestHandler = async (req, res) => {
  try {
    const { userPhone } = req.params;

    const messages = await getRows(SHEET_NAMES.MESSAGES);
    const users = await getRows(SHEET_NAMES.USERS);

    // Group messages by conversation
    const conversationMap = new Map<
      string,
      { messages: any[]; otherPhone: string }
    >();

    messages.forEach((msg) => {
      const otherPhone =
        msg.fromPhone === userPhone ? msg.toPhone : msg.fromPhone;
      const key = [userPhone, otherPhone].sort().join("-");

      if (!conversationMap.has(key)) {
        conversationMap.set(key, { messages: [], otherPhone });
      }

      conversationMap.get(key)!.messages.push(msg);
    });

    // Create conversation list
    const conversations = Array.from(conversationMap.values())
      .map((conv) => {
        const lastMsg = conv.messages[conv.messages.length - 1];
        const unread = conv.messages.filter(
          (m) => m.toPhone === userPhone && m.read === "false"
        ).length;

        // Find user info
        const otherUser = users.find((u) => u.phone === conv.otherPhone);

        return {
          userPhone: conv.otherPhone,
          userName: otherUser?.name || "",
          userPhoto: otherUser?.photo || "",
          lastMessage: lastMsg?.content || "",
          lastMessageTime: lastMsg?.createdAt || "",
          unreadCount: unread,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      );

    res.json({
      ok: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleMarkMessageAsRead: RequestHandler = async (req, res) => {
  try {
    const { messageId } = req.params;

    const messages = await getRows(SHEET_NAMES.MESSAGES);
    const messageIndex = messages.findIndex((m) => m.id === messageId);

    if (messageIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: "Message not found",
      });
    }

    const message = messages[messageIndex];
    const updatedMessage = [
      message.id,
      message.fromPhone,
      message.toPhone,
      message.content,
      "true",
      message.createdAt,
    ];

    await updateRow(SHEET_NAMES.MESSAGES, messageIndex, updatedMessage);

    res.json({
      ok: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Mark message as read error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};
