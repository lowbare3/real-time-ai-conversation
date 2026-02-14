import { useRef, useEffect } from "react";
import "./ConversationPanel.css";

export default function ConversationPanel({
    messages,
    isLoading,
    timeRemaining,
    isActive,
    transcript,
}) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, transcript]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const timerClass =
        timeRemaining <= 10
            ? "timer-urgent"
            : timeRemaining <= 30
                ? "timer-warning"
                : "";

    return (
        <div className="conversation-panel">
            <div className="panel-header">
                <div className="panel-title">
                    <span className="panel-icon">💬</span>
                    <span>Conversation</span>
                </div>
                {isActive && (
                    <div className={`timer ${timerClass}`}>
                        <span className="timer-icon">⏱️</span>
                        <span className="timer-text">{formatTime(timeRemaining)}</span>
                    </div>
                )}
            </div>

            <div className="messages-container">
                {messages.length === 0 && !isActive && (
                    <div className="empty-state">
                        <div className="empty-state-emoji">🎨</div>
                        <div className="empty-state-text">
                            Click <strong>"Start Conversation"</strong> to begin talking about
                            the picture!
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`message message-${msg.role}`}>
                        <div className="message-avatar">
                            {msg.role === "ai" ? "🤖" : "👧"}
                        </div>
                        <div className="message-bubble">
                            <div className="message-role">
                                {msg.role === "ai" ? "AI Friend" : "You"}
                            </div>
                            <div className="message-text">{msg.text}</div>
                        </div>
                    </div>
                ))}

                {transcript && (
                    <div className="message message-user message-interim">
                        <div className="message-avatar">👧</div>
                        <div className="message-bubble">
                            <div className="message-role">You (listening...)</div>
                            <div className="message-text">{transcript}</div>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="message message-ai">
                        <div className="message-avatar">🤖</div>
                        <div className="message-bubble">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
