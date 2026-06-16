import React, { useState } from "react";
import FloatingChatButton from "./FloatingChatButton";
import ChatWindow from "./ChatWindow";
import { sendMessage as sendToAI } from "../../services/ChatService";

const LifeOSChatbot = () => {

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello 👋 I am your LifeOS Assistant."
        }
    ]);

    const sendMessage = async () => {

    if (!message.trim()) return;

    const currentMessage = message;

    setMessages(prev => [
        ...prev,
        {
            sender: "user",
            text: currentMessage
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
                text: response.response
            }
        ]);

    } catch (error) {

        console.error("AI Error:", error);

        setMessages(prev => [
            ...prev,
            {
                sender: "ai",
                text: "Unable to connect to LifeOS AI."
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
                />
            }

            <FloatingChatButton
                onClick={() => setOpen(!open)}
            />
        </>
    );
};

export default LifeOSChatbot;