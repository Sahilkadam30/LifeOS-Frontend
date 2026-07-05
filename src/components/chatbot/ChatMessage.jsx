import React from "react";

const ChatMessage = ({ sender, text, timestamp }) => {
    const isUser = sender === "user";

    return (
        <div className={`chatbot-msg-row ${isUser ? "is-user" : "is-ai"}`}>
            {/* Avatar */}
            <div className={`chatbot-msg-avatar ${isUser ? "user" : "ai"}`}>
                {isUser ? "👤" : "✨"}
            </div>

            {/* Bubble */}
            <div>
                <div className={`chatbot-msg-bubble ${isUser ? "is-user" : "is-ai"}`}>
                    {text}
                </div>
                {timestamp && (
                    <div className="chatbot-msg-time">{timestamp}</div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;