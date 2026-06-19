import React from "react";

const ChatInput = ({
    message,
    setMessage,
    sendMessage,
    loading
}) => {

    const handleKeyPress = async (e) => {
        if (e.key === "Enter" && !loading) {
            await sendMessage();
        }
    };

    return (
        <div className="chatbot-input-area">
            <input
                type="text"
                className="chatbot-input"
                placeholder="Ask LifeOS AI anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
            />

            <button
                className="chatbot-send-btn"
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                aria-label="Send message"
            >
                ➤
            </button>
        </div>
    );
};

export default ChatInput;