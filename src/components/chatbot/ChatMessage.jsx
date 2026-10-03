import React from "react";

const ChatMessage = ({ sender, text, timestamp, streaming }) => {
    const isUser = sender === "user";
    const displayText = typeof text === "string"
        ? text
            .replaceAll("**", "")
            .replace(/(?<!\n)\s*\*\s+/g, "\n• ")
            .replace(/^\*\s+/gm, "• ")
        : text;

    return (
        <div className={`chatbot-msg-row ${isUser ? "is-user" : "is-ai"}`}>
            {/* Avatar */}
            <div className={`chatbot-msg-avatar ${isUser ? "user" : "ai"}`}>
                {isUser ? "\uD83D\uDC64" : "\u2728"}
            </div>

            {/* Bubble */}
            <div>
                <div className={`chatbot-msg-bubble ${isUser ? "is-user" : "is-ai"}`}>
                    {displayText}
                    {streaming && (
                        <span className="chatbot-stream-cursor" aria-hidden="true" />
                    )}
                </div>
                {timestamp && !streaming && (
                    <div className="chatbot-msg-time">{timestamp}</div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;