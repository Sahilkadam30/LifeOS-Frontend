import React, {
  useEffect,
  useState,
  useRef,
  useMemo
} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  searchUsers,
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  clearChat,
  deleteConversation,
  logCall,
  markMessageRead
} from "../../services/connectApi";
import {
  connectSocket,
  disconnectSocket
} from "../../services/socket";
import VideoCallModal from "./VideoCallModal";
import {
  Send,
  Search,
  ArrowLeft,
  MessageSquare,
  Users,
  Check,
  CheckCheck,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Sparkles,
  User as UserIcon,
  RefreshCw,
  Phone,
  Video,
  PhoneCall,
  PhoneMissed,
  PhoneOff,
  VideoOff,
  Eraser,
  AlertTriangle,
  Calendar
} from "lucide-react";

const Connect = () => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const userId = authUser?.id
    ? Number(authUser.id)
    : (sessionStorage.getItem("userId")
        ? Number(sessionStorage.getItem("userId"))
        : Number(localStorage.getItem("userId")));

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("chats"); // "chats" | "people"

  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);

  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);

  // ── Modals & Action Menus ───────────────────────────────────────────────
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [convToDelete, setConvToDelete] = useState(null);
  const [sidebarMenuOpenId, setSidebarMenuOpenId] = useState(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Calling state ───────────────────────────────────────────────────────
  const [callModal, setCallModal] = useState(null);
  // { mode: "outgoing"|"incoming", callType: "video"|"audio", remoteUser, signal }
  const [activeCallSignal, setActiveCallSignal] = useState(null);
  // Latest forwarded signal for the active call modal

  // ── Highlighted new incoming messages & conversations ────────────────────
  const [highlightedMessageIds, setHighlightedMessageIds] = useState(new Set());
  const [newIncomingConvIds, setNewIncomingConvIds] = useState(() => {
    try {
      const uId = authUser?.id
        ? Number(authUser.id)
        : (sessionStorage.getItem("userId")
            ? Number(sessionStorage.getItem("userId"))
            : Number(localStorage.getItem("userId")));
      const saved = localStorage.getItem(`lifeos_unread_convs_${uId}`);
      return saved ? new Set(JSON.parse(saved).map(Number)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [unreadCounts, setUnreadCounts] = useState({});
  const [incomingNotificationToast, setIncomingNotificationToast] = useState(null);

  // Sync unread conversations to localStorage
  useEffect(() => {
    if (userId) {
      try {
        localStorage.setItem(
          `lifeos_unread_convs_${userId}`,
          JSON.stringify(Array.from(newIncomingConvIds))
        );
      } catch (e) {
        console.error("Failed to save unread convs:", e);
      }
    }
  }, [newIncomingConvIds, userId]);

  // Load from localStorage whenever userId becomes available
  useEffect(() => {
    if (userId) {
      try {
        const saved = localStorage.getItem(`lifeos_unread_convs_${userId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNewIncomingConvIds((prev) => new Set([...prev, ...parsed.map(Number)]));
          }
        }
      } catch (e) {
        console.error("Failed to load unread convs:", e);
      }
    }
  }, [userId]);

  const activeConversationRef = useRef(activeConversation);
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  const conversationsRef = useRef(conversations);
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Auto-dismiss incoming notification toast after 6 seconds
  useEffect(() => {
    if (!incomingNotificationToast) return;
    const timer = setTimeout(() => {
      setIncomingNotificationToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [incomingNotificationToast]);

  const messagesEndRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close popup menus on outside click
  useEffect(() => {
    const handleDocClick = () => {
      setSidebarMenuOpenId(null);
      setHeaderMenuOpen(false);
      setActiveMenuId(null);
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  // Initial load & WebSocket setup
  useEffect(() => {
    if (userId) {
      loadConversations(userId);
      connectSocket(userId, handleIncomingMessage);
    }

    return () => {
      disconnectSocket();
    };
  }, [userId]);

  // Handle incoming WebSocket messages (chat + WebRTC signals + clear/delete)
  const handleIncomingMessage = (incoming) => {
    if (!incoming) return;

    // ── Handle Clear Chat Real-Time Event ─────────────────────────────
    if (incoming.type === "CHAT_CLEARED") {
      setActiveConversation((currentActive) => {
        if (currentActive && Number(currentActive.id) === Number(incoming.conversationId)) {
          setMessages([]);
        }
        return currentActive;
      });
      setConversations((prev) =>
        prev.map((c) =>
          Number(c.id) === Number(incoming.conversationId)
            ? { ...c, lastMessage: "" }
            : c
        )
      );
      return;
    }

    // ── Handle Conversation Deleted Real-Time Event ───────────────────
    if (incoming.type === "CONVERSATION_DELETED") {
      setConversations((prev) =>
        prev.filter((c) => Number(c.id) !== Number(incoming.conversationId))
      );
      setActiveConversation((currentActive) => {
        if (currentActive && Number(currentActive.id) === Number(incoming.conversationId)) {
          setSelectedUser(null);
          setMessages([]);
          return null;
        }
        return currentActive;
      });
      return;
    }

    // ── WebRTC signaling ──────────────────────────────────────────────
    const callSignalTypes = ["CALL_OFFER", "CALL_ANSWER", "CALL_REJECT", "ICE_CANDIDATE", "CALL_END"];
    if (incoming.type && callSignalTypes.includes(incoming.type)) {
      if (incoming.type === "CALL_OFFER") {
        // Show incoming call UI — find the caller from conversations
        const caller = {
          id: incoming.senderId,
          firstName: incoming.senderName?.split(" ")[0] || "User",
          lastName: incoming.senderName?.split(" ").slice(1).join(" ") || "",
          username: incoming.senderName || "user"
        };
        setCallModal({
          mode: "incoming",
          callType: incoming.callType || "video",
          remoteUser: caller,
          signal: incoming
        });
        setActiveCallSignal(incoming);
      } else {
        // Forward signal to the active call modal
        setActiveCallSignal(incoming);
      }
      return;
    }

    // ── Chat message ──────────────────────────────────────────────────
    const isFromOther = Number(incoming.senderId) !== Number(userId);

    if (isFromOther) {
      playNotificationSound();
      const msgId = Number(incoming.id);
      const convId = incoming.conversationId ? Number(incoming.conversationId) : null;
      const senderId = incoming.senderId ? Number(incoming.senderId) : null;

      setHighlightedMessageIds((prev) => new Set([...prev, msgId]));

      // Check if current active chat is already this conversation and user is focused
      const isCurrentActive =
        activeConversationRef.current &&
        !document.hidden &&
        ((convId && Number(activeConversationRef.current.id) === convId) ||
          (senderId && Number(activeConversationRef.current.userId) === senderId));

      if (!isCurrentActive) {
        // Highlight this chat in the sidebar and track unread count
        setNewIncomingConvIds((prev) => {
          const next = new Set(prev);
          if (convId) next.add(convId);
          if (senderId) next.add(senderId);
          return next;
        });

        if (convId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [convId]: (prev[convId] || 0) + 1
          }));
        }

        const senderConv = conversationsRef.current.find(
          (c) => (convId && Number(c.id) === convId) || (senderId && Number(c.userId) === senderId)
        );
        const senderDisplayName = senderConv
          ? `${senderConv.firstName} ${senderConv.lastName || ""}`.trim()
          : incoming.senderName || "New message";

        setIncomingNotificationToast({
          id: msgId,
          convId,
          senderId,
          senderName: senderDisplayName,
          content: incoming.content || "Sent you a message",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      }

      // Auto-clear message bubble highlight after 15 seconds
      setTimeout(() => {
        setHighlightedMessageIds((prev) => {
          const next = new Set(prev);
          next.delete(msgId);
          return next;
        });
      }, 15000);
    }

    setActiveConversation((currentActive) => {
      if (
        currentActive &&
        (Number(incoming.conversationId) === Number(currentActive.id) ||
          Number(incoming.senderId) === Number(currentActive.userId) ||
          Number(incoming.receiverId) === Number(currentActive.userId))
      ) {
        setMessages((prev) => {
          if (prev.some((m) => Number(m.id) === Number(incoming.id))) {
            return prev.map((m) => (Number(m.id) === Number(incoming.id) ? incoming : m));
          }
          return [...prev, incoming];
        });
      }
      return currentActive;
    });

    loadConversations(userId);
  };

  // ── Start outgoing call ─────────────────────────────────────────────
  const startCall = (type) => {
    if (!selectedUser) return;
    setCallModal({
      mode: "outgoing",
      callType: type,
      remoteUser: selectedUser,
      signal: null
    });
    setActiveCallSignal(null);
  };

  const closeCallModal = () => {
    setCallModal(null);
    setActiveCallSignal(null);
  };

  // ── Handle Call Log Creation When Call Ends ────────────────────────
  const handleCallEnded = async (callData) => {
    if (!callData) return;
    const convId = callData.conversationId || activeConversation?.id;
    const otherId = callData.receiverId || selectedUser?.id;
    if (!convId || !otherId) return;

    // Only the caller logs the call to prevent duplicates
    if (!callData.isCaller) return;

    try {
      const savedLog = await logCall(
        {
          conversationId: convId,
          receiverId: otherId,
          callType: callData.callType,
          callStatus: callData.callStatus,
          duration: callData.duration || 0,
        },
        userId
      );

      setActiveConversation((currentActive) => {
        if (currentActive && Number(currentActive.id) === Number(convId)) {
          setMessages((prev) => {
            if (prev.some((m) => Number(m.id) === Number(savedLog.id))) {
              return prev;
            }
            return [...prev, savedLog];
          });
        }
        return currentActive;
      });

      loadConversations(userId);
    } catch (error) {
      console.error("Failed to log call:", error);
    }
  };

  // ── Clear Chat in Current Conversation ──────────────────────────────
  const handleClearChat = async () => {
    if (!activeConversation) return;
    try {
      setActionLoading(true);
      await clearChat(activeConversation.id, userId);
      setMessages([]);
      setConversations((prev) =>
        prev.map((c) =>
          Number(c.id) === Number(activeConversation.id)
            ? { ...c, lastMessage: "" }
            : c
        )
      );
      setShowClearModal(false);
      setHeaderMenuOpen(false);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Delete Conversation (Sidebar or Active Chat) ────────────────────
  const confirmDeleteConversation = async () => {
    const targetConv = convToDelete || activeConversation;
    if (!targetConv) return;
    try {
      setActionLoading(true);
      await deleteConversation(targetConv.id, userId);
      setConversations((prev) =>
        prev.filter((c) => Number(c.id) !== Number(targetConv.id))
      );
      if (activeConversation && Number(activeConversation.id) === Number(targetConv.id)) {
        setActiveConversation(null);
        setSelectedUser(null);
        setMessages([]);
      }
      setShowDeleteModal(false);
      setConvToDelete(null);
      setHeaderMenuOpen(false);
      setSidebarMenuOpenId(null);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Format call duration helper
  const formatDuration = (sec) => {
    if (!sec || sec <= 0) return "0s";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s > 0 ? `${s}s` : ""}`.trim();
  };

  // Load all user conversations
  const loadConversations = async (overrideUserId) => {
    const currentId = overrideUserId || userId;
    if (!currentId) return;
    try {
      setLoadingChats(true);
      const data = await getConversations(currentId);
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoadingChats(false);
    }
  };

  // Load messages for a given conversation
  const loadMessagesForConversation = async (conversationId, overrideUserId) => {
    const currentId = overrideUserId || userId;
    try {
      setLoadingMessages(true);
      const data = await getMessages(conversationId, currentId);
      const msgList = Array.isArray(data) ? data : [];
      setMessages(msgList);

      // Highlight unread incoming messages from the other user
      const unreadFromOther = msgList
        .filter((m) => Number(m.senderId) !== Number(currentId) && m.status !== "READ")
        .map((m) => Number(m.id));

      if (unreadFromOther.length > 0) {
        setHighlightedMessageIds((prev) => new Set([...prev, ...unreadFromOther]));
        unreadFromOther.forEach((id) => {
          markMessageRead(id).catch(() => {});
        });
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Open existing conversation
  const openConversation = (conv) => {
    setActiveConversation(conv);
    setSelectedUser({
      id: conv.userId,
      username: conv.username,
      firstName: conv.firstName,
      lastName: conv.lastName
    });
    setEditingMessage(null);
    setEditText("");
    // Clear highlight and unread count for this conversation
    setNewIncomingConvIds((prev) => {
      const next = new Set(prev);
      if (conv.id) next.delete(Number(conv.id));
      if (conv.userId) next.delete(Number(conv.userId));
      return next;
    });
    setUnreadCounts((prev) => {
      const next = { ...prev };
      if (conv.id) delete next[Number(conv.id)];
      if (conv.userId) delete next[Number(conv.userId)];
      return next;
    });
    setIncomingNotificationToast((prev) => {
      if (
        prev &&
        ((conv.id && Number(prev.convId) === Number(conv.id)) ||
          (conv.userId && Number(prev.senderId) === Number(conv.userId)))
      ) {
        return null;
      }
      return prev;
    });
    loadMessagesForConversation(conv.id, userId);
  };

  // Search users
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setUsers([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchUsers(value.trim(), userId);
        setUsers(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error("Failed to search users:", error);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  // Start chat with a user (from search / people list)
  const openChatWithUser = async (user) => {
    try {
      setLoadingMessages(true);
      const conv = await createConversation(user.id, userId);
      
      const convObj = {
        id: conv.id,
        userId: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        lastMessage: conv.lastMessage || "",
        lastMessageTime: conv.lastMessageTime || null
      };

      setActiveConversation(convObj);
      setSelectedUser(user);
      setActiveTab("chats");
      setSearch("");
      setUsers([]);

      setNewIncomingConvIds((prev) => {
        const next = new Set(prev);
        if (conv.id) next.delete(Number(conv.id));
        if (user.id) next.delete(Number(user.id));
        return next;
      });
      setUnreadCounts((prev) => {
        const next = { ...prev };
        if (conv.id) delete next[Number(conv.id)];
        if (user.id) delete next[Number(user.id)];
        return next;
      });
      setIncomingNotificationToast(null);

      await loadConversations(userId);
      await loadMessagesForConversation(conv.id, userId);
    } catch (error) {
      console.error("Failed to open chat with user:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversation || !selectedUser) {
      return;
    }

    const textToSend = message.trim();
    setMessage("");

    try {
      setSending(true);
      const sent = await sendMessage(
        activeConversation.id,
        selectedUser.id,
        textToSend,
        userId
      );

      setMessages((prev) => [...prev, sent]);
      loadConversations(userId);
    } catch (error) {
      console.error("Failed to send message:", error);
      // restore message if failed
      setMessage(textToSend);
    } finally {
      setSending(false);
    }
  };

  // Start editing a message
  const startEdit = (msg) => {
    setEditingMessage(msg);
    setEditText(msg.content);
    setActiveMenuId(null);
  };

  // Save edited message
  const handleSaveEdit = async () => {
    if (!editingMessage || !editText.trim()) return;

    try {
      const updated = await editMessage(editingMessage.id, editText.trim(), userId);
      setMessages((prev) =>
        prev.map((msg) => (Number(msg.id) === Number(updated.id) ? updated : msg))
      );
      setEditingMessage(null);
      setEditText("");
      loadConversations(userId);
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    setActiveMenuId(null);
    try {
      const deleted = await deleteMessage(messageId, userId);
      setMessages((prev) =>
        prev.map((msg) => (Number(msg.id) === Number(deleted.id) ? deleted : msg))
      );
      loadConversations(userId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessage) {
        handleSaveEdit();
      } else {
        handleSendMessage();
      }
    }
  };

  // Format timestamp helper
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const today = new Date();
      if (date.toDateString() === today.toDateString()) return "Today";
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  // ── Gentle Notification Chime for Incoming Messages ────────────────────
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // Audio context policy safe ignore
    }
  };

  // ── WhatsApp-style Day & Date Formatter ──────────────────────────────────
  const getMsgDateKey = (msg) => {
    if (!msg?.createdAt) return "";
    try {
      return new Date(msg.createdAt).toDateString();
    } catch {
      return "";
    }
  };

  const formatChatDateSeparator = (dateStr) => {
    if (!dateStr) return "";
    try {
      const msgDate = new Date(dateStr);
      const today = new Date();

      const d1 = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
      const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));

      const dayName = msgDate.toLocaleDateString([], { weekday: "long" });
      const dateText = msgDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: msgDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });

      if (diffDays === 0) {
        return `Today, ${dateText}`;
      } else if (diffDays === 1) {
        return `Yesterday, ${dateText}`;
      } else if (diffDays < 7 && diffDays > 1) {
        return `${dayName}, ${dateText}`;
      } else {
        return `${dayName}, ${msgDate.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}`;
      }
    } catch {
      return "";
    }
  };

  // Sort conversations so newly incoming / highlighted conversations float to the top
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aIsHighlighted =
        newIncomingConvIds.has(Number(a.id)) ||
        (a.userId && newIncomingConvIds.has(Number(a.userId)));
      const bIsHighlighted =
        newIncomingConvIds.has(Number(b.id)) ||
        (b.userId && newIncomingConvIds.has(Number(b.userId)));

      if (aIsHighlighted && !bIsHighlighted) return -1;
      if (!aIsHighlighted && bIsHighlighted) return 1;

      const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
      const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
      return bTime - aTime;
    });
  }, [conversations, newIncomingConvIds]);

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F5F7FA] font-['Inter',_sans-serif] flex flex-col relative">
      {/* INCOMING MESSAGE FLOATING TOAST NOTIFICATION */}
      {incomingNotificationToast && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md border-2 border-blue-500 rounded-2xl shadow-2xl shadow-blue-500/20 p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center shrink-0 shadow-sm text-[15px]">
              {incomingNotificationToast.senderName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                  New Message
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  {incomingNotificationToast.time}
                </span>
              </div>
              <h5 className="text-[13px] font-bold text-[#1E293B] truncate mt-0.5">
                {incomingNotificationToast.senderName}
              </h5>
              <p className="text-[12px] text-[#475569] truncate mt-0.5 font-medium">
                {incomingNotificationToast.content}
              </p>
              <button
                onClick={() => {
                  const targetConv = conversations.find(
                    (c) =>
                      (incomingNotificationToast.convId && Number(c.id) === Number(incomingNotificationToast.convId)) ||
                      (incomingNotificationToast.senderId && Number(c.userId) === Number(incomingNotificationToast.senderId))
                  );
                  if (targetConv) {
                    openConversation(targetConv);
                  }
                  setIncomingNotificationToast(null);
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg shadow-sm transition-all"
              >
                <span>Open Chat</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
            <button
              onClick={() => setIncomingNotificationToast(null)}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* TOP NAVIGATION / HEADER (No sidebar per user request) */}
      <header className="shrink-0 bg-white border-b border-[#E2E8F0] px-4 md:px-8 py-3 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 px-3.5 py-2 text-[14px] font-medium text-[#475569] hover:text-[#1E293B] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-[10px] shadow-sm transition-all duration-200"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <div className="h-6 w-[1px] bg-[#E2E8F0] hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-[18px] md:text-[20px] font-bold text-[#1E293B] leading-tight flex items-center gap-2">
                  LifeOS Connect
                  <span className="bg-blue-50 text-[#2563EB] text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                    Live
                  </span>
                </h1>
                <p className="text-[#64748B] text-[12px] hidden md:block">
                  Direct messaging and real-time collaboration with fellow members
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[13px] font-medium text-[#334155]">
                {authUser?.firstName
                  ? `${authUser.firstName} ${authUser.lastName || ""}`
                  : authUser?.username || "Connected"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CHAT LAYOUT */}
      <main className="flex-1 min-h-0 p-2 sm:p-3 md:p-5 max-w-[1600px] mx-auto w-full flex flex-col overflow-hidden">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col md:flex-row">
          
          {/* LEFT PANEL: CONVERSATIONS & PEOPLE SEARCH (STICKY SIDEBAR) */}
          <div
            className={`w-full md:w-[360px] lg:w-[400px] border-r border-[#E2E8F0] flex flex-col bg-white h-full min-h-0 shrink-0 overflow-hidden ${
              selectedUser ? "hidden md:flex" : "flex"
            }`}
          >
            {/* SEARCH BOX & TABS */}
            <div className="shrink-0 p-3.5 md:p-4 border-b border-[#E2E8F0] bg-white sticky top-0 z-10">
              {/* SEARCH INPUT */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-[10px] pl-10 pr-9 py-2 text-[14px] text-[#1E293B] placeholder-[#94A3B8] transition-all outline-none"
                  placeholder="Search people by name..."
                  value={search}
                  onChange={handleSearchChange}
                  onFocus={() => setActiveTab("people")}
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setUsers([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* TAB SELECTOR */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F1F5F9] rounded-[10px]">
                <button
                  onClick={() => setActiveTab("chats")}
                  className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-[8px] text-[13px] font-medium transition-all ${
                    activeTab === "chats"
                      ? "bg-white text-[#2563EB] shadow-sm"
                      : "text-[#64748B] hover:text-[#1E293B]"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chats</span>
                  {conversations.length > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                        activeTab === "chats"
                          ? "bg-blue-100 text-[#2563EB]"
                          : "bg-slate-200 text-[#64748B]"
                      }`}
                    >
                      {conversations.length}
                    </span>
                  )}
                  {newIncomingConvIds.size > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-600 text-white animate-pulse shadow-sm">
                      {newIncomingConvIds.size}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("people")}
                  className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-[8px] text-[13px] font-medium transition-all ${
                    activeTab === "people"
                      ? "bg-white text-[#2563EB] shadow-sm"
                      : "text-[#64748B] hover:text-[#1E293B]"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Find People</span>
                </button>
              </div>
            </div>

            {/* LIST AREA */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#F1F5F9]">
              {/* TAB: PEOPLE / SEARCH */}
              {activeTab === "people" && (
                <div>
                  {searching ? (
                    <div className="flex flex-col items-center justify-center p-8 text-[#94A3B8]">
                      <RefreshCw className="w-6 h-6 animate-spin mb-2 text-[#2563EB]" />
                      <p className="text-[13px]">Searching people...</p>
                    </div>
                  ) : users.length > 0 ? (
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        Search Results ({users.length})
                      </div>
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#E2E8F0]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center shrink-0 shadow-sm">
                              {user.firstName?.charAt(0)?.toUpperCase() ||
                                user.username?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-[14px] font-semibold text-[#1E293B] truncate">
                                {user.firstName} {user.lastName}
                              </h4>
                              <p className="text-[12px] text-[#64748B] truncate">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => openChatWithUser(user)}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-3.5 py-1.5 rounded-[8px] text-[13px] shadow-sm hover:shadow transition-all duration-200 shrink-0"
                          >
                            Chat
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : search.trim() ? (
                    <div className="p-8 text-center text-[#64748B]">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-[#94A3B8]">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-[14px] font-medium text-[#334155]">
                        No people found
                      </p>
                      <p className="text-[12px] text-[#94A3B8] mt-1">
                        Try searching with a different name or username
                      </p>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-[#64748B]">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3 text-[#2563EB]">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="text-[14px] font-medium text-[#334155]">
                        Discover Friends & Colleagues
                      </p>
                      <p className="text-[12px] text-[#94A3B8] mt-1">
                        Type in the search box above to find anyone in LifeOS
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CONVERSATIONS */}
              {activeTab === "chats" && (
                <div>
                  {loadingChats && conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-[#94A3B8]">
                      <RefreshCw className="w-6 h-6 animate-spin mb-2 text-[#2563EB]" />
                      <p className="text-[13px]">Loading conversations...</p>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="p-8 text-center text-[#64748B]">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3 text-[#2563EB]">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h4 className="text-[14px] font-semibold text-[#1E293B] mb-1">
                        No conversations yet
                      </h4>
                      <p className="text-[12px] text-[#64748B] mb-4">
                        Search for members in LifeOS and start a conversation!
                      </p>
                      <button
                        onClick={() => setActiveTab("people")}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-4 py-2 rounded-[10px] text-[13px] shadow-sm transition-all"
                      >
                        Find People
                      </button>
                    </div>
                  ) : (
                    sortedConversations.map((conv) => {
                      const isSelected = activeConversation?.id === conv.id;
                      const isMenuOpen = sidebarMenuOpenId === conv.id;
                      const hasNewIncoming =
                        newIncomingConvIds.has(Number(conv.id)) ||
                        (conv.userId && newIncomingConvIds.has(Number(conv.userId)));
                      const unreadCount =
                        unreadCounts[Number(conv.id)] ||
                        (conv.userId && unreadCounts[Number(conv.userId)]) ||
                        0;

                      return (
                        <div
                          key={conv.id}
                          onClick={() => openConversation(conv)}
                          className={`group w-full text-start p-3.5 transition-colors flex items-center gap-3 cursor-pointer relative ${
                            isSelected
                              ? "bg-[#F1F5F9]"
                              : "bg-white hover:bg-[#F8FAFC]"
                          }`}
                        >
                          {/* AVATAR */}
                          <div className="relative shrink-0">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center shadow-sm text-[15px]">
                              {conv.firstName?.charAt(0)?.toUpperCase() ||
                                conv.username?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </div>
                          </div>

                          {/* USER INFO & PREVIEW */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <h4
                                className={`text-[14px] truncate ${
                                  hasNewIncoming
                                    ? "text-[#000000] font-bold"
                                    : isSelected
                                    ? "text-[#1E293B] font-semibold"
                                    : "text-[#64748B] font-normal"
                                }`}
                              >
                                <span>{conv.firstName} {conv.lastName}</span>
                              </h4>
                              {conv.lastMessageTime && (
                                <span
                                  className={`text-[11px] shrink-0 ${
                                    hasNewIncoming
                                      ? "text-[#1E293B] font-semibold"
                                      : "text-[#94A3B8] font-normal"
                                  }`}
                                >
                                  {formatTime(conv.lastMessageTime)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={`text-[13px] truncate ${
                                  hasNewIncoming
                                    ? "text-[#1E293B] font-medium"
                                    : isSelected
                                    ? "text-[#475569] font-normal"
                                    : "text-[#94A3B8] font-normal"
                                }`}
                              >
                                {conv.lastMessage || "No messages yet"}
                              </p>
                            </div>
                          </div>

                          {/* 3-DOTS ACTION MENU (HOVER / ALWAYS ON TOUCH) */}
                          <div className="relative shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSidebarMenuOpenId(isMenuOpen ? null : conv.id);
                              }}
                              className={`p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-all ${
                                isMenuOpen ? "opacity-100 bg-[#F1F5F9] text-[#1E293B]" : "opacity-0 group-hover:opacity-100"
                              }`}
                              title="Conversation actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div
                                className="absolute right-0 mt-1 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-30 py-1 divide-y divide-[#F1F5F9]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setSidebarMenuOpenId(null);
                                      openConversation(conv);
                                      setShowClearModal(true);
                                    }}
                                    className="w-full text-start px-3.5 py-2 text-[12px] font-medium text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"
                                  >
                                    <Eraser className="w-3.5 h-3.5 text-[#64748B]" />
                                    <span>Clear Chat</span>
                                  </button>
                                </div>
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setSidebarMenuOpenId(null);
                                      setConvToDelete(conv);
                                      setShowDeleteModal(true);
                                    }}
                                    className="w-full text-start px-3.5 py-2 text-[12px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Delete Chat</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: CHAT CONVERSATION VIEW */}
          <div
            className={`flex-1 flex flex-col bg-white h-full min-h-0 min-w-0 overflow-hidden ${
              !selectedUser ? "hidden md:flex" : "flex"
            }`}
          >
            {selectedUser ? (
              <>
                {/* ACTIVE CHAT HEADER (STICKY NAVBAR) */}
                <div className="sticky top-0 z-20 shrink-0 p-3 md:px-6 md:py-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-white/95 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setActiveConversation(null);
                      }}
                      className="md:hidden p-2 -ml-1 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-[8px]"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center shadow-sm">
                        {selectedUser.firstName?.charAt(0)?.toUpperCase() ||
                          selectedUser.username?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0"></div>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold text-[#1E293B] truncate leading-tight">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h3>
                      <p className="text-[12px] text-[#64748B] truncate">
                        @{selectedUser.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Audio call button */}
                    <button
                      onClick={() => startCall("audio")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#475569] hover:text-emerald-600 bg-[#F8FAFC] hover:bg-emerald-50 border border-[#E2E8F0] hover:border-emerald-200 rounded-[10px] transition-all shadow-xs"
                      title="Audio call"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">Audio</span>
                    </button>

                    {/* Video call button */}
                    <button
                      onClick={() => startCall("video")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#475569] hover:text-[#2563EB] bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-200 rounded-[10px] transition-all shadow-xs"
                      title="Video call"
                    >
                      <Video className="w-4 h-4 text-[#2563EB]" />
                      <span className="hidden sm:inline">Video</span>
                    </button>

                    {/* Refresh */}
                    <button
                      onClick={() =>
                        activeConversation &&
                        loadMessagesForConversation(activeConversation.id)
                      }
                      className="p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-[10px] border border-transparent hover:border-[#E2E8F0] transition-colors"
                      title="Refresh messages"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          loadingMessages ? "animate-spin text-[#2563EB]" : ""
                        }`}
                      />
                    </button>

                    {/* Chat Options (Clear / Delete) */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHeaderMenuOpen(!headerMenuOpen);
                        }}
                        className={`p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-[8px] transition-colors ${
                          headerMenuOpen ? "bg-[#F1F5F9] text-[#1E293B]" : ""
                        }`}
                        title="Chat options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {headerMenuOpen && (
                        <div
                          className="absolute right-0 mt-1.5 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-30 py-1 divide-y divide-[#F1F5F9]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setHeaderMenuOpen(false);
                                setShowClearModal(true);
                              }}
                              className="w-full text-start px-3.5 py-2 text-[13px] font-medium text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2.5 transition-colors"
                            >
                              <Eraser className="w-4 h-4 text-[#64748B]" />
                              <span>Clear Chat</span>
                            </button>
                          </div>
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setHeaderMenuOpen(false);
                                setConvToDelete(activeConversation);
                                setShowDeleteModal(true);
                              }}
                              className="w-full text-start px-3.5 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-rose-600" />
                              <span>Delete Chat</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* MESSAGES SCROLL CONTAINER */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 bg-[#F8FAFC] space-y-3">
                  {loadingMessages && messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#94A3B8]">
                      <RefreshCw className="w-6 h-6 animate-spin mb-2 text-[#2563EB]" />
                      <p className="text-[13px]">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#64748B] p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3 shadow-sm">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <h4 className="text-[15px] font-semibold text-[#1E293B] mb-1">
                        Say hello to {selectedUser.firstName}!
                      </h4>
                      <p className="text-[13px] text-[#64748B] max-w-sm">
                        Start this conversation by sending a greeting below.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const prevMsg = idx > 0 ? messages[idx - 1] : null;
                      const currentKey = getMsgDateKey(msg);
                      const prevKey = prevMsg ? getMsgDateKey(prevMsg) : null;
                      const isNewDay = currentKey && currentKey !== prevKey;

                      const isMine = Number(msg.senderId) === Number(userId);
                      const isMenuOpen = activeMenuId === msg.id;
                      const isHighlighted = !isMine && highlightedMessageIds.has(Number(msg.id));

                      return (
                        <React.Fragment key={msg.id || idx}>
                          {/* ── WhatsApp-style Day & Date Pill ─────────────────── */}
                          {isNewDay && (
                            <div className="flex justify-center my-3.5 sticky top-1 z-10 pointer-events-none">
                              <div className="bg-white/95 backdrop-blur-sm border border-[#CBD5E1]/60 text-[#475569] text-[11px] font-semibold px-3.5 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center gap-1.5 pointer-events-auto select-none">
                                <Calendar className="w-3 h-3 text-[#2563EB]" />
                                <span>{formatChatDateSeparator(msg.createdAt)}</span>
                              </div>
                            </div>
                          )}

                          {/* ── CALL LOG MESSAGE RENDERING ───────────────────────── */}
                          {msg.messageType === "CALL_LOG" ? (
                            <div className="flex justify-center my-2.5">
                              <div className="flex items-center gap-3.5 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl px-4 py-2.5 max-w-[390px] w-full transition-all hover:shadow hover:border-[#CBD5E1]">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    (msg.callStatus === "MISSED" || msg.callStatus === "REJECTED")
                                      ? "bg-rose-50 text-rose-600 border border-rose-100"
                                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  }`}
                                >
                                  {(msg.callType || "").toLowerCase() === "video" ? (
                                    (msg.callStatus === "MISSED" || msg.callStatus === "REJECTED") ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />
                                  ) : (
                                    (msg.callStatus === "MISSED" || msg.callStatus === "REJECTED") ? <PhoneMissed className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5
                                      className={`text-[13px] font-semibold truncate ${
                                        msg.callStatus === "MISSED" && !isMine ? "text-rose-600 font-bold" : "text-[#1E293B]"
                                      }`}
                                    >
                                      {(() => {
                                        const isVideo = (msg.callType || "").toLowerCase() === "video";
                                        const isMissed = msg.callStatus === "MISSED";
                                        const isRejected = msg.callStatus === "REJECTED";
                                        if (isMissed) {
                                          return isMine
                                            ? (isVideo ? "Outgoing Video Call" : "Outgoing Audio Call")
                                            : (isVideo ? "Missed Video Call" : "Missed Audio Call");
                                        }
                                        if (isRejected) {
                                          return isVideo ? "Video Call Declined" : "Audio Call Declined";
                                        }
                                        return isVideo ? "Video Call" : "Audio Call";
                                      })()}
                                    </h5>
                                    <span className="text-[11px] text-[#94A3B8] shrink-0 font-normal">
                                      {formatTime(msg.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-[12px] text-[#64748B] mt-0.5 truncate flex items-center gap-1.5">
                                    <span>
                                      {(() => {
                                        const isMissed = msg.callStatus === "MISSED";
                                        const isRejected = msg.callStatus === "REJECTED";
                                        if (isMissed) return isMine ? "No answer" : "Missed call";
                                        if (isRejected) return isMine ? "Call was declined" : "Declined call";
                                        const durSec = msg.callDuration || 0;
                                        return durSec > 0 ? formatDuration(durSec) : "Call ended";
                                      })()}
                                    </span>
                                  </p>
                                </div>

                                <button
                                  onClick={() => startCall((msg.callType || "").toLowerCase() === "video" ? "video" : "audio")}
                                  className={`p-2 rounded-xl text-[12px] font-medium flex items-center gap-1.5 shrink-0 transition-all ${
                                    (msg.callType || "").toLowerCase() === "video"
                                      ? "text-[#2563EB] hover:bg-blue-50 bg-blue-50/50 border border-blue-200"
                                      : "text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                                  }`}
                                  title={`Call back (${(msg.callType || "").toLowerCase() === "video" ? "Video" : "Audio"})`}
                                >
                                  {(msg.callType || "").toLowerCase() === "video" ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                                  <span className="hidden sm:inline">Call back</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* ── REGULAR MESSAGE BUBBLE ─────────────────────────── */
                            <div
                              className={`flex group relative ${
                                isMine ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`relative group max-w-[82%] sm:max-w-[70%] rounded-2xl p-3 shadow-sm text-[14px] ${
                                  isMine
                                    ? "bg-[#2563EB] text-white rounded-tr-none"
                                    : "bg-white border border-[#E2E8F0] text-[#1E293B] rounded-tl-none"
                                }`}
                              >
                                {/* ACTION BUTTON FOR SENDER (EDIT / DELETE) */}
                                {isMine && !msg.deleted && (
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(isMenuOpen ? null : msg.id);
                                      }}
                                      className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-all"
                                      title="Message actions"
                                    >
                                      <MoreVertical className="w-3.5 h-3.5" />
                                    </button>

                                    {isMenuOpen && (
                                      <div
                                        className="absolute right-0 mt-1 w-28 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-30 py-1"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          onClick={() => startEdit(msg)}
                                          className="w-full text-start px-3 py-1.5 text-[12px] font-medium text-[#334155] hover:bg-[#F1F5F9] flex items-center gap-2"
                                        >
                                          <Edit2 className="w-3.5 h-3.5 text-[#2563EB]" />
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteMessage(msg.id)}
                                          className="w-full text-start px-3 py-1.5 text-[12px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* MESSAGE CONTENT */}
                                {msg.deleted ? (
                                  <div className="italic opacity-70 text-[13px] flex items-center gap-1.5">
                                    <span>🚫 This message was deleted</span>
                                  </div>
                                ) : (
                                  <div className="break-words leading-relaxed pr-4">
                                    {msg.content}
                                  </div>
                                )}

                                {/* FOOTER: TIME & STATUS */}
                                <div
                                  className={`flex items-center justify-end gap-1.5 mt-1 text-[11px] ${
                                    isMine ? "text-blue-100" : "text-[#94A3B8]"
                                  }`}
                                >
                                  {msg.edited && !msg.deleted && (
                                    <span className="opacity-75 italic text-[10px]">
                                      edited
                                    </span>
                                  )}
                                  <span>{formatTime(msg.createdAt)}</span>

                                  {isMine && (
                                    <span className="ml-0.5">
                                      {msg.status === "READ" ? (
                                        <CheckCheck className="w-3.5 h-3.5 text-white inline" />
                                      ) : msg.status === "DELIVERED" ? (
                                        <CheckCheck className="w-3.5 h-3.5 text-blue-200 inline" />
                                      ) : (
                                        <Check className="w-3.5 h-3.5 text-blue-200 inline" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* EDITING BANNER */}
                {editingMessage && (
                  <div className="bg-blue-50 border-t border-blue-100 px-4 py-2 flex items-center justify-between text-[13px] text-[#2563EB]">
                    <div className="flex items-center gap-2 truncate">
                      <Edit2 className="w-4 h-4 shrink-0" />
                      <span className="font-semibold shrink-0">Editing message:</span>
                      <span className="truncate text-[#475569]">
                        {editingMessage.content}
                      </span>
                    </div>
                    <button
                      onClick={cancelEdit}
                      className="p-1 hover:bg-blue-100 rounded-md text-[#2563EB] transition-colors ml-2"
                      title="Cancel edit"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* INPUT BAR */}
                <div className="p-3 md:p-4 bg-white border-t border-[#E2E8F0] shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-[10px] px-4 py-2.5 text-[14px] text-[#1E293B] placeholder-[#94A3B8] transition-all outline-none"
                      placeholder={
                        editingMessage
                          ? "Update your message..."
                          : `Message ${selectedUser.firstName}...`
                      }
                      value={editingMessage ? editText : message}
                      onChange={(e) =>
                        editingMessage
                          ? setEditText(e.target.value)
                          : setMessage(e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                    />

                    {editingMessage ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleSaveEdit}
                          disabled={!editText.trim()}
                          className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-[10px] text-[14px] shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] font-medium px-3 py-2.5 rounded-[10px] text-[14px] transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sending}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-[10px] text-[14px] shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* EMPTY WELCOME SCREEN WHEN NO CHAT IS SELECTED */
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8FAFC] text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 shadow-sm">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-[20px] font-bold text-[#1E293B] mb-2">
                  Welcome to LifeOS Connect
                </h3>
                <p className="text-[14px] text-[#64748B] max-w-md mb-6 leading-relaxed">
                  Select an active chat from the left panel or search for members
                  to connect, share ideas, and chat in real-time.
                </p>
                <button
                  onClick={() => setActiveTab("people")}
                  className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-5 py-2.5 rounded-[10px] text-[14px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Find People to Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Clear Chat Confirmation Modal ─────────────────────────────── */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Eraser className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-bold text-[#1E293B] mb-1">
                  Clear chat history?
                </h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Are you sure you want to clear all messages in this conversation with{" "}
                  <strong className="text-[#1E293B]">
                    {selectedUser?.firstName} {selectedUser?.lastName}
                  </strong>
                  ? All messages will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-[13px] font-medium text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-[10px] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                disabled={actionLoading}
                className="px-4 py-2 text-[13px] font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-[10px] shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Clear Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Conversation Confirmation Modal ──────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-bold text-[#1E293B] mb-1">
                  Delete this chat?
                </h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Are you sure you want to delete your conversation with{" "}
                  <strong className="text-[#1E293B]">
                    {convToDelete?.firstName || selectedUser?.firstName}{" "}
                    {convToDelete?.lastName || selectedUser?.lastName}
                  </strong>
                  ? This will delete all message history and remove the chat from your list.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConvToDelete(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-[13px] font-medium text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-[10px] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteConversation}
                disabled={actionLoading}
                className="px-4 py-2 text-[13px] font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-[10px] shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Video / Audio Call Modal ───────────────────────────────────── */}
      {callModal && (
        <VideoCallModal
          mode={callModal.mode}
          callType={callModal.callType}
          localUserId={userId}
          localName={authUser ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() : ""}
          remoteUser={callModal.remoteUser}
          incomingSignal={activeCallSignal}
          conversationId={activeConversation?.id || callModal?.signal?.conversationId}
          onCallEnded={handleCallEnded}
          onClose={closeCallModal}
        />
      )}
    </div>
  );
};

export default Connect;