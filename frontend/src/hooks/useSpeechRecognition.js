import { useState, useCallback, useRef, useEffect } from "react";

export default function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef(null);
    const accumulatedRef = useRef("");

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            let finalTranscript = "";
            let interimTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            if (finalTranscript) {
                accumulatedRef.current += " " + finalTranscript;
            }

            setTranscript(
                (accumulatedRef.current + " " + interimTranscript).trim()
            );
        };

        recognition.onerror = (event) => {
            console.warn("Speech recognition error:", event.error);
            // 'no-speech' is very common (kid pauses), just restart silently
            // 'aborted' means we intentionally stopped it
            if (event.error === "no-speech" || event.error === "aborted") {
                return; // onend will handle restart
            }
            // For other errors (network, not-allowed), stop properly
            if (event.error === "not-allowed") {
                setIsListening(false);
                recognitionRef.current._shouldListen = false;
            }
        };

        recognition.onend = () => {
            // Auto-restart if still supposed to be listening
            if (recognitionRef.current?._shouldListen) {
                // Small delay to avoid rapid-fire restarts
                setTimeout(() => {
                    if (recognitionRef.current?._shouldListen) {
                        try {
                            recognition.start();
                        } catch (e) {
                            // ignore - already started
                        }
                    }
                }, 200);
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.abort();
        };
    }, []);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;

        accumulatedRef.current = "";
        setTranscript("");
        recognitionRef.current._shouldListen = true;

        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch (e) {
            console.error("Failed to start recognition:", e);
        }
    }, []);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current) return;

        recognitionRef.current._shouldListen = false;
        recognitionRef.current.stop();
        setIsListening(false);

        const finalText = accumulatedRef.current.trim();
        accumulatedRef.current = "";
        return finalText;
    }, []);

    const resetTranscript = useCallback(() => {
        accumulatedRef.current = "";
        setTranscript("");
    }, []);

    return {
        isListening,
        transcript,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    };
}
