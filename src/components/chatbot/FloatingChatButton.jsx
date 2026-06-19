import React from "react";

const FloatingChatButton = ({ onClick, isOpen }) => {
    return (
        <button
            onClick={onClick}
            className={`chatbot-fab${isOpen ? " is-open" : ""}`}
            aria-label={isOpen ? "Close chat" : "Open chat"}
        >
            {isOpen ? "✕" : "💬"}
        </button>
    );
};

export default FloatingChatButton;