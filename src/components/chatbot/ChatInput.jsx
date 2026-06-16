import React from "react";

const ChatInput =  ({
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
        <div className="d-flex gap-2">
            <input
                type="text"
                className="form-control"
                placeholder="Ask LifeOS AI..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
            />

            <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={loading}
            >
                {loading ? "..." : "Send"}
            </button>
        </div>
    );
};

export default ChatInput;