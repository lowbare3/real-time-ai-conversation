import "./VoiceControls.css";

export default function VoiceControls({
    isActive,
    isListening,
    isSpeaking,
    isLoading,
    onStart,
    onStop,
    isSupported,
    conversationEnded,
    onRestart,
}) {
    if (!isSupported) {
        return (
            <div className="voice-controls">
                <div className="unsupported-message">
                    ⚠️ Speech recognition is not supported in this browser. Please use
                    Chrome or Edge.
                </div>
            </div>
        );
    }

    return (
        <div className="voice-controls">
            {!isActive && !conversationEnded && (
                <button className="start-button" onClick={onStart} id="start-btn">
                    <span className="btn-icon">🎙️</span>
                    <span className="btn-text">Start Conversation</span>
                    <span className="btn-subtitle">Talk about the picture!</span>
                </button>
            )}

            {conversationEnded && (
                <div className="ended-controls">
                    <div className="ended-message">
                        <span className="ended-icon">🌟</span>
                        <span>Great conversation! You did amazing!</span>
                    </div>
                    <button className="restart-button" onClick={onRestart} id="restart-btn">
                        <span className="btn-icon">🔄</span>
                        <span>Start New Conversation</span>
                    </button>
                </div>
            )}

            {isActive && (
                <div className="active-controls">
                    <div className="status-indicators">
                        {isListening && (
                            <div className="status-badge status-listening">
                                <div className="pulse-ring"></div>
                                <span className="status-dot listening-dot"></span>
                                <span>Listening...</span>
                            </div>
                        )}
                        {isSpeaking && (
                            <div className="status-badge status-speaking">
                                <span className="status-dot speaking-dot"></span>
                                <span>AI Speaking...</span>
                                <div className="sound-waves">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        {isLoading && (
                            <div className="status-badge status-thinking">
                                <span className="status-dot thinking-dot"></span>
                                <span>Thinking...</span>
                            </div>
                        )}
                    </div>

                    <button className="stop-button" onClick={onStop} id="stop-btn">
                        <span className="btn-icon">⏹️</span>
                        <span>End Early</span>
                    </button>
                </div>
            )}
        </div>
    );
}
