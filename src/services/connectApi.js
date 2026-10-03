import API from "../api";

export const searchUsers = async (search = "", currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.get("/connect/users", {
    params: {
      search
    },
    headers
  });
  return response.data;
};

export const getConversations = async (currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.get("/connect/conversations", { headers });
  return response.data;
};

export const createConversation = async (userId, currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.post(`/connect/conversation/${userId}`, {}, { headers });
  return response.data;
};

export const getMessages = async (conversationId, currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.get(`/connect/messages/${conversationId}`, { headers });
  return response.data;
};

export const sendMessage = async (conversationId, receiverId, content, currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.post("/connect/messages", {
    conversationId,
    receiverId,
    content,
    senderId: currentUserId
  }, { headers });
  return response.data;
};

export const editMessage = async (messageId, content, currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.put(`/connect/messages/${messageId}`, {
    content
  }, { headers });
  return response.data;
};

export const deleteMessage = async (messageId, currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.delete(`/connect/messages/${messageId}`, { headers });
  return response.data;
};

export const markMessageRead = async (messageId) => {
  const response = await API.put(`/connect/messages/${messageId}/read`);
  return response.data;
};

export const searchMessages = async (conversationId, keyword) => {
  const response = await API.get(`/connect/messages/${conversationId}/search`, {
    params: {
      keyword
    }
  });
  return response.data;
};

export const clearChat = async (conversationId, currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.delete(`/connect/messages/clear/${conversationId}`, { headers });
  return response.data;
};

export const deleteConversation = async (conversationId, currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.delete(`/connect/conversations/${conversationId}`, { headers });
  return response.data;
};

export const logCall = async ({ conversationId, receiverId, callType, callStatus, duration, content }, currentUserId) => {
  const headers = currentUserId ? { userId: currentUserId } : {};
  const response = await API.post(
    "/connect/messages/call-log",
    {
      conversationId,
      receiverId,
      senderId: currentUserId,
      messageType: "CALL_LOG",
      callType,
      callStatus,
      callDuration: duration,
      content
    },
    { headers }
  );
  return response.data;
};