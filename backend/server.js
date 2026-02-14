import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Tool declarations for Gemini function calling
const toolDeclarations = [
    {
        functionDeclarations: [
            {
                name: "add_sticker",
                description:
                    "Add a fun emoji sticker on the image area to make the conversation more engaging for the child. Use this when the child mentions an animal, object, or emotion.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        emoji: {
                            type: "STRING",
                            description:
                                'The emoji to display, e.g. "🦁", "⭐", "🎈", "🌈"',
                        },
                        label: {
                            type: "STRING",
                            description:
                                'A short label for the sticker, e.g. "Lion", "Star"',
                        },
                    },
                    required: ["emoji", "label"],
                },
            },
            {
                name: "show_fun_fact",
                description:
                    "Display an interesting, child-friendly fun fact about something in the image or something the child mentioned. Use this to educate and delight the child.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        fact: {
                            type: "STRING",
                            description:
                                "A short, fun, child-friendly fact (1-2 sentences max)",
                        },
                    },
                    required: ["fact"],
                },
            },
            {
                name: "celebrate",
                description:
                    "Trigger a fun confetti/celebration animation on screen. Use this to encourage the child when they answer correctly or say something great.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        reason: {
                            type: "STRING",
                            description:
                                'Why we are celebrating, e.g. "Great answer!", "You are so smart!"',
                        },
                    },
                    required: ["reason"],
                },
            },
            {
                name: "change_theme",
                description:
                    "Change the background color theme of the app to match the mood of the conversation.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        color: {
                            type: "STRING",
                            description:
                                'A CSS color value like "#FFD700", "coral", "skyblue", "lavender"',
                        },
                        mood: {
                            type: "STRING",
                            description:
                                'The mood this color represents, e.g. "happy", "calm", "excited"',
                        },
                    },
                    required: ["color", "mood"],
                },
            },
        ],
    },
];

const SYSTEM_PROMPT = `You are a warm, enthusiastic, and friendly AI assistant talking to a young child (ages 4-8) about a picture they are looking at on their screen.

RULES:
- Keep your responses SHORT (1-3 sentences max). Children have short attention spans.
- Use simple words a 4-year-old can understand.
- Be encouraging, positive, and playful. Use exclamations like "Wow!", "Amazing!", "That's so cool!"
- Ask ONE engaging question at a time to keep the child talking.
- Reference specific things you can see in the image (animals, colors, objects).
- Use the tool functions to make the experience interactive:
  - Use "add_sticker" when the child mentions an animal or object — add a related emoji
  - Use "show_fun_fact" to share an interesting fact about something in the image
  - Use "celebrate" when the child gives a good answer or says something creative
  - Use "change_theme" occasionally to match the mood of the conversation
- You MUST use at least one tool call every 2-3 exchanges to keep things fun.
- The conversation is exactly 1 minute long. You will be told how much time is remaining.
- When the time is almost up (under 10 seconds), say a warm goodbye and tell the child they did a great job.

IMPORTANT: Always respond with BOTH text AND at least one tool call to keep the interaction dynamic.`;

// Retry helper for rate-limited requests
async function withRetry(fn, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit =
                error.status === 429 ||
                error.message?.includes("429") ||
                error.message?.includes("RESOURCE_EXHAUSTED");

            if (isRateLimit && attempt < maxRetries) {
                const delay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
                console.log(
                    `Rate limited, retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`
                );
                await new Promise((r) => setTimeout(r, delay));
            } else {
                throw error;
            }
        }
    }
}

// Store conversation sessions
const sessions = new Map();

// POST /api/start — Begin conversation with the image
app.post("/api/start", async (req, res) => {
    try {
        const { imageBase64, sessionId } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            tools: toolDeclarations,
            systemInstruction: SYSTEM_PROMPT,
        });

        const chat = model.startChat({
            history: [],
        });

        // Send image with opening prompt
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: "image/png",
            },
        };

        const result = await withRetry(() =>
            chat.sendMessage([
                imagePart,
                "Look at this picture! Start a fun, engaging conversation with the child about what you see. Remember to use a tool call too! Time remaining: 60 seconds.",
            ])
        );

        const response = result.response;
        const text = response.text();
        const functionCalls = response.functionCalls();

        // Store the chat session
        sessions.set(sessionId, { chat, startTime: Date.now() });

        res.json({
            text,
            toolCalls: functionCalls || [],
        });
    } catch (error) {
        console.error("Error starting conversation:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/chat — Continue the conversation
app.post("/api/chat", async (req, res) => {
    try {
        const { message, sessionId, timeRemaining } = req.body;

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        const timeContext =
            timeRemaining <= 10
                ? "TIME IS ALMOST UP! Say a warm goodbye and tell the child they did an amazing job. This is your LAST message."
                : `Time remaining: ${timeRemaining} seconds.`;

        const result = await withRetry(() =>
            session.chat.sendMessage(
                `Child says: "${message}"\n\n${timeContext}`
            )
        );

        const response = result.response;
        const text = response.text();
        const functionCalls = response.functionCalls();

        res.json({
            text,
            toolCalls: functionCalls || [],
        });
    } catch (error) {
        console.error("Error in chat:", error);
        res.status(500).json({ error: error.message });
    }
});

// Cleanup old sessions periodically
setInterval(() => {
    const now = Date.now();
    for (const [id, session] of sessions.entries()) {
        if (now - session.startTime > 5 * 60 * 1000) {
            sessions.delete(id);
        }
    }
}, 60000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
