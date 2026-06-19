import React from "react";

const ThinkingIndicator = () => {
    return (
        <div className="chatbot-thinking">
            {/* AI Avatar */}
            <div className="chatbot-msg-avatar ai" style={{ marginRight: 8 }}>
                ✨
            </div>

            {/* Animated Dots */}
            <div className="chatbot-thinking-bubble">
                <div className="chatbot-thinking-dot"></div>
                <div className="chatbot-thinking-dot"></div>
                <div className="chatbot-thinking-dot"></div>
            </div>
        </div>
    );
};

export default ThinkingIndicator;
