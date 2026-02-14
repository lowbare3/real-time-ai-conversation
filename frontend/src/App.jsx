import { useState, useEffect, useCallback, useRef } from "react";
import ImageDisplay from "./components/ImageDisplay";
import ConversationPanel from "./components/ConversationPanel";
import VoiceControls from "./components/VoiceControls";
import Confetti from "./components/Confetti";
import useConversation from "./hooks/useConversation";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import "./App.css";

const CONVERSATION_DURATION = 60; // 1 minute
const SILENCE_TIMEOUT = 6000; // 6 seconds of silence to auto-send (kid-friendly)

function App() {
  const [isActive, setIsActive] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(CONVERSATION_DURATION);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const svgRef = useRef(null);

  const {
    messages,
    isLoading,
    toolEffects,
    startConversation,
    sendMessage,
    resetConversation,
  } = useConversation();

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Speak text using browser TTS
  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (!text) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      // Try to use a friendly voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.name.includes("Female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Zira")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // Convert SVG to base64 for sending to Gemini
  const getSvgAsBase64 = useCallback(() => {
    const svgElement = document.querySelector(".jungle-scene");
    if (!svgElement) return null;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL("image/png").split(",")[1];
        resolve(base64);
      };
      img.onerror = () => {
        // Fallback: create a simple colored canvas
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(0, 400, 800, 200);
        ctx.font = "48px Arial";
        ctx.fillText("🦜🐒🐘🦒", 200, 300);
        const base64 = canvas.toDataURL("image/png").split(",")[1];
        resolve(base64);
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    });
  }, []);

  // Start the conversation
  const handleStart = useCallback(async () => {
    setError(null);
    setIsActive(true);
    setConversationEnded(false);
    setTimeRemaining(CONVERSATION_DURATION);
    resetConversation();

    try {
      const imageBase64 = await getSvgAsBase64();
      if (!imageBase64) {
        throw new Error("Could not capture image");
      }

      const aiText = await startConversation(imageBase64);

      // Speak the AI's opening line
      await speak(aiText);

      // Start listening for child's response
      startListening();
    } catch (err) {
      console.error("Failed to start:", err);
      setError(err.message || "Failed to start conversation. Check your API key.");
      setIsActive(false);
    }
  }, [getSvgAsBase64, startConversation, speak, startListening, resetConversation]);

  // Handle sending the user's speech to the AI
  const handleUserSpeech = useCallback(
    async (userText) => {
      if (!userText.trim() || !isActive) return;

      // Stop listening while we process
      stopListening();
      resetTranscript();

      try {
        const aiText = await sendMessage(userText, timeRemaining);

        // Speak AI response
        await speak(aiText);
      } catch (err) {
        console.error("Chat error:", err);
      }

      // ALWAYS resume listening after processing, regardless of errors
      // Use a small delay to avoid overlap with speech synthesis
      setTimeout(() => {
        if (timeRemaining > 3) {
          resetTranscript();
          startListening();
        }
      }, 500);
    },
    [
      isActive,
      timeRemaining,
      stopListening,
      resetTranscript,
      sendMessage,
      speak,
      startListening,
    ]
  );

  // Silence detection: auto-send after pause in speech
  useEffect(() => {
    if (!isListening || !transcript || isLoading || isSpeaking) return;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    silenceTimerRef.current = setTimeout(() => {
      const finalText = stopListening();
      if (finalText && finalText.trim() && finalText.trim().length > 1) {
        handleUserSpeech(finalText);
      } else {
        // No real speech detected, resume listening
        resetTranscript();
        startListening();
      }
    }, SILENCE_TIMEOUT);

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [transcript, isListening, isLoading, isSpeaking, stopListening, handleUserSpeech, resetTranscript, startListening]);

  // Countdown timer
  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // Handle conversation end (time's up)
  useEffect(() => {
    if (timeRemaining <= 0 && isActive) {
      stopListening();
      window.speechSynthesis.cancel();
      setIsActive(false);
      setConversationEnded(true);
      setIsSpeaking(false);
    }
  }, [timeRemaining, isActive, stopListening]);

  // Handle manual stop
  const handleStop = useCallback(() => {
    stopListening();
    window.speechSynthesis.cancel();
    setIsActive(false);
    setConversationEnded(true);
    setIsSpeaking(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [stopListening]);

  // Handle restart
  const handleRestart = useCallback(() => {
    setConversationEnded(false);
    resetConversation();
    handleStart();
  }, [resetConversation, handleStart]);

  // Load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  // Dynamic theme from AI tool call
  const themeStyle = toolEffects.themeColor
    ? { "--accent-color": toolEffects.themeColor }
    : {};

  return (
    <div className="app" style={themeStyle}>
      <div className="app-background"></div>

      <header className="app-header">
        <h1 className="app-title">
          <span className="title-emoji">🌟</span>
          Picture Talk
          <span className="title-emoji">🌟</span>
        </h1>
        <p className="app-subtitle">
          Explore the jungle with your AI friend!
        </p>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      <main className="app-main">
        <ImageDisplay
          stickers={toolEffects.stickers}
          funFact={toolEffects.funFact}
        />

        <div className="right-panel">
          <ConversationPanel
            messages={messages}
            isLoading={isLoading}
            timeRemaining={timeRemaining}
            isActive={isActive}
            transcript={transcript}
          />

          <VoiceControls
            isActive={isActive}
            isListening={isListening}
            isSpeaking={isSpeaking}
            isLoading={isLoading}
            onStart={handleStart}
            onStop={handleStop}
            isSupported={isSupported}
            conversationEnded={conversationEnded}
            onRestart={handleRestart}
          />
        </div>
      </main>

      <Confetti active={toolEffects.confetti} />
    </div>
  );
}

export default App;
