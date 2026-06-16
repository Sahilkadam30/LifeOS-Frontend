import React from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatWindow = ({
    messages,
    message,
    setMessage,
    sendMessage,
    loading
}) => {

    return (
        <div
            className="card shadow-lg border-0"
            style={{
                position: "fixed",
                bottom: "90px",
                right: "20px",
                width: "400px",
                height: "550px",
                zIndex: 9999,
                borderRadius: "20px"
            }}
        >
            <div className="card-header bg-primary text-white fw-bold">
                🤖 LifeOS Assistant
            </div>

            <div
                className="card-body"
                style={{
                    overflowY: "auto",
                    backgroundColor: "#f8f9fa"
                }}
            >
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        sender={msg.sender}
                        text={msg.text}
                    />
                ))}

                {loading && (
                    <ChatMessage
                        sender="ai"
                        text="Thinking..."
                    />
                )}
            </div>

            <div className="card-footer">
                <ChatInput
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ChatWindow;