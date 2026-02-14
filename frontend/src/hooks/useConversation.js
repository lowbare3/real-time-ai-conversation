import { useState, useCallback, useRef } from "react";

const API_BASE = "http://localhost:3001/api";

export default function useConversation() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toolEffects, setToolEffects] = useState({
        stickers: [],
        funFact: null,
        confetti: false,
        themeColor: null,
    });
    const sessionIdRef = useRef(
        `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
    );

    const processToolCalls = useCallback((toolCalls) => {
        if (!toolCalls || toolCalls.length === 0) return;

        toolCalls.forEach((call) => {
            const { name, args } = call;

            switch (name) {
                case "add_sticker":
                    setToolEffects((prev) => ({
                        ...prev,
                        stickers: [
                            ...prev.stickers,
                            {
                                emoji: args.emoji,
                                label: args.label,
                                id: Date.now() + Math.random(),
                                x: Math.random() * 70 + 10,
                                y: Math.random() * 70 + 10,
                            },
                        ],
                    }));
                    break;

                case "show_fun_fact":
                    setToolEffects((prev) => ({
                        ...prev,
                        funFact: args.fact,
                    }));
                    // Clear fun fact after 8 seconds
                    setTimeout(() => {
                        setToolEffects((prev) => ({ ...prev, funFact: null }));
                    }, 8000);
                    break;

                case "celebrate":
                    setToolEffects((prev) => ({ ...prev, confetti: true }));
                    // Clear confetti after 4 seconds
                    setTimeout(() => {
                        setToolEffects((prev) => ({ ...prev, confetti: false }));
                    }, 4000);
                    break;

                case "change_theme":
                    setToolEffects((prev) => ({
                        ...prev,
                        themeColor: args.color,
                    }));
                    break;

                default:
                    break;
            }
        });
    }, []);

    const startConversation = useCallback(
        async (imageBase64) => {
            setIsLoading(true);
            try {
                const res = await fetch(`${API_BASE}/start`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        imageBase64,
                        sessionId: sessionIdRef.current,
                    }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to start conversation");
                }

                const data = await res.json();

                const aiMessage = { role: "ai", text: data.text };
                setMessages([aiMessage]);

                processToolCalls(data.toolCalls);
                setIsLoading(false);

                return data.text;
            } catch (error) {
                console.error("Start conversation error:", error);
                setIsLoading(false);
                throw error;
            }
        },
        [processToolCalls]
    );

    const sendMessage = useCallback(
        async (userText, timeRemaining) => {
            const userMessage = { role: "user", text: userText };
            setMessages((prev) => [...prev, userMessage]);
            setIsLoading(true);

            try {
                const res = await fetch(`${API_BASE}/chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: userText,
                        sessionId: sessionIdRef.current,
                        timeRemaining,
                    }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to send message");
                }

                const data = await res.json();

                const aiMessage = { role: "ai", text: data.text };
                setMessages((prev) => [...prev, aiMessage]);

                processToolCalls(data.toolCalls);
                setIsLoading(false);

                return data.text;
            } catch (error) {
                console.error("Send message error:", error);
                setIsLoading(false);
                throw error;
            }
        },
        [processToolCalls]
    );

    const resetConversation = useCallback(() => {
        setMessages([]);
        setToolEffects({
            stickers: [],
            funFact: null,
            confetti: false,
            themeColor: null,
        });
        sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }, []);

    return {
        messages,
        isLoading,
        toolEffects,
        startConversation,
        sendMessage,
        resetConversation,
    };
}
