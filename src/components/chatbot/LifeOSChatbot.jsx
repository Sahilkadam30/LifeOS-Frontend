import React, { useState } from "react";
import FloatingChatButton from "./FloatingChatButton";
import ChatWindow from "./ChatWindow";
import { sendMessage as sendToAI } from "../../services/ChatService";
import "../../styles/Chatbot.css";

const LifeOSChatbot = () => {

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello 👋 I'm your LifeOS Assistant. Ask me anything about your fitness, finances, travel plans, or daily schedule!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
    ]);

    const getTimestamp = () =>
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const sendMessage = async () => {

        if (!message.trim()) return;

        const currentMessage = message;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: currentMessage,
                timestamp: getTimestamp()
            }
        ]);

        setMessage("");
        setLoading(true);

        try {

            const response = await sendToAI(currentMessage);

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: response.response,
                    timestamp: getTimestamp()
                }
            ]);

        } catch (error) {

            console.error("AI Error:", error);

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: "⚠️ Unable to connect to LifeOS AI. Please try again.",
                    timestamp: getTimestamp()
                }
            ]);

        } finally {

            setLoading(false);
        }
    };

    return (
        <>
            {
                open &&
                <ChatWindow
                    messages={messages}
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                    loading={loading}
                    onClose={() => setOpen(false)}
                />
            }

            <FloatingChatButton
                onClick={() => setOpen(!open)}
                isOpen={open}
            />
        </>
    );
};

export default LifeOSChatbot;