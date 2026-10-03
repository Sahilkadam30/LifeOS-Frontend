import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

// ── Connect & subscribe ───────────────────────────────────────────────────────
export const connectSocket = (userId, onMessage) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:4550/ws"),
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ Connected to LifeOS WebSocket");
      stompClient.subscribe(`/topic/user/${userId}`, (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
    },

    onStompError: (frame) => {
      console.error("WebSocket STOMP error:", frame);
    },
  });

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

// ── Typing indicator ──────────────────────────────────────────────────────────
export const sendTypingEvent = (senderId, receiverId) => {
  if (!stompClient?.connected) return;
  stompClient.publish({
    destination: "/app/typing",
    body: JSON.stringify({ senderId, receiverId }),
  });
};

// ── WebRTC signaling helpers ──────────────────────────────────────────────────

/** Send a call offer (SDP) to the remote peer */
export const sendCallOffer = (senderId, receiverId, senderName, callType, sdp, conversationId) => {
  if (!stompClient?.connected) return;
  stompClient.publish({
    destination: "/app/call/offer",
    body: JSON.stringify({
      senderId,
      receiverId,
      conversationId,
      senderName,
      callType,           // "video" | "audio"
      payload: JSON.stringify(sdp),
    }),
  });
};

/** Answer the call (SDP answer) */
export const sendCallAnswer = (senderId, receiverId, sdp) => {
  if (!stompClient?.connected) return;
  stompClient.publish({
    destination: "/app/call/answer",
    body: JSON.stringify({
      senderId,
      receiverId,
      payload: JSON.stringify(sdp),
    }),
  });
};

/** Reject an incoming call */
export const sendCallReject = (senderId, receiverId) => {
  if (!stompClient?.connected) return;
  stompClient.publish({
    destination: "/app/call/reject",
    body: JSON.stringify({ senderId, receiverId }),
  });
};

/** Send an ICE candidate to the remote peer */
export const sendIceCandidate = (senderId, receiverId, candidate) => {
  if (!stompClient?.connected) return;
  stompClient.publish({
    destination: "/app/call/ice",
    body: JSON.stringify({
      senderId,
      receiverId,
      payload: JSON.stringify(candidate),
    }),
  });
};

/** Hang up / end the call */
export const sendCallEnd = (senderId, receiverId) => {
  if (!stompClient?.connected) return;
  stompClient.publish({
    destination: "/app/call/end",
    body: JSON.stringify({ senderId, receiverId }),
  });
};