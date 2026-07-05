import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ThinkingIndicator from "./ThinkingIndicator";

const ChatWindow = ({
    messages,
    message,
    setMessage,
    sendMessage,
    loading,
    onClose
}) => {
    const messagesEndRef = useRef(null);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="chatbot-window">
            {/* ── Header ── */}
            <div className="chatbot-header">
                <div className="chatbot-header-avatar">✨</div>
                <div className="chatbot-header-info">
                    <div className="chatbot-header-title">LifeOS Assistant</div>
                    <div className="chatbot-header-status">
                        <span className="chatbot-header-status-dot"></span>
                        {loading ? "Thinking..." : "Online"}
                    </div>
                </div>
                <button className="chatbot-close-btn" onClick={onClose} aria-label="Close chat">
                    ✕
                </button>
            </div>

            {/* ── Messages ── */}
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        sender={msg.sender}
                        text={msg.text}
                        timestamp={msg.timestamp}
                    />
                ))}

                {/* Thinking dots when AI is processing */}
                {loading && <ThinkingIndicator />}

                <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <ChatInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                loading={loading}
            />
        </div>
    );
};

export default ChatWindow;