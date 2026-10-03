import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FloatingChatButton from "./FloatingChatButton";
import ChatWindow from "./ChatWindow";
import { sendMessage as sendToAI } from "../../services/ChatService";
import "../../styles/Chatbot.css";

const LifeOSChatbot = () => {

    const location = useLocation();
    const hiddenRoutes = ["/", "/login", "/register"];

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello \uD83D\uDC4B I'm your LifeOS Assistant. Ask me anything about your life goals & roadmaps, music studio, finances, fitness, travel plans, or daily schedule!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
    ]);

    const getTimestamp = () =>
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    useEffect(() => {
        const handleOpenChat = (event) => {
            setOpen(true);
            if (event.detail?.message) {
                setMessage(event.detail.message);
                if (event.detail.autoSend) {
                    executeSendMessage(event.detail.message);
                }
            }
        };

        window.addEventListener("open-lifeos-chat", handleOpenChat);
        return () => window.removeEventListener("open-lifeos-chat", handleOpenChat);
    }, []);

    /**
     * Streams the AI response word-by-word into the last message bubble,
     * producing a ChatGPT-style typewriter effect.
     */
    const streamResponse = (fullText) => {
        const words = fullText.split(" ");
        const timestamp = getTimestamp();

        // Add empty placeholder that will be filled progressively
        setMessages(prev => [
            ...prev,
            {
                sender: "ai",
                text: "",
                timestamp,
                streaming: true
            }
        ]);

        let wordIndex = 0;

        const interval = setInterval(() => {
            wordIndex++;
            const partial = words.slice(0, wordIndex).join(" ");
            const isLast = wordIndex >= words.length;

            setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                    ...updated[lastIdx],
                    text: partial,
                    streaming: !isLast
                };
                return updated;
            });

            if (isLast) {
                clearInterval(interval);
            }
        }, 35); // ~35 ms per word — increase for slower, decrease for faster
    };

    const cleanAIResponse = (raw) => {
        if (!raw) return "";
        return raw
            .replaceAll("**", "")
            .replace(/(?<!\n)\s*\*\s+/g, "\n• ")
            .replace(/^\*\s+/gm, "• ")
            .trim();
    };

    const executeSendMessage = async (textToSend) => {
        if (!textToSend || !textToSend.trim()) return;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: textToSend,
                timestamp: getTimestamp()
            }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await sendToAI(textToSend);
            setLoading(false);
            const formatted = cleanAIResponse(response.response);
            streamResponse(formatted);
        } catch (error) {
            console.error("AI Error:", error);
            setLoading(false);
            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: "\u26A0\uFE0F Unable to connect to LifeOS AI. Please try again.",
                    timestamp: getTimestamp()
                }
            ]);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;
        await executeSendMessage(message);
    };

    if (hiddenRoutes.includes(location.pathname)) return null;

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