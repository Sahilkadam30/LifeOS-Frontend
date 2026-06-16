import React from "react";

const ChatMessage = ({ sender, text }) => {
    const isUser = sender === "user";

    return (
        <div
            className={`d-flex mb-3 ${
                isUser ? "justify-content-end" : "justify-content-start"
            }`}
        >
            <div
                className={`p-3 rounded shadow-sm ${
                    isUser
                        ? "bg-primary text-white"
                        : "bg-light text-dark"
                }`}
                style={{
                    maxWidth: "80%",
                    wordBreak: "break-word"
                }}
            >
                {text}
            </div>
        </div>
    );
};

export default ChatMessage;